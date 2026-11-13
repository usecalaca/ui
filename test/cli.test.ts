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
  await Bun.write(
    join(project, "pages", "index.html"),
    `<button class="ca-button ca-button--primary">go</button>
     <div class="ca-card"><h2 class="ca-card__title mt-2">hi</h2></div>`,
  );
  await Bun.write(
    join(project, "styles", "app.css"),
    `@import "tailwindcss";
@import "@usecalaca/ui/core.css";
@import "@usecalaca/ui/skins/base.css";
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

/** Polls until the condition holds or the deadline passes. */
async function waitFor(condition: () => Promise<boolean>, timeoutMs = 15_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await condition()) return;
    await Bun.sleep(100);
  }
  throw new Error("waitFor timed out");
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

  test("--prebuilt --content keeps only the contracts the files use", async () => {
    const run_ = await run(
      "skin", "build", "skins/acme.ts", "-o", "public/scanned.css", "--prebuilt", "--content", "pages/**/*.html",
    );
    expect(run_.code).toBe(0);
    const css = await Bun.file(join(project, "public", "scanned.css")).text();
    const layer = utilitiesLayer(css);
    // One hit ships the whole contract: the page never writes ca-button--lg.
    expect(layer).toContain(".ca-button--lg");
    expect(layer).toContain(".ca-card__title");
    expect(layer).not.toContain(".ca-dialog");
    expect(layer).not.toContain(".ca-accordion");
    expect(css.length).toBeLessThan(60_000);
  });

  test("--prebuilt --include adds a contract the scan cannot see", async () => {
    const run_ = await run(
      "skin", "build", "skins/acme.ts", "-o", "public/included.css", "--prebuilt",
      "--content", "pages/**/*.html", "--include", "toast",
    );
    expect(run_.code).toBe(0);
    const css = await Bun.file(join(project, "public", "included.css")).text();
    expect(utilitiesLayer(css)).toContain(".ca-toast");
    const bad = await run(
      "skin", "build", "skins/acme.ts", "--prebuilt", "--include", "nope",
    );
    expect(bad.code).toBe(1);
    expect(bad.stderr).toContain('"nope" is not a component, block or class Calaca defines');
  });

  test("--prebuilt --minify shrinks the stylesheet", async () => {
    const run_ = await run(
      "skin", "build", "skins/acme.ts", "-o", "public/min.css", "--prebuilt", "--minify",
    );
    expect(run_.code).toBe(0);
    const css = await Bun.file(join(project, "public", "min.css")).text();
    const full = await Bun.file(join(project, "public", "acme.css")).text();
    expect(css.length).toBeLessThan(full.length);
    expect(css).toContain(".ca-button{");
    expect(css).not.toContain("\n  .ca-button");
  });

  test("--content, --include and --minify need --prebuilt", async () => {
    for (const flag of [["--content", "pages/**"], ["--include", "toast"], ["--minify"]]) {
      const { code, stderr } = await run("skin", "build", "skins/acme.ts", ...flag);
      expect(code).toBe(1);
      expect(stderr).toContain("apply to --prebuilt only");
    }
  });

  test("--watch rebuilds when the skin changes", async () => {
    const child = Bun.spawn(
      ["bun", cli, "skin", "build", "skins/plain.ts", "-o", "public/watched.css", "--watch"],
      { cwd: project, stdout: "pipe", stderr: "pipe" },
    );
    try {
      const out = join(project, "public", "watched.css");
      await waitFor(async () => (await Bun.file(out).exists()) && (await Bun.file(out).text()).includes("rounded-none"));
      await Bun.write(
        join(project, "skins", "plain.ts"),
        `import { defineSkin } from "@usecalaca/ui";
export default defineSkin("plain", { "ca-button": "rounded-full border-2" });
`,
      );
      await waitFor(async () => (await Bun.file(out).text()).includes("rounded-full"));
    } finally {
      child.kill();
      await child.exited;
    }
  }, 30_000);
});

describe("calaca css build in a project outside the package", () => {
  test("compiles a consumer stylesheet and scans every utility", async () => {
    const { code } = await run(
      "css", "build", "styles/app.css", "-o", "public/app.css", "--content", "pages/**/*.html",
    );
    expect(code).toBe(0);
    const layer = utilitiesLayer(await Bun.file(join(project, "public", "app.css")).text());
    expect(layer).toContain(".ca-button");
    expect(layer).toContain(".mt-2");
    expect(layer).not.toContain(".ca-dialog");
  });

  test("without --content ships every contract and no markup utilities", async () => {
    const { code } = await run("css", "build", "styles/app.css", "-o", "public/app-full.css");
    expect(code).toBe(0);
    const layer = utilitiesLayer(await Bun.file(join(project, "public", "app-full.css")).text());
    expect(layer).toContain(".ca-dialog");
    expect(layer).not.toContain(".mt-2");
  });

  test("--minify shrinks the output", async () => {
    const { code } = await run("css", "build", "styles/app.css", "-o", "public/app-min.css", "--minify");
    expect(code).toBe(0);
    const css = await Bun.file(join(project, "public", "app-min.css")).text();
    const full = await Bun.file(join(project, "public", "app-full.css")).text();
    expect(css.length).toBeLessThan(full.length);
    expect(css).toContain(".ca-button{");
  });

  test("requires -o and rejects skin-only options", async () => {
    const noOut = await run("css", "build", "styles/app.css");
    expect(noOut.code).toBe(1);
    expect(noOut.stderr).toContain("css build needs -o");
    const prebuilt = await run("css", "build", "styles/app.css", "-o", "x.css", "--prebuilt");
    expect(prebuilt.code).toBe(1);
    expect(prebuilt.stderr).toContain("--prebuilt is for skin build");
    const missing = await run("css", "build", "styles/nope.css", "-o", "x.css");
    expect(missing.code).toBe(1);
    expect(missing.stderr).toContain("stylesheet not found: styles/nope.css");
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
      group: "skin",
      source: "a.ts",
      out: "b.css",
      prebuilt: true,
      exportName: "acme",
      content: [],
      include: [],
      minify: false,
      watch: false,
    });
    expect(
      parseArgs([
        "skin", "build", "a.ts", "--prebuilt", "--content", "src/**", "--content", "pages/*.html",
        "--include", "toast", "--minify", "--watch",
      ]),
    ).toEqual({
      group: "skin",
      source: "a.ts",
      prebuilt: true,
      content: ["src/**", "pages/*.html"],
      include: ["toast"],
      minify: true,
      watch: true,
    });
    expect(parseArgs(["css", "build", "app.css", "-o", "out.css", "--watch"])).toEqual({
      group: "css",
      source: "app.css",
      out: "out.css",
      prebuilt: false,
      content: [],
      include: [],
      minify: false,
      watch: true,
    });
    expect(() => parseArgs(["skin", "build", "a.ts", "-o"])).toThrow(UsageError);
    expect(() => parseArgs(["skin", "build", "a.ts", "b.ts"])).toThrow("one input file at a time");
    expect(() => parseArgs(["skin", "build", "a.ts", "--content", "src/**"])).toThrow("apply to --prebuilt only");
    expect(() => parseArgs(["css", "build", "app.css"])).toThrow("css build needs -o");
    expect(() => parseArgs(["css", "build", "app.css", "-o", "x.css", "--prebuilt"])).toThrow(
      "--prebuilt is for skin build",
    );
    expect(() => parseArgs(["css", "build", "app.css", "-o", "x.css", "--export", "a"])).toThrow(
      "--export applies to skin build only",
    );
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

  test("the npm bin points at the built cli.js, not a .ts source", async () => {
    // npm cannot shim a TypeScript bin — publish warns and drops it, so
    // `bin.calaca` must stay pointed at the dist bundle `bun run build` emits.
    const pkg = (await import("../package.json", { with: { type: "json" } })).default;
    expect(pkg.bin.calaca).toBe("./dist/cli.js");
  });
});
