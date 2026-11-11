# Calaca UI

Framework-free component classes built on Tailwind CSS 4. One `ca-*` class
gives you a complete, accessible component — usable in plain HTML, Astro,
Next.js, React, or anything that runs Tailwind.

- Structure and accessibility live in the **core**; look and feel live in
  **skins** you can swap or write yourself.
- Native browser behavior first (`<dialog>`, `[popover]`, invoker commands);
  tiny vanilla scripts only where the platform falls short.
- No JavaScript framework dependency — the only runtime dependency is
  Tailwind itself.

Docs and examples: https://calaca.design

## Install

```sh
bun add @usecalaca/ui   # or npm/pnpm/yarn
```

## Use with a Tailwind build

```css
@import "tailwindcss";
@import "./theme.css";                  /* your brand's --ca-* tokens */
@import "@usecalaca/ui/core.css";
@import "@usecalaca/ui/skins/base.css";
```

```html
<button class="ca-button ca-button--primary">Save</button>

<dialog class="ca-dialog">
  <form method="dialog">
    <h2 class="ca-dialog__title">Delete file?</h2>
    <button class="ca-button">Cancel</button>
    <button class="ca-button ca-button--danger" value="confirm">Delete</button>
  </form>
</dialog>
```

## Use without a Tailwind build

`bun run build` compiles standalone stylesheets into `dist/` — core, tokens
and one skin in a single file you can drop into any page:

```html
<link rel="stylesheet" href="ca-base.css" />
```

Prebuilt CSS ships without a reset, so it composes with an existing
stylesheet instead of fighting it.

## Write your own skin

A skin maps every `ca-*` class to Tailwind utilities. Extend `base` and list
only what differs, or start from `bare` and dress every class yourself:

```ts
// my-skin.ts
import { base, defineSkin } from "@usecalaca/ui";

export default defineSkin(base, {
  "ca-button": "rounded-full font-semibold",
  "ca-card": "rounded-2xl shadow-md",
});
```

```sh
calaca skin build my-skin.ts -o my-skin.css           # Tailwind source
calaca skin build my-skin.ts -o my-skin.css --prebuilt # standalone CSS
```

## Interactive behavior

Most components work without JavaScript (`<dialog>` opened with
`showModal()`, `[popover]` with `popovertarget`, CSS tooltips). Where a
component needs help, a small script from `dist/` provides it:

| Script | Component |
|---|---|
| `ca-appearance.js` | remembers `data-skin` / `data-appearance` before first paint |
| `ca-commands.js` | invoker-commands polyfill (`commandfor` / `command`) |
| `ca-tabs.js` | WAI-ARIA tabs pattern with arrow keys |
| `ca-tooltip.js` | Escape to dismiss (WCAG 1.4.13) |
| `ca-combobox.js` | floating listbox anchored to the input |
| `ca-toast.js` | `toast()` helper, `ca:toast` events, `data-ca-toast` buttons |
| `ca-copy.js` | copy buttons for `ca-code-block` |
| `ca-date-range.js` | keeps end date on or after start |
| `ca-editor.js` | toolbar, link popover and plain-text paste |

## Design tokens

Every brand axis is a `--ca-*` custom property: color, radius, font
families, a numeric typescale (`--ca-type-xs`…`--ca-type-9xl`), weights,
leading, tracking, elevation, motion and `--ca-density`. Unset tokens fall
back to the Tailwind default, so a minimal `theme.css` only sets what your
brand actually changes.

## Development

Requires [Bun](https://bun.sh).

```sh
bun install
bun test            # unit + contract tests
bun run build       # regenerates skins/*.css and dist/*
```

Layout of the source:

- `src/contracts/` — every `ca-*` class name, in full
- `src/core/` — structure and accessibility per component (CSS only)
- `skins/` — built-in skins as `defineSkin` maps (`*.ts`) and generated CSS
- `src/behavior/` — the vanilla scripts above
- `src/skin.ts`, `src/skins.ts` — `defineSkin`, skin sets, `skins/<name>.css` generation
- `scripts/build-css.ts` — the build

Never hand-edit `skins/*.css` or `dist/*` — both are generated and guarded
by tests.

## License

[MIT](LICENSE)
