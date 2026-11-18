import { test, expect } from "@playwright/test";
import { emptyPlan } from "../../lib/private-planner/domain";

test("public routes stay public and real private API/proxy routes fail closed", async ({
  request,
}) => {
  for (const path of [
    "/showcase",
    "/trellis-calendar",
    "/privacy/trellis-calendar",
    "/terms/trellis-calendar",
  ]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  for (const path of [
    "/api/private-meal-planner",
    "/api/private-meal-planner?export=1",
  ]) {
    const response = await request.get(path);
    // Inert provider cannot verify a session; no database is reachable either.
    expect([401, 503]).toContain(response.status());
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(await response.text()).not.toContain('"meals"');
  }
  expect(
    (
      await request.post("/api/private-meal-planner", {
        data: {},
        headers: { origin: "https://evil.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/auth/email-otp/send-verification-otp", {
        data: { email: "other@example.com", type: "sign-in" },
        headers: { origin: "http://127.0.0.1:3108" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/auth/sign-up/email", {
        data: {},
        headers: { origin: "http://127.0.0.1:3108" },
      })
    ).status(),
  ).toBe(404);
});

test("demo IndexedDB survives private visits, clear and sign-out without uploading local meals", async ({
  page,
  context,
}) => {
  let privateWrites = 0;
  await context.route("**/api/private-meal-planner*", async (route) => {
    if (route.request().method() === "POST") {
      privateWrites++;
      expect(route.request().postDataJSON().command).toEqual({
        action: "clear",
        confirmation: "DELETE PRIVATE PLAN",
      });
    }
    await route.fulfill({ json: { plan: emptyPlan(), message: "Cleared." } });
  });
  await context.route("**/api/auth/sign-out", (route) =>
    route.fulfill({ json: { success: true } }),
  );
  await page.goto("/showcase/meal-planner");
  await expect
    .poll(async () =>
      page.evaluate(async () =>
        (await indexedDB.databases()).some((db) => db.name === "MealPlannerDB"),
      ),
    )
    .toBe(true);
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("MealPlannerDB");
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("meals", "readwrite");
        tx.objectStore("meals").put({
          id: 987654,
          title: "LOCAL ONLY SENTINEL",
          date: new Date(),
          type: "dinner",
          tags: ["Local"],
        });
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
    });
  });
  await page.goto("/meal-planner");
  await expect(
    page.getByText("Your private plan is empty.", { exact: false }),
  ).toBeVisible();
  expect(privateWrites).toBe(0);
  await expect(
    page.getByText("LOCAL ONLY SENTINEL", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Delete all private planner data",
      exact: true,
    })
    .click();
  await page.getByLabel("Deletion confirmation").fill("DELETE PRIVATE PLAN");
  await page
    .getByRole("button", { name: "Permanently delete private data" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/auth\/sign-in/);
  const stored = await page.evaluate(async () => {
    return new Promise<any>((resolve, reject) => {
      const request = indexedDB.open("MealPlannerDB");
      request.onsuccess = () => {
        const db = request.result;
        const row = db.transaction("meals").objectStore("meals").get(987654);
        row.onsuccess = () => {
          db.close();
          resolve(row.result);
        };
        row.onerror = () => reject(row.error);
      };
    });
  });
  expect(stored.title).toBe("LOCAL ONLY SENTINEL");
  expect(privateWrites).toBe(1);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage)
        .concat(Object.keys(sessionStorage))
        .filter((key) => /private.*plan/i.test(key)),
    ),
  ).toEqual([]);
  await page.goto("/showcase/meal-planner");
  await expect(page.getByRole("main").first()).toBeVisible();
});
