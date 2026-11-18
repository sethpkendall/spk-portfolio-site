import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import {
  createRepository,
  type Connect,
} from "../../lib/private-planner/repository";
import { commandSchema, emptyPlan } from "../../lib/private-planner/domain";

const command = commandSchema.parse({
  action: "saveMeal",
  date: "2026-11-15",
  type: "dinner",
  title: "Soup",
  tags: ["Quick"],
  instructions: "Simmer.",
  ingredients: [{ title: "Beans", quantity: 2.5, unit: "cups" }],
});

test("actual Postgres SQL: migration, isolation, atomic rollback, CAS and tombstones", async () => {
  const db = new PGlite();
  await db.exec(
    await readFile(
      new URL(
        "../../db/migrations/001_private_meal_planner.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  let fail = false;
  const connect: Connect = async () => ({
    query: async (sql, values) => {
      if (fail && sql.startsWith("INSERT INTO private_planner.recipes"))
        throw new Error("Injected write failure");
      return db.query(sql, values);
    },
    release() {},
  });
  const repository = createRepository(connect);
  try {
    assert.deepEqual(await repository.read("alice"), emptyPlan());
    const saved = (await repository.mutate("alice", 0, command)).plan;
    assert.deepEqual(await repository.read("alice"), saved);
    assert.deepEqual(await repository.read("bob"), emptyPlan());
    const bob = (await repository.mutate("bob", 0, command)).plan;
    await assert.rejects(
      db.query(
        "INSERT INTO private_planner.recipes(owner_id,id,meal_id,food_id,quantity,unit,sort_order) VALUES ($1,$2,$3,$4,1,'can',5)",
        ["bob", crypto.randomUUID(), bob.meals[0].id, saved.foods[0].id],
      ),
      /foreign key/,
    );
    await assert.rejects(
      repository.mutate("alice", 0, command),
      /another device/,
    );
    fail = true;
    await assert.rejects(
      repository.mutate("alice", 1, {
        ...command,
        action: "saveMeal",
        id: saved.meals[0].id,
        title: "Must roll back",
      } as any),
      /Injected/,
    );
    fail = false;
    assert.deepEqual(
      await repository.read("alice"),
      saved,
      "failed transaction preserves every collection and revision",
    );
    const cleared = (
      await repository.mutate("alice", 1, {
        action: "clear",
        confirmation: "DELETE PRIVATE PLAN",
      })
    ).plan;
    assert.deepEqual(cleared, { ...emptyPlan(), revision: 2 });
    await assert.rejects(
      repository.mutate("alice", 1, command),
      /another device/,
    );
    assert.deepEqual(
      await repository.read("bob"),
      bob,
      "clear cannot affect another owner",
    );
    assert.equal(
      (await repository.mutate("alice", 2, command)).plan.revision,
      3,
    );
  } finally {
    await db.close();
  }
});
