/**
 * Public API for writing a skin: `import { base, defineSkin } from "@usecalaca/ui"`.
 * A product skin extends `base` (neutral, complete) and lists only what
 * differs, or starts from `bare` (the core alone) and dresses every class
 * itself. Build it with `calaca skin build <skin.ts>`.
 */
export { base } from "../skins/base.ts";
export { bare, defineSkin, type Skin, type SkinInput, type SkinTokens, type TokenValues } from "./skin.ts";
export { CALACA_TOKENS, type CalacaToken } from "./tokens.ts";
