import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir:
    process.env.NEXT_TEST_INSTANCE === "1"
      ? ".next-auth-test"
      : ".next",
};

export default nextConfig;
