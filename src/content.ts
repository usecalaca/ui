import { join } from "node:path";

import { allContracts, contractClasses } from "./registry.ts";

/** Calaca class names in a text file: `ca-…`, `ca-…__part` and `ca-…--modifier`. */
export function scanClasses(text: string): Set<string> {
  return new Set(text.match(/\bca-[a-z0-9_-]+/g) ?? []);
}

/**
 * Every token that could be a Tailwind candidate: utilities, variants
 * (`dark:…`) and arbitrary values (`w-[10px]`) survive the split, prose words
 * and markup do not. The compiler ignores whatever is not a utility, so
 * casting a wide net is safe.
 */
export function scanCandidates(text: string): Set<string> {
  return new Set(
    text.split(/[\s"'`=<>{}\\;]+/).filter((token) => token.length > 0 && token.length < 200 && /[a-z]/i.test(token)),
  );
}

/**
 * Every class of each contract the names touch, so a hit on `ca-button` also
 * covers variants and parts the markup only adds at runtime. Names Calaca does
 * not define are ignored.
 */
export function usedContractClasses(names: Iterable<string>): string[] {
  const found = new Set(names);
  return allContracts
    .filter((contract) => contractClasses(contract).some((className) => found.has(className)))
    .flatMap(contractClasses);
}

/** Scans files matching the globs and returns the contract classes their Calaca names touch. */
export async function contentCandidates(globs: string[], cwd: string): Promise<string[]> {
  const names = new Set<string>();
  for (const pattern of globs) {
    for await (const path of new Bun.Glob(pattern).scan({ cwd })) {
      for (const name of scanClasses(await Bun.file(join(cwd, path)).text())) names.add(name);
    }
  }
  return usedContractClasses(names);
}
