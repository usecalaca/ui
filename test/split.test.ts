import { describe, expect, test } from "bun:test";

import { allContracts } from "../src/registry.ts";
import { skins as builtIn } from "../src/skins.ts";
import { coreOnlyCss, declaredProperties, skinOnlyCss } from "./css.ts";

/** Every built-in skin: its properties must not overlap with core, or between class groups. */
const skins = Object.keys(builtIn);

const overlap = (a: Set<string>, b: Set<string>) => [...a].filter((property) => b.has(property));

describe("core and skins set disjoint properties", () => {
  for (const contract of allContracts) {
    for (const skin of skins) {
      const css = skinOnlyCss(skin);

      test(`${contract.name}: core and ${skin} on the root and every part`, async () => {
        const core = await declaredProperties(coreOnlyCss, contract.root);
        expect(core.size).toBeGreaterThan(0);
        for (const className of [contract.root, ...Object.values(contract.parts ?? {})]) {
          const coreProps = await declaredProperties(coreOnlyCss, className);
          expect(overlap(coreProps, await declaredProperties(css, className)), className).toEqual([]);
        }
      });

      test(`${contract.name}: root, variant and size groups in ${skin}`, async () => {
        const root = await declaredProperties(css, contract.root);
        const variants = Object.values(contract.variant ?? {});
        const sizes = Object.values(contract.size ?? {});
        for (const variant of variants) {
          const variantProps = await declaredProperties(css, variant);
          expect(overlap(root, variantProps), `${contract.root} vs ${variant}`).toEqual([]);
          for (const size of sizes) {
            expect(overlap(variantProps, await declaredProperties(css, size)), `${variant} vs ${size}`).toEqual([]);
          }
        }
        for (const size of sizes) {
          expect(overlap(root, await declaredProperties(css, size)), `${contract.root} vs ${size}`).toEqual([]);
        }
      });

      test(`${contract.name}: layouts leave core and ${skin} properties alone`, async () => {
        // A layout rearranges through --ca-<block>-* variables only, so it never fights the rule it adjusts.
        for (const layout of Object.values(contract.layout ?? {})) {
          const props = [...(await declaredProperties(coreOnlyCss, layout)), ...(await declaredProperties(css, layout))];
          expect(props.filter((property) => !property.startsWith(`--${contract.root}-`)), layout).toEqual([]);
        }
      });
    }
  }
});

test("property detection sees every declaration of a rule", async () => {
  const core = await declaredProperties(coreOnlyCss, "ca-button");
  for (const property of ["position", "display", "outline-width", "pointer-events", "inset"]) {
    expect(core.has(property), property).toBe(true);
  }
});
