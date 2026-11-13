import { describe, expect, test } from "bun:test";
import { gzipSync } from "node:zlib";

import { allContractClasses, buildPrebuilt } from "../src/prebuilt.ts";
import { button } from "../src/contracts/button.ts";
import { contractClasses } from "../src/registry.ts";
import { skinSets, skins } from "../src/skins.ts";
import { utilitiesLayer } from "./css.ts";

/** A class selector for this name, unscoped or under a skin scope: ".ca-button--md {" or ".ca-button--md:where(...". */
const hasRule = (layer: string, className: string) => new RegExp(`\\.${className}(?![\\w-])`).test(layer);

describe("prebuilt stylesheets", () => {
  for (const name of Object.keys(skins)) {
    test(`ca-${name}.css contains every contract class`, async () => {
      const layer = utilitiesLayer(await buildPrebuilt(name));
      const missing = allContractClasses().filter((className) => !layer.includes(`.${className} {`));
      expect(missing).toEqual([]);
    });

    // The home page promises "every component in one skin: 18 KB gzipped" (apps/calaca/site/docs/POSITIONING.md).
    test(`ca-${name}.css stays under 18 KB gzipped`, async () => {
      const css = await buildPrebuilt(name);
      expect(gzipSync(css).byteLength).toBeLessThanOrEqual(18 * 1024);
    });

    test(`ca-${name}.css leaves the host page's element styles alone`, async () => {
      const css = await buildPrebuilt(name);
      expect(css).not.toContain("@layer base {");
      expect(css).not.toMatch(/^\s*(html|body|button|h1|a|p|ul|img)\s*[,{]/m);
    });
  }

  for (const name of Object.keys(skinSets)) {
    /* A skin set scopes its classes by name; unscoped elements show the skeleton. */
    test(`ca-${name}.css covers every contract class under a skin scope`, async () => {
      const layer = utilitiesLayer(await buildPrebuilt(name));
      const missing = allContractClasses().filter((className) => !hasRule(layer, className));
      expect(missing).toEqual([]);
    });

    test(`ca-${name}.css leaves the host page's element styles alone`, async () => {
      const css = await buildPrebuilt(name);
      expect(css).not.toContain("@layer base {");
      expect(css).not.toMatch(/^\s*(html|body|button|h1|a|p|ul|img)\s*[,{]/m);
    });
  }

  test("a candidates list compiles only those classes", async () => {
    const layer = utilitiesLayer(await buildPrebuilt("base", { candidates: contractClasses(button) }));
    expect(layer).toContain(".ca-button--primary");
    expect(layer).not.toContain(".ca-dialog");
    expect(layer).not.toContain(".ca-card");
  });

  test("minify produces the same rules in a smaller file", async () => {
    const [plain, minified] = await Promise.all([buildPrebuilt("base"), buildPrebuilt("base", { minify: true })]);
    expect(minified.length).toBeLessThan(plain.length);
    expect(minified).toContain(".ca-button{");
    expect(minified).toContain(".ca-dialog{");
  });
});
