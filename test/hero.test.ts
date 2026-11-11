import { describe, expect, test } from "bun:test";

import { hero } from "../src/contracts/hero.ts";
import { contractClasses } from "../src/registry.ts";
import { build, consumerCss, rules, utilitiesLayer } from "./css.ts";

const css = consumerCss("base");

describe("hero block with the base skin", () => {
  for (const className of contractClasses(hero)) {
    test(`${className} compiles to a rule`, async () => {
      expect(utilitiesLayer(await build(css, [className]))).toContain(`.${className} {`);
    });
  }

  test("the root and parts read the layout variables, with one-column defaults", async () => {
    const layer = utilitiesLayer(await build(css, [hero.root, hero.parts.content, hero.parts.actions, hero.parts.title]));
    expect(rules(layer, hero.root)).toContain("grid-template-columns: var(--ca-hero-columns,minmax(0,1fr))");
    expect(rules(layer, hero.root)).toContain("text-align: var(--ca-hero-text,start)");
    expect(rules(layer, hero.parts.content)).toContain("display: var(--ca-hero-content-display,flex)");
    expect(rules(layer, hero.parts.actions)).toContain("justify-content: var(--ca-hero-justify,flex-start)");
    expect(rules(layer, hero.parts.title)).toContain("grid-column: var(--ca-hero-heading-span,auto)");
  });

  test("each layout sets its arrangement", async () => {
    const layer = utilitiesLayer(await build(css, Object.values(hero.layout)));
    expect(rules(layer, hero.layout.centered)).toContain("--ca-hero-text: center");
    expect(rules(layer, hero.layout.split)).toContain("--ca-hero-columns: repeat(auto-fit,minmax(min(100%, 16rem),1fr))");
    expect(rules(layer, hero.layout.stacked)).toContain("--ca-hero-content-display: grid");
    expect(rules(layer, hero.layout.stacked)).toContain("--ca-hero-heading-span: 1/-1");
  });
});
