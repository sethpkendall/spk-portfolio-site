import { getAuth } from "@/lib/auth/server";
import { createAuthHandlers } from "@/lib/private-planner/auth-handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const { GET, POST } = createAuthHandlers(
  () => getAuth().handler(),
  () => process.env.MEAL_PLANNER_OWNER_EMAIL,
);
