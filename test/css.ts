import { join } from "node:path";

import { compileCss } from "../src/compile.ts";

export const packageRoot = join(import.meta.dir, "..");

/** Stylesheet for core plus one skin, as a consumer with a Tailwind build would write it. */
export function consumerCss(skinName: string): string {
  return `@import "tailwindcss";\n@import "./core.css";\n@import "./skins/${skinName}.css";\n`;
}

/** Stylesheet with only core, or only tokens plus a skin, to inspect one layer at a time. */
export const coreOnlyCss = `@import "tailwindcss";\n@import "./core.css";\n`;
export function skinOnlyCss(skinName: string): string {
  return `@import "tailwindcss";\n@import "./src/tokens.css";\n@import "./skins/${skinName}.css";\n`;
}

export function build(css: string, candidates: string[]): Promise<string> {
  return compileCss(css, packageRoot, candidates);
}

/** The utilities layer of compiled CSS. */
export function utilitiesLayer(css: string): string {
  const start = css.indexOf("@layer utilities {");
  if (start < 0) return "";
  const end = css.indexOf("\n}\n", start);
  return css.slice(start, end < 0 ? undefined : end);
}

/** The bodies of every top-level rule for a class in the utilities layer, joined in order. */
export function rules(layer: string, className: string): string {
  const parts: string[] = [];
  let start = layer.indexOf(`  .${className} {`);
  while (start >= 0) {
    const end = layer.indexOf("\n  }\n", start);
    parts.push(layer.slice(start, end < 0 ? undefined : end));
    start = layer.indexOf(`  .${className} {`, start + 1);
  }
  return parts.join("\n");
}

/** Real CSS properties (not custom properties) a single class declares, across all its states. */
export async function declaredProperties(css: string, className: string): Promise<Set<string>> {
  const layer = utilitiesLayer(await build(css, [className]));
  return new Set([...layer.matchAll(/^[ \t]*([a-z][a-z-]*):[ \t][^{;\n]*;$/gm)].map((match) => match[1] as string));
}
