import { expect, test } from "bun:test";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

import { packageRoot } from "./css.ts";

test("the dialog commands polyfill stays under 1 KB gzipped", async () => {
  const result = await Bun.build({ entrypoints: [join(packageRoot, "src/behavior/commands.ts")], minify: true });
  expect(result.success).toBe(true);
  const code = await (result.outputs[0] as Blob).text();
  expect(gzipSync(code).byteLength).toBeLessThan(1024);
});

test("the polyfill can be imported without a DOM, as in server rendering", async () => {
  expect(typeof HTMLButtonElement).toBe("undefined");
  await import("../src/behavior/commands.ts");
});

test("the tabs script stays under 1 KB gzipped and imports without a DOM", async () => {
  const result = await Bun.build({ entrypoints: [join(packageRoot, "src/behavior/tabs.ts")], minify: true });
  expect(result.success).toBe(true);
  const code = await (result.outputs[0] as Blob).text();
  expect(gzipSync(code).byteLength).toBeLessThan(1024);
  await import("../src/behavior/tabs.ts");
});

test("the tooltip script stays under 1 KB gzipped and imports without a DOM", async () => {
  const result = await Bun.build({ entrypoints: [join(packageRoot, "src/behavior/tooltip.ts")], minify: true });
  expect(result.success).toBe(true);
  const code = await (result.outputs[0] as Blob).text();
  expect(gzipSync(code).byteLength).toBeLessThan(1024);
  await import("../src/behavior/tooltip.ts");
});

// The combobox does the most (floating or inline lists, app-rendered options, links), so it gets 1.5 KB.
test("the combobox script stays under 1.5 KB gzipped and imports without a DOM", async () => {
  const result = await Bun.build({ entrypoints: [join(packageRoot, "src/behavior/combobox.ts")], minify: true });
  expect(result.success).toBe(true);
  const code = await (result.outputs[0] as Blob).text();
  expect(gzipSync(code).byteLength).toBeLessThan(1536);
  await import("../src/behavior/combobox.ts");
});

test("the toast script stays under 1 KB gzipped and imports without a DOM", async () => {
  const result = await Bun.build({ entrypoints: [join(packageRoot, "src/behavior/toast.ts")], minify: true });
  expect(result.success).toBe(true);
  const code = await (result.outputs[0] as Blob).text();
  expect(gzipSync(code).byteLength).toBeLessThan(1024);
  const { toast } = await import("../src/behavior/toast.ts");
  expect(typeof toast).toBe("function");
});

test("the copy script stays under 1 KB gzipped and imports without a DOM", async () => {
  const result = await Bun.build({ entrypoints: [join(packageRoot, "src/behavior/copy.ts")], minify: true });
  expect(result.success).toBe(true);
  const code = await (result.outputs[0] as Blob).text();
  expect(gzipSync(code).byteLength).toBeLessThan(1024);
  await import("../src/behavior/copy.ts");
});

for (const [entry, budget] of [["date-range", 1024], ["editor", 1536]] as const) {
  test(`the ${entry} script stays under ${budget / 1024} KB gzipped and imports without a DOM`, async () => {
    const result = await Bun.build({ entrypoints: [join(packageRoot, `src/behavior/${entry}.ts`)], minify: true });
    expect(result.success).toBe(true);
    const code = await (result.outputs[0] as Blob).text();
    expect(gzipSync(code).byteLength).toBeLessThan(budget);
    await import(`../src/behavior/${entry}.ts`);
  });
}

test("the appearance script stays under 1 KB gzipped", async () => {
  const result = await Bun.build({ entrypoints: [join(packageRoot, "src/behavior/appearance.ts")], minify: true, format: "iife" });
  expect(result.success).toBe(true);
  const code = await (result.outputs[0] as Blob).text();
  expect(gzipSync(code).byteLength).toBeLessThan(1024);
});
