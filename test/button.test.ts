import { describe, expect, test } from "bun:test";

import { button } from "../src/contracts/button.ts";
import { contractClasses } from "../src/registry.ts";
import { build, consumerCss, utilitiesLayer } from "./css.ts";

const css = consumerCss("base");

describe("button with the base skin", () => {
  for (const className of contractClasses(button)) {
    test(`${className} compiles to a rule`, async () => {
      expect(utilitiesLayer(await build(css, [className]))).toContain(`.${className} {`);
    });
  }

  test("classes a page does not use are left out", async () => {
    const layer = utilitiesLayer(await build(css, [button.root, button.variant.primary, button.size.md]));
    expect(layer).toContain(".ca-button--primary {");
    expect(layer).not.toContain(".ca-button--ghost");
    expect(layer).not.toContain(".ca-button--lg");
  });

  test("Tailwind utilities on an instance come after skin classes, so they win", async () => {
    const layer = utilitiesLayer(await build(css, [button.root, button.size.md, "h-12", "rounded-none"]));
    expect(layer.indexOf(".h-12 {")).toBeGreaterThan(layer.indexOf(".ca-button--md {"));
    expect(layer.lastIndexOf(".rounded-none {")).toBeGreaterThan(layer.lastIndexOf(".ca-button {"));
  });
});
