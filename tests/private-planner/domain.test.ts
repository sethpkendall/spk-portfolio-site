import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyCommand,
  commandSchema,
  emptyPlan,
  groceryRows,
  mealIngredients,
  mutationSchema,
  weekStart,
  type Command,
  type Plan,
} from "../../lib/private-planner/domain";

export const meal = (overrides = {}) =>
  commandSchema.parse({
    action: "saveMeal",
    date: "2026-11-15",
    type: "dinner",
    title: "Soup",
    tags: ["Quick", " quick "],
    instructions: "Simmer gently.",
    ingredients: [{ title: "Beans", quantity: 2, unit: "cups" }],
    ...overrides,
  });
const apply = (p: Plan, c: Command) => applyCommand(p, c).plan;

test("meal fields, stable identities, normalized tags/foods, and prefill survive edits", () => {
  let p = apply(emptyPlan(), meal());
  const first = structuredClone(p);
  p = apply(
    p,
    meal({
      id: p.meals[0].id,
      title: "Bean soup",
      ingredients: [{ title: " BEANS ", quantity: 3, unit: "cups" }],
    }),
  );
  assert.equal(p.meals[0].id, first.meals[0].id);
  assert.equal(p.recipes[0].id, first.recipes[0].id);
  assert.equal(p.foods[0].id, first.foods[0].id);
  assert.deepEqual(p.meals[0].tags, ["Quick"]);
  assert.equal(p.meals[0].instructions, "Simmer gently.");
  assert.deepEqual(mealIngredients(p, p.meals[0].id), [
    { title: "Beans", quantity: 3, unit: "cups" },
  ]);
  assert.equal(p.revision, 2);
});

test("invalid and forged payloads are rejected", () => {
  for (const patch of [
    { date: "2026-02-30" },
    { date: "2026-13-01" },
    { date: "1800-01-01" },
    { type: "snack" },
    { title: "" },
    { instructions: "x".repeat(20001) },
    { owner: "someone-else" },
    { ingredients: [{ title: "Beans", quantity: -1, unit: "cups" }] },
    { ingredients: [{ title: "Beans", quantity: Infinity, unit: "cups" }] },
  ]) {
    assert.equal(
      commandSchema.safeParse({ ...meal(), ...patch }).success,
      false,
    );
  }
  assert.equal(
    mutationSchema.safeParse({
      expectedRevision: 0,
      command: meal(),
      ownerId: "forged",
    }).success,
    false,
  );
  assert.equal(
    mutationSchema.safeParse({ expectedRevision: -1, command: meal() }).success,
    false,
  );
});

test("calendar week calculations handle leap days, year boundaries and DST", () => {
  assert.equal(weekStart("2024-02-29"), "2024-02-25");
  assert.equal(weekStart("2027-01-01"), "2026-12-27");
  assert.equal(weekStart("2026-03-09"), "2026-03-08");
});

test("week merge preserves occupied slots; replace requires confirmation and clones relationships", () => {
  let p = apply(emptyPlan(), meal());
  p = apply(p, meal({ date: "2026-11-16", type: "lunch", title: "Lunch" }));
  p = apply(p, meal({ date: "2026-11-22", title: "Keep me" }));
  const original = structuredClone(p);
  const cmd: Command = {
    action: "copyWeek",
    source: "2026-11-15",
    destination: "2026-11-22",
    mode: "merge",
    confirmReplace: false,
  };
  const result = applyCommand(p, cmd);
  assert.equal(result.message, "Copied 1 meals; kept 1 occupied slots.");
  assert.equal(
    result.plan.meals.find((m) => m.date === "2026-11-22")?.title,
    "Keep me",
  );
  const cloned = result.plan.meals.find((m) => m.date === "2026-11-23")!;
  assert.notEqual(cloned.id, p.meals[1].id);
  assert.deepEqual(
    mealIngredients(result.plan, cloned.id),
    mealIngredients(p, p.meals[1].id),
  );
  assert.throws(() => apply(p, { ...cmd, mode: "replace" }), /Confirm/);
  const replaced = apply(p, { ...cmd, mode: "replace", confirmReplace: true });
  assert.equal(replaced.meals.length, 4);
  assert.equal(
    replaced.meals.find((m) => m.date === "2026-11-22")?.title,
    "Soup",
  );
  assert.deepEqual(p, original, "domain writes do not mutate the input");
  assert.throws(
    () => apply(p, { ...cmd, destination: cmd.source }),
    /different/,
  );
});

test("groceries aggregate normalized food/unit without key collisions, persist overrides and removal", () => {
  let p = apply(
    emptyPlan(),
    meal({
      ingredients: [
        { title: "Beans", quantity: 2, unit: "cups" },
        { title: " beans ", quantity: 3, unit: "CUPS" },
        { title: "Beans", quantity: 1, unit: "can" },
        { title: "a|unit:b", quantity: 1, unit: "c" },
        { title: "a", quantity: 1, unit: "b|unit:c" },
      ],
    }),
  );
  const rows = groceryRows(p, "2026-11-15");
  assert.equal(rows.length, 4);
  const cups = rows.find((r) => r.unit === "cups")!;
  assert.equal(cups.quantity, 5);
  p = apply(p, {
    action: "setGrocery",
    weekStart: "2026-11-15",
    sourceKey: cups.sourceKey!,
    checked: true,
    removed: false,
    quantity: 7,
  });
  const updated = groceryRows(p, "2026-11-15").find(
    (r) => r.sourceKey === cups.sourceKey,
  )!;
  assert.equal(updated.quantity, 7);
  assert.equal(updated.checked, true);
  p = apply(p, {
    action: "setGrocery",
    weekStart: "2026-11-15",
    id: updated.id,
    quantity: 7,
    checked: true,
    removed: true,
  });
  assert.equal(groceryRows(p, "2026-11-15").length, 3);
  p = apply(p, {
    action: "addGrocery",
    weekStart: "2026-11-15",
    title: "Paper towels",
  });
  const free = p.groceries.find((g) => g.isFreeform)!;
  p = apply(p, {
    action: "setGrocery",
    weekStart: "2026-11-15",
    id: free.id,
    quantity: null,
    checked: false,
    removed: true,
  });
  assert.equal(
    p.groceries.some((g) => g.id === free.id),
    false,
  );
});

test("meal deletion removes orphan foods and clear retains a monotonically increasing revision", () => {
  const p = apply(emptyPlan(), meal());
  const deleted = apply(p, { action: "deleteMeal", id: p.meals[0].id });
  assert.deepEqual(deleted, { ...emptyPlan(), revision: 2 });
  assert.deepEqual(
    apply(p, { action: "clear", confirmation: "DELETE PRIVATE PLAN" }),
    { ...emptyPlan(), revision: 2 },
  );
  assert.throws(
    () => apply(p, meal({ id: "11111111-1111-4111-8111-111111111111" })),
    /no longer/,
  );
});
