import "server-only";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { createRepository } from "./repository";
import { PlannerError } from "./domain";

let pool: Pool | undefined;
export const repository = createRepository(async () => {
  if (!process.env.DATABASE_URL)
    throw new PlannerError(503, "Private planner setup is not complete.");
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      statement_timeout: 15_000,
    });
    attachDatabasePool(pool);
  }
  return pool.connect();
});
