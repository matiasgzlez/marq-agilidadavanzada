import { defineConfig } from "vite";
import { cpSync } from "node:fs";

export default defineConfig({
  plugins: [
    {
      name: "copy-presentation-resources",
      closeBundle() {
        // Some images are selected by app.js and documents are linked directly.
        for (const folder of ["assets", "docs"]) {
          cpSync(
            new URL(`./${folder}`, import.meta.url),
            new URL(`./dist/${folder}`, import.meta.url),
            { recursive: true },
          );
        }
      },
    },
  ],
});
