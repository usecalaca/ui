import { describe, expect, test } from "bun:test";
import { join } from "node:path";

import { allContractClasses } from "../src/prebuilt.ts";
import { allContracts } from "../src/registry.ts";
import { bare, defineSkin, type Skin, skinCss, skinSetCss, withVariant } from "../src/skin.ts";
import { base } from "../skins/base.ts";
import { skinSets, skins } from "../src/skins.ts";
import { CA_TOKEN_ALIASES } from "../src/tokens.ts";
import { build, packageRoot, rules, utilitiesLayer } from "./css.ts";

/**
 * A tiny extending skin for the ordering and scoping tests: square edges, a
 * heavier border, a taller medium — just enough to see its rules land after
 * the base rules they override. Deliberately not a shipped skin, so the
 * tests do not depend on any example's design choices.
 */
const fixture = defineSkin("fixture", { "ca-button": "rounded-none border-2", "ca-button--md": "h-12" }, base);
const fixtureCss = `@import "tailwindcss";\n@import "./core.css";\n${skinCss(fixture)}`;

/** Block layouts are structure: core arranges them, so a skin may dress them but does not have to. */
const layouts = new Set(allContracts.flatMap((contract) => Object.values(contract.layout ?? {})));

describe("skins", () => {
  for (const [name, skin] of Object.entries(skins)) {
    test(`skins/${name}.css is up to date (run bun run build)`, async () => {
      expect(await Bun.file(join(packageRoot, "skins", `${name}.css`)).text()).toBe(skinCss(skin));
    });

    test(`${name} styles only contract classes and covers every one apart from layouts`, () => {
      const styled = Object.keys(skin.layers).filter((className) => !layouts.has(className));
      expect(styled.sort()).toEqual(allContractClasses().filter((className) => !layouts.has(className)).sort());
      const known = new Set(allContractClasses());
      expect(Object.keys(skin.layers).filter((className) => !known.has(className))).toEqual([]);
    });
  }
});

describe("an extending skin always wins over its base", () => {
  test("extending values come after base values in each rule", async () => {
    const layer = utilitiesLayer(await build(fixtureCss, ["ca-button", "ca-button--md"]));
    const root = rules(layer, "ca-button");
    expect(root.indexOf("border-radius: 0")).toBeGreaterThan(root.indexOf("border-radius: var(--ca-radius-control)"));
    expect(root.indexOf("border-width: 2px")).toBeGreaterThan(root.indexOf("border-width: 1px"));
    const md = rules(layer, "ca-button--md");
    expect(md.indexOf("height: calc(calc(0.25rem * var(--ca-density, 1)) * 12)")).toBeGreaterThan(
      md.indexOf("height: calc(calc(0.25rem * var(--ca-density, 1)) * 9)"),
    );
  });

  test("base declarations the extending skin does not redefine remain", async () => {
    const root = rules(utilitiesLayer(await build(fixtureCss, ["ca-button"])), "ca-button");
    expect(root).toContain("opacity: 60%");
    expect(root).toContain("outline-width: 2px");
  });
});

describe("token aliases", () => {
  /* Regions redeclare CA_TOKEN_ALIASES so var() aliases resolve locally;
   * this keeps the :root declarations in tokens.css identical to the map. */
  test("tokens.css declares the same aliases a region redeclares", async () => {
    const css = await Bun.file(join(packageRoot, "src", "tokens.css")).text();
    const declared = Object.fromEntries(
      [...css.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map(([, name, value]) => [name, value!.trim()]),
    );
    expect(declared).toEqual(CA_TOKEN_ALIASES);
  });
});

describe("skin sets switch by name", () => {
  for (const [name, set] of Object.entries(skinSets)) {
    test(`skins/${name}.css is up to date (run bun run build)`, async () => {
      expect(await Bun.file(join(packageRoot, "skins", `${name}.css`)).text()).toBe(skinSetCss(set));
    });
  }

  test("scoped skin lines are prefixed with their variant", () => {
    expect(withVariant("h-12 hover:bg-x [--a:b]", "skin-custom")).toBe("skin-custom:h-12 skin-custom:hover:bg-x skin-custom:[--a:b]");
  });

  test("a scoped skin must extend the default skin", () => {
    const other = defineSkin("other", { "ca-button": "h-1" });
    expect(() => skinSetCss({ name: "bad", default: skins.base as Skin, scoped: [other] })).toThrow(/does not extend/);
  });

  test("inside a data-skin scope, extension rules come after the inherited rules and win", async () => {
    const css = `@import "tailwindcss";\n@import "./core.css";\n${skinSetCss({ name: "test", default: bare, scoped: [fixture] })}`;
    const layer = utilitiesLayer(await build(css, ["ca-button--md"]));
    const scoped = layer.slice(layer.indexOf('.ca-button--md:where([data-skin="fixture"]'));
    expect(scoped).toContain('[data-skin="fixture"]');
    /* The fixture extends base: its h-12 must override the inherited h-9. */
    expect(scoped.indexOf("height: calc(calc(0.25rem * var(--ca-density, 1)) * 12)")).toBeGreaterThan(
      scoped.indexOf("height: calc(calc(0.25rem * var(--ca-density, 1)) * 9)"),
    );
  });
});
