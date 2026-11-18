import { applyCommand, Command, emptyPlan, Plan, PlannerError } from "./domain";

// Small structural interface lets the exact SQL run against Postgres and PGlite.
export interface Connection {
  query(sql: string, values?: any[]): Promise<{ rows: any[] }>;
  release(): void;
}
export type Connect = () => Promise<Connection>;

async function snapshot(db: Connection, owner: string): Promise<Plan> {
  const p = emptyPlan();
  const state = await db.query(
    "SELECT revision FROM private_planner.plans WHERE owner_id = $1",
    [owner],
  );
  p.revision = Number(state.rows[0]?.revision || 0);
  p.foods = (
    await db.query(
      'SELECT id, title, normalized_title AS "normalizedTitle" FROM private_planner.foods WHERE owner_id = $1 ORDER BY id',
      [owner],
    )
  ).rows;
  p.meals = (
    await db.query(
      "SELECT id, date::text, type, title, instructions, tags FROM private_planner.meals WHERE owner_id = $1 ORDER BY date, type",
      [owner],
    )
  ).rows;
  p.recipes = (
    await db.query(
      'SELECT id, meal_id AS "mealId", food_id AS "foodId", quantity, unit, sort_order AS "sortOrder" FROM private_planner.recipes WHERE owner_id = $1 ORDER BY meal_id, sort_order',
      [owner],
    )
  ).rows;
  p.groceries = (
    await db.query(
      'SELECT id, week_start::text AS "weekStart", source_key AS "sourceKey", title, quantity, unit, checked, removed, is_freeform AS "isFreeform" FROM private_planner.groceries WHERE owner_id = $1 ORDER BY id',
      [owner],
    )
  ).rows;
  return p;
}

// Persist a bounded personal snapshot inside the locked transaction. The client
// never supplies a replacement snapshot: only validated, narrow commands.
async function persist(db: Connection, owner: string, p: Plan) {
  for (const table of ["recipes", "groceries", "meals", "foods"]) {
    await db.query(`DELETE FROM private_planner.${table} WHERE owner_id = $1`, [
      owner,
    ]);
  }
  await db.query(
    `INSERT INTO private_planner.foods (owner_id, id, title, normalized_title)
    SELECT $1, id, title, "normalizedTitle" FROM jsonb_to_recordset($2::jsonb) AS x(id uuid, title text, "normalizedTitle" text)`,
    [owner, JSON.stringify(p.foods)],
  );
  await db.query(
    `INSERT INTO private_planner.meals (owner_id, id, date, type, title, instructions, tags)
    SELECT $1, id, date, type, title, instructions, tags FROM jsonb_to_recordset($2::jsonb) AS x(id uuid, date date, type text, title text, instructions text, tags text[])`,
    [owner, JSON.stringify(p.meals)],
  );
  await db.query(
    `INSERT INTO private_planner.recipes (owner_id, id, meal_id, food_id, quantity, unit, sort_order)
    SELECT $1, id, "mealId", "foodId", quantity, unit, "sortOrder" FROM jsonb_to_recordset($2::jsonb) AS x(id uuid, "mealId" uuid, "foodId" uuid, quantity double precision, unit text, "sortOrder" integer)`,
    [owner, JSON.stringify(p.recipes)],
  );
  await db.query(
    `INSERT INTO private_planner.groceries (owner_id, id, week_start, source_key, title, quantity, unit, checked, removed, is_freeform)
    SELECT $1, id, "weekStart", "sourceKey", title, quantity, unit, checked, removed, "isFreeform" FROM jsonb_to_recordset($2::jsonb) AS x(id uuid, "weekStart" date, "sourceKey" text, title text, quantity double precision, unit text, checked boolean, removed boolean, "isFreeform" boolean)`,
    [owner, JSON.stringify(p.groceries)],
  );
  await db.query(
    "UPDATE private_planner.plans SET revision = $2 WHERE owner_id = $1",
    [owner, p.revision],
  );
}

export function createRepository(connect: Connect) {
  return {
    async read(owner: string): Promise<Plan> {
      const db = await connect();
      try {
        await db.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
        const p = await snapshot(db, owner);
        await db.query("COMMIT");
        return p;
      } catch (e) {
        await db.query("ROLLBACK");
        throw e;
      } finally {
        db.release();
      }
    },
    async mutate(owner: string, expectedRevision: number, command: Command) {
      const db = await connect();
      try {
        await db.query("BEGIN");
        await db.query(
          "INSERT INTO private_planner.plans (owner_id) VALUES ($1) ON CONFLICT DO NOTHING",
          [owner],
        );
        const state = await db.query(
          "SELECT revision FROM private_planner.plans WHERE owner_id = $1 FOR UPDATE",
          [owner],
        );
        if (Number(state.rows[0].revision) !== expectedRevision)
          throw new PlannerError(
            409,
            "Your plan changed on another device. Keep a copy of your draft, then refresh and review before saving again.",
          );
        const result = applyCommand(await snapshot(db, owner), command);
        await persist(db, owner, result.plan);
        await db.query("COMMIT");
        return result;
      } catch (e) {
        await db.query("ROLLBACK");
        throw e;
      } finally {
        db.release();
      }
    },
  };
}
