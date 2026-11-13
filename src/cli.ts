#!/usr/bin/env bun
/**
 * calaca skin build <skin.ts> [-o <file.css>] [--prebuilt] [--export <name>]
 * calaca css build <input.css> -o <file.css> [--content <glob>] [--minify]
 *
 * skin build turns a skin written with defineSkin into CSS for any project.
 * Without --prebuilt the output is Tailwind source (tokens plus one @utility
 * per class), imported after `@usecalaca/ui/core.css` in a Tailwind build.
 * With --prebuilt it is a standalone stylesheet: core, tokens and the classes
 * the build found, for a page without a Tailwind build. --content scans files
 * for the classes to keep (a found component ships its whole contract, parts
 * and modifiers included); --include adds a contract the markup never names,
 * such as toast regions a script creates. --minify shrinks the result.
 *
 * css build compiles any consumer stylesheet — the ones that import
 * `@usecalaca/ui/core.css` and a skin — into finished CSS, the way the
 * Tailwind CLI does. --content scans markup for every utility candidate,
 * Calaca classes and plain Tailwind utilities alike; without it only the
 * contract classes ship.
 *
 * --watch rebuilds when the source or scanned files change.
 */
import { watch } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { compileCss } from "./compile.ts";
import { contentCandidates, scanCandidates, usedContractClasses } from "./content.ts";
import { minifyCss } from "./minify.ts";
import { allContractClasses, buildPrebuiltFrom } from "./prebuilt.ts";
import { contractClasses, findContract } from "./registry.ts";
import { type Skin, skinCss } from "./skin.ts";

const USAGE = `Usage: calaca skin build <skin.ts> [-o <file.css>] [--prebuilt] [--export <name>]
       calaca css build <input.css> -o <file.css> [--content <glob>] [--minify]

  -o, --out <file>   Output file (skin build defaults to <skin>.css next to
                     the source; css build requires it)
  --prebuilt         Standalone CSS with core and skin, no Tailwind build
                     needed (skin build only)
  --content <glob>   Scan matching files and keep only the classes they use
                     (repeatable; skin build: with --prebuilt only)
  --include <name>   Also ship a contract the scan cannot see, like toast
                     (repeatable; skin build: with --prebuilt only)
  --minify           Minify the output stylesheet
                     (skin build: with --prebuilt only)
  --watch            Rebuild when the source or scanned files change
  --export <name>    Which export holds the skin (skin build only; default:
                     the default export, or the only skin the module exports)`;

export class UsageError extends Error {}
class HelpRequest extends UsageError {}

interface Options {
  group: "skin" | "css";
  source: string;
  out?: string;
  prebuilt: boolean;
  exportName?: string;
  content: string[];
  include: string[];
  minify: boolean;
  watch: boolean;
}

export function parseArgs(argv: string[]): Options {
  if (argv.includes("--help") || argv.includes("-h")) throw new HelpRequest(USAGE);
  const [group, command, ...rest] = argv;
  if ((group !== "skin" && group !== "css") || command !== "build") throw new UsageError(USAGE);
  const options: Partial<Options> = {
    group,
    prebuilt: false,
    content: [],
    include: [],
    minify: false,
    watch: false,
  };
  for (let index = 0; index < rest.length; index++) {
    const arg = rest[index]!;
    const nextValue = () => {
      const next = rest[++index];
      if (!next || next.startsWith("-")) throw new UsageError(`${arg} needs a value\n\n${USAGE}`);
      return next;
    };
    switch (arg) {
      case "-o":
      case "--out":
        options.out = nextValue();
        break;
      case "--export":
        options.exportName = nextValue();
        break;
      case "--content":
        options.content!.push(nextValue());
        break;
      case "--include":
        options.include!.push(nextValue());
        break;
      case "--prebuilt":
        options.prebuilt = true;
        break;
      case "--minify":
        options.minify = true;
        break;
      case "--watch":
        options.watch = true;
        break;
      default:
        if (arg.startsWith("-")) throw new UsageError(`unknown option ${arg}\n\n${USAGE}`);
        if (options.source) throw new UsageError(`one input file at a time\n\n${USAGE}`);
        options.source = arg;
        break;
    }
  }
  validateOptions(options, group);
  return options;
}

function validateOptions(options: Partial<Options>, group: "skin" | "css"): asserts options is Options {
  if (!options.source) throw new UsageError(USAGE);
  if (group === "css") {
    if (!options.out) throw new UsageError(`css build needs -o <file.css>\n\n${USAGE}`);
    if (options.prebuilt) throw new UsageError(`css build output is standalone already; --prebuilt is for skin build\n\n${USAGE}`);
    if (options.exportName) throw new UsageError(`--export applies to skin build only\n\n${USAGE}`);
  } else if (!options.prebuilt && (options.content!.length || options.include!.length || options.minify)) {
    throw new UsageError(`--content, --include and --minify apply to --prebuilt only\n\n${USAGE}`);
  }
}

const isSkin = (value: unknown): value is Skin =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Skin).name === "string" &&
  typeof (value as Skin).layers === "object" &&
  typeof (value as Skin).tokens === "object";

/** The skin a module exports: the named one, the default, or its only skin. */
export function pickSkin(module: Record<string, unknown>, exportName?: string): Skin {
  if (exportName) {
    const value = module[exportName];
    if (!isSkin(value)) throw new UsageError(`export "${exportName}" is not a skin made with defineSkin`);
    return value;
  }
  if (isSkin(module.default)) return module.default;
  const found = Object.entries(module).filter(([, value]) => isSkin(value));
  if (found.length === 1) return found[0]![1] as Skin;
  if (!found.length) throw new UsageError("the module exports no skin; export the result of defineSkin");
  throw new UsageError(`the module exports several skins (${found.map(([name]) => name).join(", ")}); pick one with --export`);
}

/** Skins only dress Calaca classes; anything else is a typo or a missing contract. */
export function checkClasses(skin: Skin): void {
  const known = new Set(allContractClasses());
  const unknown = Object.keys(skin.layers).filter((className) => !known.has(className));
  if (unknown.length) throw new UsageError(`skin "${skin.name}" styles classes Calaca does not define: ${unknown.join(", ")}`);
}

/** The contract classes --include names: a component or block name, or one of its classes. */
function includeClasses(include: string[]): string[] {
  return include.flatMap((name) => {
    const contract = findContract(name);
    if (!contract) throw new UsageError(`--include: "${name}" is not a component, block or class Calaca defines`);
    return contractClasses(contract);
  });
}

async function writePrebuiltSkin(
  out: string,
  css: string,
  options: Options,
  cwd: string,
): Promise<void> {
  let candidates: string[] | undefined;
  if (options.content.length || options.include.length) {
    candidates = [...(await contentCandidates(options.content, cwd)), ...includeClasses(options.include)];
    if (!candidates.length) console.error("warning: --content found no Calaca classes; the stylesheet carries tokens only");
  }
  // The Tailwind source goes to a temporary file next to the output, so its imports compile, then is replaced.
  const temporary = `${out}.source-${process.pid}.css`;
  await Bun.write(temporary, css);
  try {
    const built = await buildPrebuiltFrom(temporary, { candidates, minify: options.minify });
    await Bun.write(out, built);
  } finally {
    await rm(temporary, { force: true });
  }
}

export async function buildSkin(options: Options, cwd = process.cwd()): Promise<string> {
  const source = resolve(cwd, options.source);
  if (!(await Bun.file(source).exists())) throw new UsageError(`skin file not found: ${options.source}`);
  const skin = pickSkin(await import(pathToFileURL(source).href), options.exportName);
  checkClasses(skin);
  const out = resolve(cwd, options.out ?? `${dirname(options.source)}/${basename(options.source).replace(/\.[cm]?[jt]s$/, "")}.css`);
  const css = skinCss(skin, `${relative(dirname(out), source) || basename(source)} by \`calaca skin build\``);
  await mkdir(dirname(out), { recursive: true });
  if (options.prebuilt) {
    await writePrebuiltSkin(out, css, options, cwd);
  } else {
    await Bun.write(out, css);
  }
  return out;
}

async function collectContentTokens(patterns: string[], cwd: string): Promise<Set<string>> {
  const tokens = new Set<string>();
  for (const pattern of patterns) {
    for await (const path of new Bun.Glob(pattern).scan({ cwd })) {
      const text = await Bun.file(join(cwd, path)).text();
      for (const token of scanCandidates(text)) {
        tokens.add(token);
      }
    }
  }
  return tokens;
}

/**
 * Compiles a consumer stylesheet — one that imports core and a skin — into
 * finished CSS. --content scans markup for every utility candidate, Calaca
 * classes and plain Tailwind utilities alike; without it only the contract
 * classes ship.
 */
export async function buildCss(options: Options, cwd = process.cwd()): Promise<string> {
  const source = resolve(cwd, options.source);
  if (!(await Bun.file(source).exists())) throw new UsageError(`stylesheet not found: ${options.source}`);
  const out = resolve(cwd, options.out!);
  let candidates = allContractClasses();
  if (options.content.length || options.include.length) {
    const tokens = await collectContentTokens(options.content, cwd);
    candidates = [...tokens, ...usedContractClasses(tokens), ...includeClasses(options.include)];
    if (!candidates.length) console.error("warning: --content found no classes; the stylesheet carries tokens only");
  }
  const css = await compileCss(await Bun.file(source).text(), dirname(source), candidates);
  await mkdir(dirname(out), { recursive: true });
  await Bun.write(out, options.minify ? await minifyCss(css) : css);
  return out;
}

/** Directories a rebuild should watch: the source's, plus the static base of each content glob. */
async function watchDirectories(options: Options, cwd: string): Promise<Set<string>> {
  const targets = new Set([dirname(resolve(cwd, options.source))]);
  for (const pattern of options.content) {
    const base = pattern.split(/[*?[{]/)[0] || ".";
    targets.add(resolve(cwd, base.endsWith("/") || base === "." ? base : dirname(base)));
    for await (const path of new Bun.Glob(pattern).scan({ cwd })) {
      targets.add(dirname(resolve(cwd, path)));
    }
  }
  return targets;
}

/**
 * Builds once, then rebuilds whenever a watched directory reports a change.
 * Each rebuild spawns a fresh CLI process: Bun caches imported modules, so a
 * skin rebuilt in-process would compile its first version forever.
 */
export async function watchBuild(options: Options, argv: string[], cwd = process.cwd()): Promise<never> {
  const args = argv.filter((arg) => arg !== "--watch");
  const rebuild = async () => {
    const child = Bun.spawn(["bun", fileURLToPath(import.meta.url), ...args], {
      cwd,
      stdout: "inherit",
      stderr: "inherit",
    });
    if ((await child.exited) !== 0) console.error("build failed; watching for the next change");
  };
  await rebuild();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 100);
  };
  const targets = await watchDirectories(options, cwd);
  for (const dir of targets) {
    try {
      watch(dir, { recursive: true }, schedule);
    } catch {
      watch(dir, schedule);
    }
  }
  console.log(`watching ${targets.size} ${targets.size === 1 ? "directory" : "directories"}`);
  return new Promise(() => {});
}

if (import.meta.main) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.watch) await watchBuild(options, process.argv.slice(2));
    else {
      const out = await (options.group === "css" ? buildCss(options) : buildSkin(options));
      console.log(`built ${relative(process.cwd(), out)}`);
    }
  } catch (error) {
    if (error instanceof HelpRequest) {
      console.log(error.message);
      process.exit(0);
    }
    // defineSkin reports invalid names and tokens as plain errors; show the message, not a stack.
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
