// The package ships to the public @usecalaca/ui repo and npm: no file in
// `files` may mention monorepo internals. Monorepo-only knowledge belongs in
// <!-- internal --> regions of AGENTS.md, which sync-public scrubs.
import { describe, expect, test } from "bun:test";
import { Glob } from "bun";
import { join } from "node:path";

import { packageRoot } from "./css.ts";

const shipped = ["core.css", "README.md", "LICENSE"];
for await (const path of new Glob("{src,skins}/**/*.{ts,css}").scan({ cwd: packageRoot })) shipped.push(path);

const internal = /\b(silvfox|crossview|planpals|rijschool|wadse|chain-hub|vire|pliego)\b|themes\/|apps\/|packages\//i;

describe("shipped files carry no monorepo internals", () => {
  for (const path of shipped.sort()) {
    test(path, async () => {
      const text = await Bun.file(join(packageRoot, path)).text();
      const lines = text.split("\n").filter((line) => internal.test(line));
      expect(lines).toEqual([]);
    });
  }
});
