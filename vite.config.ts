import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { buildMetaTags, ROUTES, seoConfigs } from "./src/data/seo.ts";
import type { HeadMeta } from "./src/data/seo.ts";

function escapeAttr(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(input: string): string {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderHeadTag(item: HeadMeta): string {
  const attrs = Object.entries(item.attrs)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(" ");
  const tagName = item.tag === "link" ? "link" : "meta";
  return `<${tagName} id="${escapeAttr(item.id)}" ${attrs}>`;
}

function generateSeoHtml(): Plugin {
  return {
    name: "generate-seo-html",
    apply: "build",
    closeBundle() {
      const distDir = join(process.cwd(), "dist");
      const indexHtmlPath = join(distDir, "index.html");
      const template = readFileSync(indexHtmlPath, "utf8");

      for (const route of ROUTES) {
        const config = seoConfigs[route.key];
        const metaHtml = buildMetaTags(config)
          .map(renderHeadTag)
          .join("\n");

        const html = template
          .replace(/<title[^>]*>[\s\S]*?<\/title>/, () => `<title>${escapeHtmlText(config.title)}</title>`)
          .replace("</head>", `${metaHtml}\n</head>`);

        if (route.dir === "") {
          writeFileSync(indexHtmlPath, html);
        } else {
          const outputPath = join(distDir, route.dir, "index.html");
          mkdirSync(dirname(outputPath), { recursive: true });
          writeFileSync(outputPath, html);
        }
      }
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), generateSeoHtml()],
});