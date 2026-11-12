# AGENTS.md — @usecalaca/ui

Calaca UI: framework-free `ca-*` component classes as Tailwind `@utility` rules, usable in
plain HTML, Astro, Next.js and React.

- **Names** (BEM style): `ca-<component>`, `ca-<component>__<part>`,
  `ca-<component>--<modifier>` (variant, size, layout), whole lowercase words
  (`ca-button--primary`, `ca-card__title`). `test/naming.test.ts` checks the
  pattern, that parts and modifiers start with their root, and that Tailwind
  generates nothing for these names
- **Core**: `src/core/<component>.css` holds structure and accessibility only:
  layout, focus indicator, disabled behavior, touch hit area. `core.css` imports them.
  Prebuilt CSS ships without a reset, so core also neutralizes browser defaults
  per element: `m-0`, `box-border`, inherited `font-family`
- **Skins**: `skins/<name>.ts` maps every class to Tailwind utilities with
  `defineSkin`; an extending skin lists only what differs. `bun run build`
  generates `skins/<name>.css` (one `@utility` per class, one `@apply` line per
  layer, so the extension always wins) and `dist/ca-<name>.css`. Never edit the
  generated CSS; `test/skin.test.ts` fails when it is stale
- **Product skins** (any project): `import { base, defineSkin } from "@usecalaca/ui"`,
  extend `base` or start bare (no base argument), then
  `calaca skin build <skin.ts> [-o file.css] [--prebuilt]` (`src/cli.ts`).
  Output is Tailwind source for after `core.css`, or with `--prebuilt` a
  standalone stylesheet (all contracts, or only the ones `--content <glob>`
  finds plus `--include <name>` extras; `--minify` shrinks it — the dist files
  are minified). `calaca css build <input.css> -o file.css` compiles any
  consumer stylesheet; its `--content` scans every utility token, Calaca
  classes and plain Tailwind utilities alike. `--watch` rebuilds through a
  fresh child process — in-process imports would serve the cached module.
  Scanning is `src/content.ts` (a hit ships the whole contract, so
  runtime-added parts stay styled); minifying is `src/minify.ts` on
  `Bun.build`, keeping Tailwind the only dependency. The CLI rejects classes
  no contract defines and runs on Bun; `test/cli.test.ts` builds skins in a
  temporary project outside the package
- **Skin sets**: `skinSets` in `src/skins.ts` compile several skins into one
  stylesheet (`skins/<set>.css`): the default unscoped, others under a
  generated `skin-<name>` variant for `[data-skin="<name>"]` and descendants.
  Scoped skins must extend the default. A different skin nested inside a
  scoped region does not reset to the default (known limitation)
- **Appearance script**: `dist/ca-appearance.js` (classic script in `<head>`)
  remembers `data-skin` and `data-appearance` and applies them before first
  paint; controls are form elements with `data-ca-control="skin|appearance"`.
  An appearance pin is mirrored onto `data-theme`, which the `dark`
  variant and skin selectors still accept —
  `data-appearance` wins when both are set. Without a remembered choice it
  leaves page-set attributes alone. `<html data-ca-vt>` opts the swap into a
  view transition (skipped under reduced motion or without the API)
- **Why generated**: two `@utility` definitions with the same name are ordered
  by Tailwind, not by source order, so a hand-written override can lose
- **Pigments**: interactive colors come from `--ca-pigment`, `--ca-pigment-ink`,
  `--ca-pigment-edge` and their `-hover` forms. The component sets its states
  once with the `interact` variant (hover and `focus-visible`); modifiers only
  set the variables
- **Split rule**: core, skin root, variant and size classes set disjoint CSS
  properties. Enforced by `test/split.test.ts`
- **Specificity order**: plain Tailwind utilities on an element always win
  over `ca-*` classes (emitted later). Inside `ca-prose`, `:where()` rules
  stay below every class rule on purpose — but that means a component's own
  declarations (like a core `m-0` reset) also win over a margin the prose
  puts on the element itself. Contextual spacing must therefore come from
  the sibling: `*:has(+ :is(pre,figure))` gives the element before a block
  bottom margin, which no component resets. Two such blocks in a row are
  the exception — the sibling itself carries the reset, so prose closes
  that gap with a class-specificity `:is(pre,figure):has(+ :is(pre,figure))`
  rule instead of `:where()`
- **Generated skins**: `bun run build` regenerates `skins/*.css` and `dist/*`
  — never hand-edit. Sites that compose their own skin set must wire their
  own build script into `dev`/`build` and guard staleness with a test
- **Contracts**: `src/contracts/<component>.ts` lists every class name in full;
  `src/registry.ts` collects them: `contracts` (elements), `blocks`, and
  `allContracts` for tests and the prebuilt build
- **Blocks**: sections such as `ca-hero` with parts and
  a `layout` group (`--centered`, `--split`, `--stacked`). Layouts are core:
  they only set `--ca-<block>-*` variables that the root and parts read
  (enforced by `test/split.test.ts`), and skins need not style them. No media
  queries: layouts wrap by intrinsic sizing, so they fit any container
- **Prebuilt CSS**: `dist/ca-<skin>.css` has no preflight or element styles, so
  it can drop into an existing site next to a plain-CSS brand theme.
  It is minified and covers every contract; `buildPrebuilt(name, { candidates })`
  compiles a subset (the CLI's `--content`/`--include`). Unlayered host CSS
  still beats it, by design
- **Behavior**: native first. `ca-dialog` styles a `<dialog>` opened with
  `showModal()`; markup uses standard invoker commands (`commandfor`,
  `command="show-modal" | "close"`). `src/behavior/commands.ts` builds to
  `dist/ca-commands.js` (under 1 KB gzipped, tested) and only runs where
  browsers lack native support. `ca-dropdown` is a `[popover]` opened with
  `popovertarget` (disclosure pattern, no `role="menu"`), placed under its
  button with CSS anchor positioning inside `@supports`; without it the
  popover shows centered. The core draws a chevron on the trigger
  (`::before`, as `::after` is the button's touch area). `ca-tabs` needs
  `src/behavior/tabs.ts` (`dist/ca-tabs.js`, under 1 KB gzipped): one
  document listener for every tab list, WAI-ARIA tabs pattern with automatic
  activation and direction-aware arrow keys. `ca-tooltip` shows with CSS
  (hover and `:focus-visible`); `dist/ca-tooltip.js` only adds Escape to
  dismiss it (WCAG 1.4.13). `ca-popover` shares the dropdown's popover
  placement. `ca-navbar` is a size container; its menu is a `[popover]` that
  shows in the bar at 40rem and wider, or 64rem with `ca-navbar--roomy`
  (both in the `ca-navbar-wide` variant) and opens from the menu button below
- **Combobox**: `dist/ca-combobox.js` (budget 1.5 KB gzipped). A listbox with
  `popover="manual"` floats, anchored to the input through one anchor name;
  without `popover` it is inline and leaves Escape to its container.
  `data-filter="none"` lets the app render options (followed with a
  MutationObserver), `data-autoselect` activates the first option, and link
  options (`<a role="option" href>`) navigate
- **Toast**: `dist/ca-toast.js` exports `toast()` and also listens for
  `ca:toast` events and `data-ca-toast` buttons. Its region is a manual
  `[popover]` with a status element that exists before the first message;
  while a modal dialog is open the region moves into it, since everything
  outside a modal dialog is inert
- **Layout and type families**: `container`, `stack`, `cluster`, `grid`,
  `section` read space from `--ca-<name>-gap|max|space` variables that the
  skin's size modifiers set (root and sizes never share a property);
  `ca-grid` takes `--ca-grid-min`. `ca-prose` styles plain HTML through
  `:where()` rules, so utilities on one element win
- **Select menu**: skins make `ca-select` customizable behind
  `supports-[appearance:base-select]:` (Chrome, Safari) and style
  `::picker(select)` and its options; elsewhere the native menu stays. The
  core hides `::picker-icon` (skins draw the arrow) and lays the select out
  as flex so the chosen value stays centred
- **Stepper, date range, editor**: `ca-stepper` items carry `data-status`
  (complete steps show a CSS check); `dist/ca-date-range.js` keeps the end on
  or after the start through `min` and `max`; `dist/ca-editor.js` (budget
  1.5 KB) runs the toolbar (roving tabindex, `aria-pressed`), the link
  popover form and plain-text paste, and writes the HTML into a hidden input.
  It uses `document.execCommand`; sanitize the HTML on the server
- **Code blocks and copy**: `ca-code-block` is a figure with a header;
  `dist/ca-copy.js` copies the text of the element `data-ca-copy` names and
  announces it in the status part, or as a toast with `data-ca-copy-toast`
- **Minimum targets**: interactive parts keep 24x24px in the core (WCAG
  2.5.8), so even the bare skeleton passes; 44px touch areas come from
  `pointer-coarse`. The minimums are absolute rem values, not spacing
  utilities, so `--ca-density` can never shrink a target below the floor
- **Tokens**: the Calaca contract `--ca-*` (`src/tokens.ts`) covers every
  brand axis — color, radius (`-control`, `-card`, `-shell`), font families,
  typescale (`--ca-type-xs…9xl`), weight, leading, tracking, elevation
  (`--ca-shadow-*` + `--ca-shadow-strong`), motion (`--ca-ease`,
  `--ca-ease-emphasis`, `--ca-duration`) and `--ca-density`, which rescales
  `--spacing`. `src/tokens.css` maps the contract onto Tailwind theme tokens
  with the Tailwind default as `var()` fallback, so an unset token keeps
  working. Brands set tokens in a `theme.css` or their skin's `tokens`
  field; Calaca itself never reads brand-specific variables
- **Directions**: logical utilities only (`ms-`, `ps-`, `start-`, `text-start`);
  `test/logical.test.ts` rejects physical ones in core and skins
- **Boundaries**: `tailwindcss` is the only dependency; no raw color values
- **npm release**: publish from this directory (`bun publish` or
  `npm publish`). `files` limits the tarball to `src`, `core.css`, `skins`,
  `dist`; `prepublishOnly` runs build + tests. Exports ship TypeScript
  sources (Bun-first); the `Bun.*` APIs in `compile`/`content`/`minify`/`cli`
  make the tooling Bun-only
- **Verify**: `bun test` — all tests, including skin staleness, naming,
  logical properties, split rule and prebuilt size budgets
