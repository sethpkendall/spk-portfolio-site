import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  applyCommand,
  emptyPlan,
  mutationSchema,
  weekStart,
  localToday,
  addDays,
  type Plan,
} from "../../lib/private-planner/domain";

const week = weekStart(localToday());
async function mockPlan(context: BrowserContext, initial = emptyPlan()) {
  const state = {
    plan: initial,
    writes: 0,
    expired: false,
    loseResponse: false,
    delay: 0,
  };
  await context.route("**/api/private-meal-planner*", async (route) => {
    if (state.expired)
      return route.fulfill({ status: 401, json: { error: "Sign in again." } });
    if (route.request().method() === "GET") {
      if (route.request().url().includes("export=1"))
        return route.fulfill({ json: { schemaVersion: 1, ...state.plan } });
      return route.fulfill({ json: { plan: state.plan } });
    }
    state.writes++;
    const { expectedRevision, command } = mutationSchema.parse(
      route.request().postDataJSON(),
    );
    if (expectedRevision !== state.plan.revision)
      return route.fulfill({
        status: 409,
        json: {
          error: "Your plan changed on another device. Refresh and review.",
        },
      });
    const result = applyCommand(state.plan, command);
    state.plan = result.plan;
    if (state.loseResponse) return route.abort("connectionreset");
    if (state.delay)
      await new Promise((resolve) => setTimeout(resolve, state.delay));
    await route.fulfill({ json: result }).catch(() => {});
  });
  await context.route("**/api/auth/sign-out", (route) =>
    route.fulfill({ json: { success: true } }),
  );
  return state;
}
async function startMeal(
  page: Page,
  title: string,
  date = week,
  type = "dinner",
) {
  await page
    .getByRole("button", { name: `Add ${type} ${date}`, exact: true })
    .click();
  await page.getByLabel("Meal name", { exact: true }).fill(title);
}
async function closeDialog(page: Page) {
  // Native desktop close and accessible mobile drawer dismiss share Escape.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

test("complete meal, prefill, grocery continuity, week copy, export and confirmed clear", async ({
  page,
  context,
}, info) => {
  const state = await mockPlan(context);
  await page.goto("/meal-planner");
  await expect(
    page.getByText("Your private plan is empty.", { exact: false }),
  ).toBeVisible();
  await startMeal(page, "Bean soup");
  await page
    .getByRole("button", { name: "Add ingredient", exact: true })
    .click();
  await page.getByLabel("Ingredient 1 name", { exact: true }).fill("Beans");
  await page.getByLabel("Ingredient 1 quantity", { exact: true }).fill("2.5");
  await page.getByLabel("Ingredient 1 unit", { exact: true }).fill("cups");
  await page.getByLabel("Tags", { exact: true }).fill("Quick, vegetarian");
  await page
    .getByLabel("Instructions", { exact: true })
    .fill("Simmer for 20 minutes.");
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Bean soup", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Edit Bean soup", exact: true })
    .click();
  await expect(page.getByLabel("Instructions", { exact: true })).toHaveValue(
    "Simmer for 20 minutes.",
  );
  await expect(
    page.getByLabel("Ingredient 1 quantity", { exact: true }),
  ).toHaveValue("2.5");
  await page.getByLabel("Meal name", { exact: true }).fill("Weeknight soup");
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await startMeal(page, "", addDays(week, 1), "lunch");
  await page
    .getByLabel("Prefill from a previous meal")
    .selectOption({ label: "Weeknight soup" });
  await expect(page.getByLabel("Tags", { exact: true })).toHaveValue(
    "Quick, vegetarian",
  );
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Groceries", exact: true }).click();
  await expect(page.getByLabel("Beans quantity", { exact: true })).toHaveValue(
    "5",
  );
  await page.getByLabel("Acquired Beans", { exact: true }).click();
  await expect(
    page.getByLabel("Acquired Beans", { exact: true }),
  ).toBeChecked();
  expect(state.plan.groceries[0].quantity).toBeNull();
  await page.getByLabel("Beans quantity", { exact: true }).fill("8");
  await page.getByRole("button", { name: "Save quantity" }).click();
  await expect.poll(() => state.plan.groceries[0].quantity).toBe(8);
  await page.getByLabel("New grocery item").fill("Paper towels");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("Paper towels", { exact: true })).toBeVisible();
  await closeDialog(page);
  await page.reload();
  await page.getByRole("button", { name: "Groceries", exact: true }).click();
  await expect(
    page.getByLabel("Acquired Beans", { exact: true }),
  ).toBeChecked();
  await expect(page.getByLabel("Beans quantity", { exact: true })).toHaveValue(
    "8",
  );
  await page.getByRole("button", { name: "Remove Beans", exact: true }).click();
  await expect(page.getByLabel("Acquired Beans", { exact: true })).toHaveCount(
    0,
  );
  await closeDialog(page);
  await page.getByRole("button", { name: "Copy week", exact: true }).click();
  await page.getByRole("button", { name: "Copy meals", exact: true }).click();
  await expect(
    page.getByText("Copied 2 meals; kept 0 occupied slots.", { exact: true }),
  ).toBeVisible();
  expect(state.plan.meals).toHaveLength(4);
  await page.getByRole("button", { name: "Copy week", exact: true }).click();
  await page.getByLabel("Copy behavior").selectOption("replace");
  await expect(
    page.getByRole("button", { name: "Copy meals", exact: true }),
  ).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Copy meals", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.screenshot({
    path: info.outputPath("private-planner.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const data = JSON.parse(
    await readFile((await (await downloaded).path())!, "utf8"),
  );
  expect(data.meals).toHaveLength(4);
  expect(data.recipes).toHaveLength(4);
  expect(data.schemaVersion).toBe(1);
  await page
    .getByRole("button", {
      name: "Delete all private planner data",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", { name: "Permanently delete private data" }),
  ).toBeDisabled();
  await page.getByLabel("Deletion confirmation").fill("DELETE PRIVATE PLAN");
  await page
    .getByRole("button", { name: "Permanently delete private data" })
    .click();
  await expect(
    page.getByText("Your private plan is empty.", { exact: false }),
  ).toBeVisible();
  expect(state.plan.meals).toHaveLength(0);
  expect(state.plan.foods).toHaveLength(0);
});

test("two clients reject stale writes and keep draft until deliberate refresh", async ({
  page,
  context,
}) => {
  const state = await mockPlan(context);
  const second = await context.newPage();
  await page.goto("/meal-planner");
  await second.goto("/meal-planner");
  await startMeal(page, "First device");
  await startMeal(second, "Keep this draft");
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "First device", exact: true }),
  ).toBeVisible();
  await second.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(second.getByRole("dialog").getByRole("alert")).toContainText(
    "another device",
  );
  await expect(second.getByLabel("Meal name", { exact: true })).toHaveValue(
    "Keep this draft",
  );
  await expect(
    second.getByRole("button", { name: "Save meal", exact: true }),
  ).toBeDisabled();
  expect(state.writes).toBe(2);
  second.once("dialog", (dialog) => dialog.accept());
  await second
    .getByRole("dialog")
    .getByRole("button", { name: "Discard draft and refresh" })
    .click();
  await expect(
    second.getByRole("heading", { name: "First device", exact: true }),
  ).toBeVisible();
  await second.close();
});

test("lost response blocks replay, offline drafts stay local, expiry clears the private view", async ({
  page,
  context,
}) => {
  const state = await mockPlan(context);
  await page.goto("/meal-planner");
  await startMeal(page, "Ambiguous soup");
  await context.setOffline(true);
  await expect(
    page.getByRole("button", { name: "Save meal", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel("Meal name", { exact: true })).toHaveValue(
    "Ambiguous soup",
  );
  expect(state.writes).toBe(0);
  await context.setOffline(false);
  state.loseResponse = true;
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "outcome unknown",
  );
  await expect(
    page.getByRole("button", { name: "Save meal", exact: true }),
  ).toBeDisabled();
  expect(state.writes).toBe(1);
  expect(state.plan.meals[0].title).toBe("Ambiguous soup");
  state.loseResponse = false;
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Discard draft and refresh" })
    .click();
  await page
    .getByRole("button", { name: "Edit Ambiguous soup", exact: true })
    .click();
  state.expired = true;
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Ambiguous soup", { exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("sign-out clears other tabs and ignores an outstanding mutation response", async ({
  page,
  context,
}) => {
  const state = await mockPlan(context);
  await page.goto("/meal-planner");
  const second = await context.newPage();
  await second.goto("/meal-planner");
  await startMeal(page, "Do not restore me");
  state.delay = 1000;
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect.poll(() => state.writes).toBe(1);
  await second.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(1200);
  await expect(
    page.getByRole("heading", { name: "Do not restore me", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await second.close();
});

test("managed sign-in UI handles provider errors and sends only OTP requests", async ({
  page,
}) => {
  await page.route(
    "**/api/auth/email-otp/send-verification-otp",
    async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        email: "owner@example.com",
        type: "sign-in",
      });
      await route.fulfill({ json: { success: true } });
    },
  );
  await page.route("**/api/auth/sign-in/email-otp", (route) =>
    route.fulfill({
      status: 400,
      json: { code: "INVALID_OTP", message: "Invalid code. Try again." },
    }),
  );
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("owner@example.com");
  await page.getByRole("button", { name: "Send sign-in code" }).click();
  await page.getByLabel("Email code", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Invalid code",
  );
});
