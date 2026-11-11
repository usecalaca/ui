import { describe, expect, test } from "bun:test";
import { Glob } from "bun";
import { join } from "node:path";

import { skins } from "../src/skins.ts";
import { packageRoot } from "./css.ts";

/**
 * Physical direction utilities break right-to-left layouts. Use the logical
 * forms instead: ms/me, ps/pe, start/end, border-s/e, rounded-s/e, text-start/end.
 */
const physical =
  /(?:^|[\s:])-?(?:ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|text-left|text-right|float-left|float-right|scroll-ml|scroll-mr|scroll-pl|scroll-pr)(?:-|$|\s)/;

function offenders(utilities: string[]): string[] {
  return utilities.flatMap((line) => line.split(/\s+/)).filter((utility) => physical.test(utility));
}

describe("logical properties only", () => {
  for (const [name, skin] of Object.entries(skins)) {
    test(`skin ${name}`, () => {
      expect(offenders(Object.values(skin.layers).flat())).toEqual([]);
    });
  }

  test("core", async () => {
    const lines: string[] = [];
    for await (const path of new Glob("src/core/*.css").scan({ cwd: packageRoot })) {
      const css = await Bun.file(join(packageRoot, path)).text();
      lines.push(...[...css.matchAll(/@apply ([^;]+);/g)].map((match) => match[1] as string));
    }
    expect(lines.length).toBeGreaterThan(0);
    expect(offenders(lines)).toEqual([]);
  });

  test("the check itself catches physical utilities", () => {
    expect(offenders(["ml-2 hover:pr-4 text-left -left-1", "ms-2 pe-4 text-start"])).toEqual(["ml-2", "hover:pr-4", "text-left", "-left-1"]);
  });
});
