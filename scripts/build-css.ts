// Writes skins/<name>.css from each skin definition, dist/ca-<name>.css prebuilt files
// (skin sets too), dist/ca-commands.js (invoker-commands polyfill) and
// dist/ca-appearance.js (remembers skin and appearance before first paint).
import { join } from "node:path";

import { buildPrebuilt } from "../src/prebuilt.ts";
import { skinCss, skinSetCss } from "../src/skin.ts";
import { skinSets, skins } from "../src/skins.ts";

const root = join(import.meta.dir, "..");

for (const [entry, output, format] of [
  ["commands", "ca-commands.js", "esm"],
  ["tabs", "ca-tabs.js", "esm"],
  ["tooltip", "ca-tooltip.js", "esm"],
  ["combobox", "ca-combobox.js", "esm"],
  ["toast", "ca-toast.js", "esm"],
  ["copy", "ca-copy.js", "esm"],
  ["date-range", "ca-date-range.js", "esm"],
  ["editor", "ca-editor.js", "esm"],
  // A classic script, so it can run render-blocking in <head> before first paint.
  ["appearance", "ca-appearance.js", "iife"],
] as const) {
  const result = await Bun.build({
    entrypoints: [join(root, `src/behavior/${entry}.ts`)],
    outdir: join(root, "dist"),
    naming: output,
    format,
    minify: true,
  });
  if (!result.success) throw new AggregateError(result.logs, `building ${output} failed`);
}

// The npm bin: a runnable JS entry (npm cannot shim a .ts bin — publish
// warns and drops it). The shebang in src/cli.ts survives the bundle.
{
  const cli = await Bun.build({
    entrypoints: [join(root, "src/cli.ts")],
    outdir: join(root, "dist"),
    naming: "cli.js",
    target: "bun",
  });
  if (!cli.success) throw new AggregateError(cli.logs, "building dist/cli.js failed");
}

for (const [name, skin] of Object.entries(skins)) {
  await Bun.write(join(root, "skins", `${name}.css`), skinCss(skin));
  await Bun.write(join(root, "dist", `ca-${name}.css`), await buildPrebuilt(name, { minify: true }));
  console.log(`built skin ${name}`);
}

for (const [name, set] of Object.entries(skinSets)) {
  await Bun.write(join(root, "skins", `${name}.css`), skinSetCss(set));
  await Bun.write(join(root, "dist", `ca-${name}.css`), await buildPrebuilt(name, { minify: true }));
  console.log(`built skin set ${name}`);
}
