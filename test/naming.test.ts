import { describe, expect, test } from "bun:test";

import { allContractClasses } from "../src/prebuilt.ts";
import { build, utilitiesLayer } from "./css.ts";

const classes = allContractClasses();

describe("component class names", () => {
  test("follow ca-<component>, ca-<component>__<part> or ca-<component>--<modifier>", () => {
    const word = "[a-z0-9]+(?:-[a-z0-9]+)*";
    const bem = new RegExp(`^ca-${word}(?:__${word}|--${word})?$`);
    const invalid = classes.filter((className) => !bem.test(className));
    expect(invalid).toEqual([]);
  });

  test("Tailwind itself generates nothing for them, so they cannot collide", async () => {
    const layer = utilitiesLayer(await build('@import "tailwindcss";\n', classes));
    expect(layer).toBe("");
  });
});

describe("parts and modifiers belong to their component", () => {
  test("every part and modifier starts with its component's root name", async () => {
    const { allContracts } = await import("../src/registry.ts");
    const stray = allContracts.flatMap((contract) =>
      [...Object.values(contract.parts ?? {}), ...Object.values(contract.variant ?? {}), ...Object.values(contract.size ?? {}), ...Object.values(contract.layout ?? {})].filter(
        (className) => !className.startsWith(`${contract.root}__`) && !className.startsWith(`${contract.root}--`),
      ),
    );
    expect(stray).toEqual([]);
  });
});
