import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",

    include: ["src/**/*.integration.test.ts"],

    clearMocks: true,

    fileParallelism: false,

    maxWorkers: 1,
  },

  resolve: {
    alias: {
      "server-only": path.resolve(
        import.meta.dirname,
        "./tests/mocks/server-only.ts",
      ),

      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});