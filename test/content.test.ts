import { afterAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { contentCandidates, scanCandidates, scanClasses, usedContractClasses } from "../src/content.ts";
import { button } from "../src/contracts/button.ts";
import { card } from "../src/contracts/card.ts";
import { dialog } from "../src/contracts/dialog.ts";
import { contractClasses, findContract } from "../src/registry.ts";

describe("scanClasses", () => {
  test("finds roots, parts and modifiers in markup", () => {
    const found = scanClasses(
      `<button class="ca-button ca-button--primary">x</button>
       <div class="ca-card"><h2 class="ca-card__title">t</h2></div>
       <p class="dark:ca-link mt-2" data-ca-control="skin">y</p>`,
    );
    expect(found.has("ca-button")).toBe(true);
    expect(found.has("ca-button--primary")).toBe(true);
    expect(found.has("ca-card")).toBe(true);
    expect(found.has("ca-card__title")).toBe(true);
    expect(found.has("ca-link")).toBe(true);
    expect(found.has("mt-2")).toBe(false);
    // Attributes like data-ca-control match the pattern too; usedContractClasses drops them.
    expect(found.has("ca-control")).toBe(true);
  });
});

describe("scanCandidates", () => {
  test("keeps utilities, variants and arbitrary values, drops prose and markup", () => {
    const found = scanCandidates(
      `<button class="ca-button mt-2 hover:bg-red-500 w-[calc(100%-2rem)]">Click here</button>`,
    );
    expect(found.has("ca-button")).toBe(true);
    expect(found.has("mt-2")).toBe(true);
    expect(found.has("hover:bg-red-500")).toBe(true);
    expect(found.has("w-[calc(100%-2rem)]")).toBe(true);
    expect(found.has("<button")).toBe(false);
    expect(found.has("Click")).toBe(true); // prose tokens are harmless: the compiler ignores them
  });
});

describe("usedContractClasses", () => {
  test("one hit ships the whole contract: variants, sizes and parts", () => {
    expect(usedContractClasses(["ca-button"])).toEqual(contractClasses(button));
    expect(usedContractClasses(["ca-card__title"])).toEqual(contractClasses(card));
  });

  test("names Calaca does not define are ignored", () => {
    expect(usedContractClasses(["ca-nonsense", "ca-contro"])).toEqual([]);
    expect(usedContractClasses([])).toEqual([]);
  });
});

describe("findContract", () => {
  test("resolves a component name or any of its classes", () => {
    expect(findContract("button")).toBe(button);
    expect(findContract("ca-button--md")).toBe(button);
    expect(findContract("nope")).toBeUndefined();
  });
});

describe("contentCandidates", () => {
  let dir: string;
  afterAll(() => rm(dir, { recursive: true, force: true }));

  test("scans globbed files and returns the contracts they use", async () => {
    dir = await mkdtemp(join(tmpdir(), "calaca-content-"));
    await Bun.write(
      join(dir, "index.html"),
      `<button class="ca-button ca-button--primary">go</button>`,
    );
    await Bun.write(join(dir, "other.html"), `<p>no components here</p>`);
    const candidates = await contentCandidates(["*.html", "pages/**/*.astro"], dir);
    expect(candidates).toEqual(contractClasses(button));
    expect(candidates).not.toContain("ca-dialog");
    expect(contractClasses(dialog).some((className) => candidates.includes(className))).toBe(false);
  });
});
