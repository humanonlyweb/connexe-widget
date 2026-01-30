import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue({ features: { customElement: true } })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: "src/main.ts",
      name: "ConnexeWidgets",
      fileName: (format) => {
        if (format === "es") return "widget.js";
        if (format === "umd") return "widget.umd.js";
        return `widget.${format}.js`;
      },
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
