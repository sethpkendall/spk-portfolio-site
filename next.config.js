/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  // Private previews use a different hostname from the loopback dev server.
  // Allow only that configured host so dev scripts and HMR can initialize.
  allowedDevOrigins:
    phase === PHASE_DEVELOPMENT_SERVER &&
    (process.env.PUBLIC_URL || process.env.APP_ORIGIN)
      ? [new URL(process.env.PUBLIC_URL || process.env.APP_ORIGIN).hostname]
      : [],
  images: {
    loader: "custom",
    formats: ["image/avif", "image/webp"],
  }
});
