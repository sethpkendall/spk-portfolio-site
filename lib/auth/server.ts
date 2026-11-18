import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";
import { PlannerError } from "../private-planner/domain";
import { authorizeOwner } from "../private-planner/security";

export function authConfigured() {
  return Boolean(
    process.env.NEON_AUTH_BASE_URL &&
    process.env.NEON_AUTH_COOKIE_SECRET &&
    process.env.MEAL_PLANNER_OWNER_EMAIL,
  );
}
export function getAuth() {
  if (!authConfigured())
    throw new PlannerError(503, "Private planner setup is not complete.");
  return createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    logLevel: "silent",
  });
}
export async function requireOwner(): Promise<string> {
  const { data, error } = await getAuth().getSession({
    query: { disableCookieCache: "true" },
  });
  if (error)
    throw new PlannerError(
      error.status === 401 || error.status === 403 ? error.status : 503,
      "Your sign-in could not be verified. Please sign in again.",
    );
  return authorizeOwner(data, process.env.MEAL_PLANNER_OWNER_EMAIL);
}
