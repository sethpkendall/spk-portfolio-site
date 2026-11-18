import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Client } from "pg";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED;
  if (!url || new URL(url).hostname.includes("-pooler"))
    throw new Error("Set a direct DATABASE_URL_UNPOOLED before migrating.");
  if (process.argv[2] !== "--apply")
    throw new Error(
      "Review db/migrations/001_private_meal_planner.sql, then run with --apply on the intended development branch.",
    );
  const sql = await readFile(
    new URL("../db/migrations/001_private_meal_planner.sql", import.meta.url),
    "utf8",
  );
  const hash = createHash("sha256").update(sql).digest("hex");
  const db = new Client({ connectionString: url });
  await db.connect();
  try {
    await db.query("BEGIN");
    await db.query("SELECT pg_advisory_xact_lock(68209341)");
    await db.query(
      "CREATE TABLE IF NOT EXISTS public.planner_migrations (id text PRIMARY KEY, sha256 text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())",
    );
    const existing = await db.query(
      "SELECT sha256 FROM public.planner_migrations WHERE id = '001_private_meal_planner'",
    );
    if (existing.rows.length && existing.rows[0].sha256 !== hash)
      throw new Error(
        "Applied migration checksum differs; create a new migration instead of rewriting history.",
      );
    if (!existing.rows.length) {
      await db.query(sql);
      await db.query(
        "INSERT INTO public.planner_migrations (id, sha256) VALUES ('001_private_meal_planner', $1)",
        [hash],
      );
    }
    await db.query("COMMIT");
    console.log(
      existing.rows.length
        ? "Migration already applied; checksum verified."
        : "Private planner migration applied.",
    );
  } catch (e) {
    await db.query("ROLLBACK");
    throw e;
  } finally {
    await db.end();
  }
}
main().catch(() => {
  console.error(
    "Migration failed. Check the target branch and schema; no credential or query details are logged.",
  );
  process.exitCode = 1;
});
