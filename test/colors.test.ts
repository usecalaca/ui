// Raw color values belong in token declarations only: a skin sets --ca-* values,
// token aliases carry the contract's literal defaults as var() fallbacks, and
// every class reads colors through tokens and pigments.
import { describe, expect, test } from "bun:test";
import { Glob } from "bun";
import { join } from "node:path";

import { packageRoot } from "./css.ts";

const rawColor = /#[0-9a-f]{3,8}\b|\b(?:oklch|oklab|rgb|rgba|hsl|hsla|lab|lch)\(/i;
// Any custom-property declaration may hold a literal value: --ca-* tokens and
// --<axis>-* aliases (their var() fallbacks are the contract's own defaults).
const tokenDeclaration = /^\s*--[\w-]+:\s/;

async function files(pattern: string): Promise<string[]> {
  const found: string[] = [];
  for await (const path of new Glob(pattern).scan({ cwd: packageRoot })) found.push(path);
  return found.sort();
}

const stylesheets = [...(await files("skins/*.css")), ...(await files("src/**/*.css")), "core.css"];

describe("raw colors only inside --ca-* token declarations", () => {
  test("finds the stylesheets", () => {
    expect(stylesheets.length).toBeGreaterThan(5);
  });

  for (const path of stylesheets) {
    test(path, async () => {
      const offending = (await Bun.file(join(packageRoot, path)).text())
        .split("\n")
        .map((line, index) => ({ line: line.trim(), number: index + 1 }))
        .filter(({ line }) => rawColor.test(line) && !tokenDeclaration.test(line) && !line.startsWith("*") && !line.startsWith("/*"));
      expect(offending).toEqual([]);
    });
  }

  test("the check itself catches a raw color in a class rule", () => {
    expect(rawColor.test("@apply bg-[oklch(50%_0.1_20)];") && !tokenDeclaration.test("@apply bg-[oklch(50%_0.1_20)];")).toBe(true);
  });
});
