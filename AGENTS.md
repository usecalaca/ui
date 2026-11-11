# AGENTS.md — @usecalaca/ui

Calaca UI: framework-free `ca-*` component classes as Tailwind `@utility`
rules, usable in plain HTML, Astro, Next.js and React.

## Commands

- Test: `bun test`
- Build: `bun run build` — regenerates `skins/*.css` and `dist/*`
- Skin CLI: `bun run calaca skin build <skin.ts> [-o file.css] [--prebuilt]`

## Conventions

- **Names** (BEM style): `ca-<component>`, `ca-<component>__<part>`,
  `ca-<component>--<modifier>`, whole lowercase words.
  `test/naming.test.ts` checks the pattern and that Tailwind generates
  nothing for these names.
- **Core**: `src/core/<component>.css` holds structure and accessibility
  only: layout, focus indicator, disabled behavior, touch hit area.
  `core.css` imports them. Prebuilt CSS ships without a reset, so core also
  neutralizes browser defaults per element: `m-0`, `box-border`, inherited
  `font-family`.
- **Skins**: `skins/<name>.ts` maps every class to Tailwind utilities with
  `defineSkin`; an extending skin lists only what differs. `bun run build`
  generates `skins/<name>.css` (one `@utility` per class, one `@apply` line
  per layer, so the extension always wins) and `dist/ca-<name>.css`.
  **Never edit the generated CSS**; `test/skin.test.ts` fails when stale.
- **Skin sets**: `skinSets` in `src/skins.ts` compile several skins into one
  stylesheet (`skins/<set>.css`): the default unscoped, others under a
  generated `skin-<name>` variant for `[data-skin="<name>"]`. Scoped skins
  must extend the default.
- **Generated output**: `bun run build` regenerates `skins/*.css` and
  `dist/*` — never hand-edit either.
- **Contracts**: `src/contracts/<component>.ts` lists every class name in
  full; `src/registry.ts` collects them into `contracts` (elements),
  `blocks`, and `allContracts` for tests and the prebuilt build.
- **Blocks**: sections such as `ca-hero` with parts and a `layout` group
  (`--centered`, `--split`, `--stacked`). Layouts are core: they only set
  `--ca-<block>-*` variables that the root and parts read (enforced by
  `test/split.test.ts`), and skins need not style them. No media queries —
  layouts wrap by intrinsic sizing.
- **Pigments**: interactive colors come from `--ca-pigment`,
  `--ca-pigment-ink`, `--ca-pigment-edge` and their `-hover` forms. The
  component sets its states once with the `interact` variant; modifiers
  only set the variables.
- **Split rule**: core, skin root, variant and size classes set disjoint
  CSS properties. Enforced by `test/split.test.ts`.
- **Specificity**: plain Tailwind utilities on an element always win over
  `ca-*` classes (emitted later). Inside `ca-prose`, `:where()` rules stay
  below every class rule on purpose; contextual spacing comes from sibling
  selectors, not the element itself.
- **Tokens**: the `--ca-*` contract (`src/tokens.ts`) covers color, radius,
  font families, typescale, weight, leading, tracking, elevation, motion
  and `--ca-density`. `src/tokens.css` maps it onto Tailwind theme tokens
  with the Tailwind default as `var()` fallback.
- **Directions**: logical utilities only (`ms-`, `ps-`, `start-`,
  `text-start`); `test/logical.test.ts` rejects physical ones.
- **Minimum targets**: interactive parts keep 24x24px in core (WCAG 2.5.8);
  44px touch areas come from `pointer-coarse`. Minimums are absolute rem
  values, so `--ca-density` can never shrink a target below the floor.
- **Boundaries**: `tailwindcss` is the only dependency; no raw color values.

## Behavior

Native first. `ca-dialog` styles a `<dialog>` opened with `showModal()`;
`ca-dropdown` is a `[popover]` opened with `popovertarget`; `ca-tooltip`
shows with CSS and `ca-tooltip.js` only adds Escape. Scripts live in
`src/behavior/`, build to `dist/ca-*.js`, and have a strict size budget
(~1–1.5 KB gzipped, tested). See `README.md` for the full table.

## Verify

`bun test` — all tests, including skin staleness, naming, logical
properties, split rule and prebuilt size budgets.
