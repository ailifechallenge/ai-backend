import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: { proxy: { "/api": (loadEnv(mode, ".", "ACTIONGUARD_").ACTIONGUARD_BACKEND_PORT ? "http://127.0.0.1:" + loadEnv(mode, ".", "ACTIONGUARD_").ACTIONGUARD_BACKEND_PORT : loadEnv(mode, ".", "ACTIONGUARD_").ACTIONGUARD_API_TARGET) || "http://127.0.0.1:8000" } },
  test: { environment: "jsdom", setupFiles: ["./src/test-setup.ts"] },
}));
