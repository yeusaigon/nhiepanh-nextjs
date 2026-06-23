/** @type {import('next').NextConfig} */
console.log("--- CLOUDFLARE BUILD TIME ENVIRONMENT VARIABLES ---");
console.log(
  "NEXT_PUBLIC_FIREBASE_API_KEY status:",
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ? `DEFINED (starts with ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 6)})`
    : "UNDEFINED (mock-key fallback will be used)"
);
console.log("--------------------------------------------------");

const nextConfig = {
  output: "export",
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
};
module.exports = nextConfig;
