import { expect, test } from "bun:test";
import { join } from "node:path";

import { packageRoot } from "./css.ts";

test("the class layer depends on Tailwind CSS only", async () => {
  const manifest = await Bun.file(join(packageRoot, "package.json")).json();
  expect(Object.keys(manifest.dependencies ?? {})).toEqual(["tailwindcss"]);
});
