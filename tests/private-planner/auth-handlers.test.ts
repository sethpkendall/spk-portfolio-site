import { test } from "node:test";
import assert from "node:assert/strict";
import { createAuthHandlers } from "../../lib/private-planner/auth-handlers";

test("auth proxy only forwards owner OTP, session and sign-out and preserves provider cookies", async () => {
  let forwarded = 0;
  let owner: string | undefined = "owner@example.com";
  const forward = async (request: Request) => {
    if (request.method === "POST") {
      const body = await request.json();
      assert.ok(
        Object.keys(body).every((key) =>
          ["email", "type", "otp"].includes(key),
        ),
      );
      assert.equal(request.headers.has("content-length"), false);
    }
    forwarded++;
    return Response.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": "provider-cookie=opaque; HttpOnly; SameSite=Lax",
        },
      },
    );
  };
  const handlers = createAuthHandlers(
    () => ({ GET: forward, POST: forward }),
    () => owner,
  );
  const post = (path: string, body: unknown, origin = "http://localhost") =>
    handlers.POST(
      new Request("http://localhost/api/auth/" + path, {
        method: "POST",
        headers: { origin, "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
      { params: Promise.resolve({ path: path.split("/") }) },
    );
  const send = "email-otp/send-verification-otp";
  for (const [path, body, status] of [
    [send, { email: "other@example.com", type: "sign-in" }, 403],
    [send, { email: owner, type: "email-verification" }, 400],
    ["sign-up/email", { email: owner }, 404],
    ["sign-in/social", { provider: "google" }, 404],
    [
      "sign-in/email-otp",
      { email: owner, otp: "123456", ownerId: "forged" },
      400,
    ],
    ["sign-out", { callbackURL: "https://evil.example" }, 400],
  ] as const) {
    assert.equal((await post(path, body)).status, status);
  }
  assert.equal(
    (
      await post(
        send,
        { email: owner, type: "sign-in" },
        "https://evil.example",
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await post(send, {
        email: owner,
        type: "sign-in",
        oversized: "x".repeat(5000),
      })
    ).status,
    413,
  );
  owner = undefined;
  assert.equal(
    (await post(send, { email: "owner@example.com", type: "sign-in" })).status,
    503,
  );
  assert.equal(forwarded, 0);
  owner = "owner@example.com";
  for (const [path, body] of [
    [send, { email: owner, type: "sign-in" }],
    ["sign-in/email-otp", { email: owner, otp: "123456" }],
    ["sign-out", {}],
  ] as const) {
    const response = await post(path, body);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control")!, /no-store/);
    assert.match(response.headers.get("set-cookie")!, /HttpOnly/);
  }
  assert.equal(
    (
      await handlers.GET(new Request("http://localhost/api/auth/get-session"), {
        params: Promise.resolve({ path: ["get-session"] }),
      })
    ).status,
    200,
  );
  assert.equal(forwarded, 4);
});
