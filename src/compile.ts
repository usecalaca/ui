import { dirname, join, resolve } from "node:path";
import { compile } from "tailwindcss";

const tailwindRoot = join(dirname(Bun.resolveSync("tailwindcss", import.meta.dir)), "..");

/** Resolves a CSS @import the way a bundler would, including Tailwind's style entry. */
function resolveStylesheet(id: string, base: string): string {
  if (id.startsWith(".") || id.startsWith("/")) return resolve(base, id);
  if (id === "tailwindcss") return join(tailwindRoot, "index.css");
  if (id.startsWith("tailwindcss/")) return join(tailwindRoot, id.slice("tailwindcss/".length));
  return Bun.resolveSync(id, base);
}

/** Compiles Tailwind CSS for an exact list of class candidates, without scanning files. */
export async function compileCss(css: string, base: string, candidates: string[]): Promise<string> {
  const compiler = await compile(css, {
    base,
    loadStylesheet: async (id: string, from: string) => {
      const path = resolveStylesheet(id, from);
      return { path, base: dirname(path), content: await Bun.file(path).text() };
    },
  });
  return compiler.build(candidates);
}
