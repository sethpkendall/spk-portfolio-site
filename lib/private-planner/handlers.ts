import { mutationSchema, PlannerError } from "./domain";
import { createRepository } from "./repository";
import {
  errorResponse,
  privateHeaders,
  readJson,
  requireSameOrigin,
} from "./security";

export function createHandlers(
  authorize: () => Promise<string>,
  repository: ReturnType<typeof createRepository>,
) {
  return {
    async GET(request: Request) {
      try {
        const owner = await authorize();
        const plan = await repository.read(owner);
        if (new URL(request.url).searchParams.get("export") === "1") {
          return Response.json(
            { schemaVersion: 1, exportedAt: new Date().toISOString(), ...plan },
            {
              headers: {
                ...privateHeaders,
                "Content-Disposition":
                  'attachment; filename="private-meal-plan.json"',
              },
            },
          );
        }
        return Response.json({ plan }, { headers: privateHeaders });
      } catch (e) {
        return errorResponse(e);
      }
    },
    async POST(request: Request) {
      try {
        requireSameOrigin(request);
        const owner = await authorize();
        const parsed = mutationSchema.safeParse(await readJson(request));
        if (!parsed.success)
          throw new PlannerError(
            400,
            "Invalid planner change. Check dates, ingredient quantities, field lengths, and confirmation.",
          );
        return Response.json(
          await repository.mutate(
            owner,
            parsed.data.expectedRevision,
            parsed.data.command,
          ),
          { headers: privateHeaders },
        );
      } catch (e) {
        return errorResponse(e);
      }
    },
  };
}
