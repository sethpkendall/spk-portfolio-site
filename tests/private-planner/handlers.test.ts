import { test } from "node:test";
import assert from "node:assert/strict";
import { authorizeOwner, readJson } from "../../lib/private-planner/security";
import { createHandlers } from "../../lib/private-planner/handlers";
import { emptyPlan, PlannerError } from "../../lib/private-planner/domain";

const url = "http://localhost/api/private-meal-planner";
const payload = {
  expectedRevision: 0,
  command: { action: "addGrocery", weekStart: "2026-11-15", title: "Coffee" },
};
const request = (body: unknown = payload, headers = {}) =>
  new Request(url, {
    method: "POST",
    headers: {
      origin: "http://localhost",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

test("owner authorization fails closed for missing config, anonymous, unverified and wrong owner", () => {
  const owner = "owner@example.com";
  const session = {
    user: { id: "provider-user-id", email: owner, emailVerified: true },
  };
  assert.equal(
    authorizeOwner(session, " OWNER@example.com "),
    "provider-user-id",
  );
  for (const [input, email, status] of [
    [session, undefined, 503],
    [null, owner, 401],
    [{ user: { ...session.user, emailVerified: false } }, owner, 403],
    [{ user: { ...session.user, email: "other@example.com" } }, owner, 403],
    [{ user: { ...session.user, emailVerified: "true" } }, owner, 403],
  ] as const) {
    assert.throws(
      () => authorizeOwner(input as any, email),
      (e: any) => e.status === status,
    );
  }
});

test("each private read/write/export authenticates before accessing data and never caches denial", async () => {
  for (const status of [401, 403, 503]) {
    const handlers = createHandlers(
      async () => {
        throw new PlannerError(status, "Denied");
      },
      {
        read: async () => {
          throw new Error("Must not query");
        },
        mutate: async () => {
          throw new Error("Must not write");
        },
      },
    );
    for (const response of [
      await handlers.GET(new Request(url)),
      await handlers.GET(new Request(url + "?export=1")),
      await handlers.POST(request()),
    ]) {
      assert.equal(response.status, status);
      assert.match(response.headers.get("cache-control")!, /no-store/);
    }
  }
});

test("origin, JSON, forged owner, unknown keys and request size are validated before mutation", async () => {
  let writes = 0;
  const handlers = createHandlers(async () => "server-owner", {
    read: async () => emptyPlan(),
    mutate: async () => {
      writes++;
      return { plan: emptyPlan(), message: "Saved." };
    },
  });
  for (const [req, status] of [
    [request(payload, { origin: "https://evil.example" }), 403],
    [request(payload, { origin: "" }), 403],
    [request(payload, { "content-type": "text/plain" }), 415],
    [request({ ...payload, ownerId: "forged" }), 400],
    [
      request({
        ...payload,
        command: { ...payload.command, ownerId: "forged" },
      }),
      400,
    ],
    [request({ ...payload, expectedRevision: -1 }), 400],
    [request({ value: "x".repeat(70000) }), 413],
  ] as const) {
    assert.equal((await handlers.POST(req)).status, status);
  }
  assert.equal(writes, 0);
  assert.equal((await handlers.POST(request())).status, 200);
  assert.equal(writes, 1);
});

test("reads/export preserve all collections; mutation errors are sanitized", async () => {
  const owners: string[] = [];
  const handlers = createHandlers(async () => "server-owner", {
    read: async (owner) => {
      owners.push(owner);
      return emptyPlan();
    },
    mutate: async () => {
      throw new Error("postgres://secret:password@database");
    },
  });
  const response = await handlers.GET(new Request(url + "?export=1"));
  const exported = await response.json();
  assert.equal(exported.schemaVersion, 1);
  for (const key of ["meals", "foods", "recipes", "groceries"])
    assert.deepEqual(exported[key], []);
  assert.deepEqual(owners, ["server-owner"]);
  assert.match(response.headers.get("content-disposition")!, /attachment/);
  const failed = await handlers.POST(request());
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /password|postgres/);
});

test("invalid and streamed oversized JSON are rejected without trusting content-length", async () => {
  await assert.rejects(
    readJson(new Request(url, { method: "POST", body: "{" })),
    (e: any) => e.status === 400,
  );
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(3000));
      controller.enqueue(new Uint8Array(3000));
      controller.close();
    },
  });
  await assert.rejects(
    readJson(
      new Request(url, {
        method: "POST",
        body: stream,
        duplex: "half",
      } as RequestInit),
      4096,
    ),
    (e: any) => e.status === 413,
  );
});
