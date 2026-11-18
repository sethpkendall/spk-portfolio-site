import { PlannerError } from "./domain";

type Session = {
  user?: { id?: string; email?: string; emailVerified?: boolean };
} | null;
export function authorizeOwner(
  session: Session,
  ownerEmail: string | undefined,
): string {
  if (!ownerEmail?.trim())
    throw new PlannerError(503, "Private planner setup is not complete.");
  if (!session?.user?.id)
    throw new PlannerError(401, "Sign in to your private planner.");
  if (
    session.user.emailVerified !== true ||
    session.user.email?.trim().toLowerCase() !== ownerEmail.trim().toLowerCase()
  )
    throw new PlannerError(
      403,
      "This private planner is restricted to its verified owner.",
    );
  return session.user.id;
}
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.APP_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== expected)
    throw new PlannerError(403, "Request origin is not allowed.");
  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() !== "application/json"
  )
    throw new PlannerError(415, "Use a JSON request.");
}
export async function readJson(
  request: Request,
  limit = 65536,
): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new PlannerError(400, "A JSON body is required.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new PlannerError(413, "Request is too large.");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    chunks.forEach((c) => {
      bytes.set(c, offset);
      offset += c.length;
    });
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new PlannerError(400, "Invalid JSON.");
    }
  } finally {
    reader.releaseLock();
  }
}
export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
  "X-Content-Type-Options": "nosniff",
};
export function errorResponse(e: unknown): Response {
  const known = e instanceof PlannerError;
  return Response.json(
    {
      error: known
        ? e.message
        : "The request could not be confirmed. Refresh and review before trying again.",
    },
    { status: known ? e.status : 503, headers: privateHeaders },
  );
}
