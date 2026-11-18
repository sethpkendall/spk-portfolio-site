import { z } from "zod";
import { PlannerError } from "./domain";
import {
  errorResponse,
  privateHeaders,
  readJson,
  requireSameOrigin,
} from "./security";

type Context = { params: Promise<{ path: string[] }> };
type Handler = (request: Request, context: Context) => Promise<Response>;
const email = z.string().trim().email().max(254);
const sendCode = z.object({ email, type: z.literal("sign-in") }).strict();
const signIn = z
  .object({ email, otp: z.string().trim().min(1).max(32) })
  .strict();

// Only managed OTP/session/sign-out endpoints are exposed. The provider handles
// verification and rate limiting; this boundary cannot mint or trust sessions.
export function createAuthHandlers(
  provider: () => { GET: Handler; POST: Handler },
  ownerEmail: () => string | undefined,
) {
  async function forward(
    method: "GET" | "POST",
    request: Request,
    context: Context,
  ) {
    const response = await provider()[method](request, context);
    for (const [key, value] of Object.entries(privateHeaders))
      response.headers.set(key, value);
    return response;
  }
  return {
    async GET(request: Request, context: Context) {
      try {
        if ((await context.params).path.join("/") !== "get-session")
          throw new PlannerError(404, "Auth route not available.");
        return await forward("GET", request, context);
      } catch (e) {
        return errorResponse(e);
      }
    },
    async POST(request: Request, context: Context) {
      try {
        requireSameOrigin(request);
        const path = (await context.params).path.join("/");
        if (
          ![
            "email-otp/send-verification-otp",
            "sign-in/email-otp",
            "sign-out",
          ].includes(path)
        )
          throw new PlannerError(404, "Auth route not available.");
        const body = await readJson(request, 4096);
        const schema: z.ZodType<{ email?: string }> =
          path === "sign-out"
            ? z.object({}).strict()
            : path === "sign-in/email-otp"
              ? signIn
              : sendCode;
        const parsed = schema.safeParse(body);
        if (!parsed.success)
          throw new PlannerError(400, "Invalid sign-in request.");
        if (path !== "sign-out") {
          const owner = ownerEmail()?.trim().toLowerCase();
          if (!owner)
            throw new PlannerError(
              503,
              "Private planner setup is not complete.",
            );
          if (parsed.data.email?.toLowerCase() !== owner)
            throw new PlannerError(
              403,
              "This private planner is restricted to its owner.",
            );
        }
        // Forward only the bounded, validated body; do not tee an unbounded
        // request stream or pass unchecked fields through to the provider.
        const headers = new Headers(request.headers);
        headers.delete("content-length");
        headers.delete("transfer-encoding");
        return await forward(
          "POST",
          new Request(request.url, {
            method: "POST",
            headers,
            body: JSON.stringify(parsed.data),
          }),
          context,
        );
      } catch (e) {
        return errorResponse(e);
      }
    },
  };
}
