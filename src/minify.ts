import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Minifies a finished stylesheet with Bun's CSS bundler, so no extra dependency is needed. */
export async function minifyCss(css: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "calaca-css-"));
  try {
    const input = join(dir, "input.css");
    await Bun.write(input, css);
    const result = await Bun.build({ entrypoints: [input], outdir: join(dir, "out"), minify: true });
    if (!result.success) throw new AggregateError(result.logs, "minifying CSS failed");
    return await result.outputs[0]!.text();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
