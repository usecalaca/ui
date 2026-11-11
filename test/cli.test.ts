import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parseArgs, pickSkin, UsageError } from "../src/cli.ts";
import { base, bare, defineSkin } from "../src/index.ts";
import { packageRoot, rules, utilitiesLayer } from "./css.ts";

const cli = join(packageRoot, "src", "cli.ts");

/** A project outside this package that installs @usecalaca/ui, as any consumer would. */
let project: string;

beforeAll(async () => {
  project = await mkdtemp(join(tmpdir(), "calaca-skin-"));
  await mkdir(join(project, "node_modules", "@usecalaca"), { recursive: true });
  await symlink(packageRoot, join(project, "node_modules", "@usecalaca", "ui"), "dir");
  await Bun.write(
    join(project, "skins", "acme.ts"),
    `import { base, defineSkin } from "@usecalaca/ui";
export const acme = defineSkin("acme", { "ca-button": "rounded-full", "ca-card": "shadow-none" }, base, {
  light: { "--ca-action-primary": "oklch(52.92% 0.1104 163.97)" },
  dark: { "--ca-action-primary": "oklch(78.8% 0.1233 166.2)" },
});
`,
  );
  await Bun.write(
    join(project, "skins", "plain.ts"),
    `import { defineSkin } from "@usecalaca/ui";
export default defineSkin("plain", { "ca-button": "rounded-none border-2" });
`,
  );
  await Bun.write(
    join(project, "skins", "typo.ts"),
    `import { defineSkin } from "@usecalaca/ui";
export default defineSkin("typo", { "ca-buton": "rounded-none" });
`,
  );
});

afterAll(() => rm(project, { recursive: true, force: true }));

async function run(...args: string[]) {
  const child = Bun.spawn(["bun", cli, ...args], { cwd: project, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { stdout, stderr, code };
}

describe("calaca skin build in a project outside the package", () => {
  test("extends base: Tailwind source with base lines first and the skin's last", async () => {
    const { code, stdout } = await run("skin", "build", "skins/acme.ts", "-o", "styles/acme.css");
    expect(code).toBe(0);
    expect(stdout).toContain("built styles/acme.css");
    const css = await Bun.file(join(project, "styles", "acme.css")).text();
    expect(css).toStartWith("/* Generated from ../skins/acme.ts by `calaca skin build`. Do not edit. */");
    const button = css.slice(css.indexOf("@utility ca-button {"), css.indexOf("}", css.indexOf("@utility ca-button {")));
    expect(button.trim().split("\n").at(-1)?.trim()).toBe("@apply rounded-full;");
    expect(button).toContain("@apply gap-2 rounded-lg border");
    expect(css).toContain("--ca-action-primary: oklch(52.92% 0.1104 163.97);");
    expect(css).toContain("--ca-action-primary: oklch(78.8% 0.1233 166.2);");
  });

  test("starts bare: only the classes the skin dresses, no tokens", async () => {
    expect((await run("skin", "build", "skins/plain.ts")).code).toBe(0);
    const css = await Bun.file(join(project, "skins", "plain.css")).text();
    expect(css.match(/@utility /g)).toHaveLength(1);
    expect(css).not.toContain(":root");
  });

  test("--prebuilt: standalone CSS where the skin wins over base", async () => {
    expect((await run("skin", "build", "skins/acme.ts", "-o", "public/acme.css", "--prebuilt")).code).toBe(0);
    const css = await Bun.file(join(project, "public", "acme.css")).text();
    expect(css).not.toContain("@apply");
    expect(css).not.toContain("@utility");
    const button = rules(utilitiesLayer(css), "ca-button");
    expect(button.indexOf("border-radius: calc(infinity * 1px)")).toBeGreaterThan(
      button.indexOf("border-radius: var(--ca-radius-control)"),
    );
    expect(css).toContain("--ca-action-primary: oklch(52.92% 0.1104 163.97);");
    const leftovers = [...new Bun.Glob("*.source-*").scanSync(join(project, "public"))];
    expect(leftovers).toEqual([]);
  });

  test("rejects classes Calaca does not define", async () => {
    const { code, stderr } = await run("skin", "build", "skins/typo.ts");
    expect(code).toBe(1);
    expect(stderr).toContain("styles classes Calaca does not define: ca-buton");
  });

  test("reports a missing file and bad arguments without a stack trace", async () => {
    const missing = await run("skin", "build", "skins/nope.ts");
    expect(missing.code).toBe(1);
    expect(missing.stderr).toContain("skin file not found: skins/nope.ts");
    const wrong = await run("theme", "build");
    expect(wrong.code).toBe(1);
    expect(wrong.stderr).toContain("Usage: calaca skin build");
    const help = await run("--help");
    expect(help.code).toBe(0);
    expect(help.stdout).toContain("--prebuilt");
  });
});

describe("arguments and skin selection", () => {
  test("parses options", () => {
    expect(parseArgs(["skin", "build", "a.ts", "--out", "b.css", "--prebuilt", "--export", "acme"])).toEqual({
      source: "a.ts",
      out: "b.css",
      prebuilt: true,
      exportName: "acme",
    });
    expect(() => parseArgs(["skin", "build", "a.ts", "-o"])).toThrow(UsageError);
    expect(() => parseArgs(["skin", "build", "a.ts", "b.ts"])).toThrow("one skin file at a time");
  });

  test("picks the default export, the only skin, or the named one", () => {
    const one = defineSkin("one", {}, base);
    const two = defineSkin("two", {});
    expect(pickSkin({ default: one, two })).toBe(one);
    expect(pickSkin({ one, helper: 1 })).toBe(one);
    expect(pickSkin({ one, two }, "two")).toBe(two);
    expect(() => pickSkin({ one, two })).toThrow("pick one with --export");
    expect(() => pickSkin({ helper: 1 })).toThrow("exports no skin");
    expect(() => pickSkin({ one }, "helper")).toThrow("not a skin");
  });

  test("the public entry exposes what a skin author needs", () => {
    expect(bare.layers).toEqual({});
    expect(Object.keys(base.layers).length).toBeGreaterThan(0);
  });
});
