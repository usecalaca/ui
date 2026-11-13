import { base } from "../skins/base.ts";
import { calaca } from "../skins/calaca.ts";
import { bare, type Skin, type SkinSet } from "./skin.ts";

/** Every built-in skin, by name. Product skins live with their brand. */
export const skins: Record<string, Skin> = { base, calaca };

/**
 * Built-in skin sets: several skins in one stylesheet, switched with data-skin.
 * "all" has the bare core as default, so an element outside any skin region
 * shows the skeleton.
 */
export const skinSets: Record<string, SkinSet> = {
  all: { name: "all", default: bare, scoped: [base, calaca] },
};
