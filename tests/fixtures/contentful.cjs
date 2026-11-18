// Test-process-only CMS fixture. This file is never imported by the application.
// Preload explicitly to verify framework builds without real Contentful secrets.
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  if (new URL(url).hostname !== "graphql.contentful.com")
    return originalFetch(input, init);
  const post = {
    slug: "verification-fixture",
    title: "Verification fixture",
    coverImage: { url: "https://images.ctfassets.net/test/fixture.png" },
    date: "2026-11-18",
    author: {
      name: "Test author",
      picture: { url: "https://images.ctfassets.net/test/avatar.png" },
    },
    excerpt: "Synthetic test data, not live portfolio content.",
    lessons: [],
    content: {
      json: { nodeType: "document", data: {}, content: [] },
      links: { assets: { block: [] } },
    },
  };
  const query = JSON.parse(init?.body || "{}").query || "";
  return Response.json({
    data: {
      postCollection: { items: query.includes("slug_not_in") ? [] : [post] },
    },
  });
};
