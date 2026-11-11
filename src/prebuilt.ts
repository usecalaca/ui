import { join } from "node:path";

import { compileCss } from "./compile.ts";
import { allContracts, contractClasses } from "./registry.ts";

const packageRoot = join(import.meta.dir, "..");

/** Every contract class, so a page without a Tailwind build can use any element. */
export function allContractClasses(): string[] {
  return allContracts.flatMap(contractClasses);
}

/**
 * Core and one skin for projects without a Tailwind build. No preflight or
 * other element styles, so it can drop into an existing site. Token values
 * (--ca-*) come from a skin or a brand stylesheet linked next to it.
 */
export function buildPrebuilt(skinName: string): Promise<string> {
  return buildPrebuiltFrom(`./skins/${skinName}.css`);
}

/** Like buildPrebuilt, for a skin stylesheet anywhere (absolute, or relative to this package). */
export function buildPrebuiltFrom(skinStylesheet: string): Promise<string> {
  const css = [
    "@layer theme, base, components, utilities;",
    '@import "tailwindcss/theme.css" layer(theme);',
    '@import "tailwindcss/utilities.css" layer(utilities);',
    '@import "./core.css";',
    `@import "${skinStylesheet}";`,
  ].join("\n");
  return compileCss(css, packageRoot, allContractClasses());
}
