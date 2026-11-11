#!/usr/bin/env bun
/**
 * calaca skin build <skin.ts> [-o <file.css>] [--prebuilt] [--export <name>]
 *
 * Turns a skin written with defineSkin into CSS for any project. Without
 * --prebuilt the output is Tailwind source (tokens plus one @utility per
 * class), imported after `@usecalaca/ui/core.css` in a Tailwind build. With
 * --prebuilt it is a standalone stylesheet: core, tokens and every class
 * compiled, for a page without a Tailwind build.
 */
import { mkdir, rm } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { allContractClasses, buildPrebuiltFrom } from "./prebuilt.ts";
import { type Skin, skinCss } from "./skin.ts";

const USAGE = `Usage: calaca skin build <skin.ts> [-o <file.css>] [--prebuilt] [--export <name>]

  -o, --out <file>   Output file (default: <skin>.css next to the source)
  --prebuilt         Standalone CSS with core and skin, no Tailwind build needed
  --export <name>    Which export holds the skin (default: the default export,
                     or the only skin the module exports)`;

export class UsageError extends Error {}
class HelpRequest extends UsageError {}

interface Options {
  source: string;
  out?: string;
  prebuilt: boolean;
  exportName?: string;
}

export function parseArgs(argv: string[]): Options {
  if (argv.includes("--help") || argv.includes("-h")) throw new HelpRequest(USAGE);
  const [group, command, ...rest] = argv;
  if (group !== "skin" || command !== "build") throw new UsageError(USAGE);
  const options: Partial<Options> = { prebuilt: false };
  for (let index = 0; index < rest.length; index++) {
    const arg = rest[index]!;
    const value = () => {
      const next = rest[++index];
      if (!next || next.startsWith("-")) throw new UsageError(`${arg} needs a value\n\n${USAGE}`);
      return next;
    };
    if (arg === "-o" || arg === "--out") options.out = value();
    else if (arg === "--export") options.exportName = value();
    else if (arg === "--prebuilt") options.prebuilt = true;
    else if (arg.startsWith("-")) throw new UsageError(`unknown option ${arg}\n\n${USAGE}`);
    else if (options.source) throw new UsageError(`one skin file at a time\n\n${USAGE}`);
    else options.source = arg;
  }
  if (!options.source) throw new UsageError(USAGE);
  return options as Options;
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

export async function buildSkin(options: Options, cwd = process.cwd()): Promise<string> {
  const source = resolve(cwd, options.source);
  if (!(await Bun.file(source).exists())) throw new UsageError(`skin file not found: ${options.source}`);
  const skin = pickSkin(await import(pathToFileURL(source).href), options.exportName);
  checkClasses(skin);
  const out = resolve(cwd, options.out ?? `${dirname(options.source)}/${basename(options.source).replace(/\.[cm]?[jt]s$/, "")}.css`);
  const css = skinCss(skin, `${relative(dirname(out), source) || basename(source)} by \`calaca skin build\``);
  await mkdir(dirname(out), { recursive: true });
  if (options.prebuilt) {
    // The Tailwind source goes to a temporary file next to the output, so its imports compile, then is replaced.
    const temporary = `${out}.source-${process.pid}.css`;
    await Bun.write(temporary, css);
    try {
      await Bun.write(out, await buildPrebuiltFrom(temporary));
    } finally {
      await rm(temporary, { force: true });
    }
  } else {
    await Bun.write(out, css);
  }
  return out;
}

if (import.meta.main) {
  try {
    const out = await buildSkin(parseArgs(process.argv.slice(2)));
    console.log(`built ${relative(process.cwd(), out)}`);
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
