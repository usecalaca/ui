import { describe, expect, test } from "bun:test";
import { gzipSync } from "node:zlib";

import { allContractClasses, buildPrebuilt } from "../src/prebuilt.ts";
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

    // The public site promises "every component in one skin: 15 KB gzipped".
    test(`ca-${name}.css stays under 15 KB gzipped`, async () => {
      const css = await buildPrebuilt(name);
      expect(gzipSync(css).byteLength).toBeLessThanOrEqual(15 * 1024);
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
});
