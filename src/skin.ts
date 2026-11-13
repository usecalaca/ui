import { CA_TOKEN_ALIASES, CALACA_TOKENS, type CalacaToken } from "./tokens.ts";

/**
 * A skin dresses the core: it maps ca-* class names to Tailwind utilities and
 * may carry token values (--ca-*) for light and dark. A skin that extends
 * another lists only what differs. Each class becomes one @utility rule with
 * one @apply line per layer, in order, so a later layer always wins.
 * (Separate @utility definitions with the same name are sorted by Tailwind,
 * which makes their winner unpredictable.)
 */
export type SkinInput = Record<string, string | string[]>;
export type TokenValues = Partial<Record<CalacaToken, string>>;

export interface SkinTokens {
  light: TokenValues;
  dark: TokenValues;
}

export interface Skin {
  name: string;
  /** Per class: @apply lines from the base skin first, then each extension. */
  layers: Record<string, string[]>;
  tokens: SkinTokens;
}

const lines = (value: string | string[]) => (Array.isArray(value) ? value : [value]);
const NAME = /^[a-z][a-z0-9-]*$/;

function checkTokens(skinName: string, values: TokenValues): void {
  const known = new Set<string>(CALACA_TOKENS);
  const unknown = Object.keys(values).filter((token) => !known.has(token));
  if (unknown.length) throw new Error(`skin "${skinName}" sets unknown tokens: ${unknown.join(", ")}`);
}

export function defineSkin(name: string, input: SkinInput, base?: Skin, tokens: Partial<SkinTokens> = {}): Skin {
  if (!NAME.test(name)) throw new Error(`invalid skin name "${name}"`);
  const layers: Record<string, string[]> = {};
  for (const [className, value] of Object.entries(base?.layers ?? {})) layers[className] = [...value];
  for (const [className, value] of Object.entries(input)) {
    layers[className] = [...(layers[className] ?? []), ...lines(value)];
  }
  const light = { ...base?.tokens.light, ...tokens.light };
  const dark = { ...base?.tokens.dark, ...tokens.dark };
  checkTokens(name, light);
  checkTokens(name, dark);
  return { name, layers, tokens: { light, dark } };
}

function declarations(values: TokenValues, indent: string): string {
  return Object.entries(values)
    .map(([token, value]) => `${indent}${token}: ${value};`)
    .join("\n");
}

/**
 * Token values as CSS. Root scope wraps the selector in :where() so a brand
 * stylesheet on :root still wins over the skin's defaults. Region scope uses
 * the plain attribute selector: an element pinned to a skin must get that
 * skin's palette inside the region, even on a page that sets :root values.
 */
export function tokenCss(skin: Skin, scope: "root" | "region"): string {
  const { light, dark } = skin.tokens;
  if (!Object.keys(light).length && !Object.keys(dark).length) return "";
  const at = (selector: string) => `[data-skin="${skin.name}"]${selector}`;
  /* The dark pin: data-appearance is canonical, data-theme the platform's
   * older name. An appearance pin wins over a theme pin when both are set;
   * an appearance light pin keeps its region light. */
  const lightPin = '[data-appearance="light"], [data-theme="light"]';
  const lightRegion = ':where([data-appearance="light"], [data-appearance="light"] *)';
  const darkPin = `[data-appearance="dark"], [data-theme="dark"]:not(${lightRegion})`;
  const selectors =
    scope === "root"
      ? { light: ":root", dark: darkPin, system: `html:not(${lightPin})` }
      : {
          light: at(""),
          dark: `${at(`:is(${darkPin})`)}:not(${lightRegion}), :is(${darkPin}) ${at("")}:not(${lightRegion})`,
          system: `html:not(${lightPin})${at("")}, html:not(${lightPin}) ${at("")}:not(${lightRegion})`,
        };
  const wrap = (selector: string) => (scope === "root" ? `:where(${selector})` : selector);
  /* A region also redeclares the color, radius and font aliases: a custom
   * property holding var() resolves where it is declared, so the :root
   * aliases would otherwise bake the page palette into the region. */
  const regionTokens = scope === "region" ? { ...light, ...CA_TOKEN_ALIASES } : light;
  const blocks = [`${wrap(selectors.light)} {\n  color-scheme: light;\n${declarations(regionTokens, "  ")}\n}`];
  if (Object.keys(dark).length) {
    blocks.push(`@media screen {\n  ${wrap(selectors.dark)} {\n    color-scheme: dark;\n${declarations(dark, "    ")}\n  }\n}`);
    blocks.push(
      `@media screen and (prefers-color-scheme: dark) {\n  ${wrap(selectors.system)} {\n    color-scheme: dark;\n${declarations(dark, "    ")}\n  }\n}`,
    );
  }
  return blocks.join("\n\n");
}

/**
 * The skin as Tailwind CSS: its tokens on :root and one @utility per class.
 * `generator` names the source and command in the header comment.
 */
export function skinCss(skin: Skin, generator = `skins/${skin.name}.ts by \`bun run build\``): string {
  const header = `/* Generated from ${generator}. Do not edit. */\n`;
  const rules = Object.entries(skin.layers).map(
    ([className, applies]) => `@utility ${className} {\n${applies.map((line) => `  @apply ${line};`).join("\n")}\n}`,
  );
  const tokens = tokenCss(skin, "root");
  return `${header}\n${tokens ? `${tokens}\n\n` : ""}${rules.join("\n\n")}\n`;
}

/**
 * Several skins in one stylesheet, switched by name with `data-skin` (spec 035
 * decision 17). The default skin applies everywhere; each scoped skin applies
 * where its name is the nearest `data-skin` ancestor. With the bare default,
 * an element outside any skin region shows the core alone: the skeleton.
 * Scoped skins must extend the default skin.
 */
export interface SkinSet {
  name: string;
  default: Skin;
  scoped: Skin[];
}

/** The core without any skin. */
export const bare: Skin = { name: "bare", layers: {}, tokens: { light: {}, dark: {} } };

/** Prefixes every utility in an @apply line with a variant: "h-12 hover:x" -> "v:h-12 v:hover:x". */
export function withVariant(line: string, variant: string): string {
  return line
    .split(/\s+/)
    .filter(Boolean)
    .map((utility) => `${variant}:${utility}`)
    .join(" ");
}

/** The lines a skin adds on top of another skin it extends, per class. */
export function extensionOf(skin: Skin, base: Skin): Record<string, string[]> {
  const added: Record<string, string[]> = {};
  for (const [className, layers] of Object.entries(skin.layers)) {
    const inherited = base.layers[className] ?? [];
    const isPrefix = inherited.every((line, index) => layers[index] === line);
    if (!isPrefix) throw new Error(`skin "${skin.name}" does not extend "${base.name}" for ${className}`);
    if (layers.length > inherited.length) added[className] = layers.slice(inherited.length);
  }
  return added;
}

/**
 * Matches elements whose nearest skin region is `name`: inside a region with
 * that name, and not inside a different region nested within it. Known limit:
 * the same skin as an outer and an inner region around another skin
 * (base > calaca > base) resolves to the default for the innermost part.
 */
export function skinVariant(name: string): string {
  const region = `[data-skin="${name}"]`;
  const other = `${region} [data-skin]:not(${region})`;
  return `@custom-variant skin-${name} (&:where(${region}, ${region} *):not(:where(${other}, ${other} *)));`;
}

export function skinSetCss(set: SkinSet): string {
  const header = `/* Generated skin set "${set.name}" by \`bun run build\`. Do not edit. */\n`;
  const variants = set.scoped.map((skin) => skinVariant(skin.name));
  const tokens = [tokenCss(set.default, "root"), ...set.scoped.map((skin) => tokenCss(skin, "region"))].filter(Boolean);
  const extensions = set.scoped.map((skin) => ({ variant: `skin-${skin.name}`, added: extensionOf(skin, set.default) }));
  const classNames = new Set([...Object.keys(set.default.layers), ...extensions.flatMap(({ added }) => Object.keys(added))]);
  const rules = [...classNames].map((className) => {
    const applies = [
      ...(set.default.layers[className] ?? []),
      ...extensions.flatMap(({ variant, added }) => (added[className] ?? []).map((line) => withVariant(line, variant))),
    ];
    return `@utility ${className} {\n${applies.map((line) => `  @apply ${line};`).join("\n")}\n}`;
  });
  return `${header}\n${variants.join("\n")}\n\n${tokens.join("\n\n")}\n\n${rules.join("\n\n")}\n`;
}
