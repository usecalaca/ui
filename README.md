# Calaca UI

One skeleton, many skins. Calaca UI is a component library of plain CSS
classes (`ca-*`) that run in any stack: an accessible core of structure and
behavior, dressed in a skin per product. The same markup works in plain HTML,
Astro, Next.js and React — a dialog is a real `<dialog>`, a menu a real
popover, and the scripts that remain are under 1.5 KB gzipped.

Docs and examples: [calaca.design](https://calaca.design)

## Plain HTML

```html
<link rel="stylesheet" href="ca-base.css" />
```

The prebuilt stylesheets in `dist/` carry every component (no reset, no
element styles) — `ca-base.css`, `ca-calaca.css`, and
`ca-all.css` for switching skins with `data-skin`.

## Tailwind CSS

```css
@import "tailwindcss";
@import "@usecalaca/ui/core.css";
@import "@usecalaca/ui/skins/base.css";
```

Core and skin are Tailwind `@utility` rules, so only the classes your markup
uses reach the CSS.

## Skins and the CLI

Write a skin with `defineSkin`, then build it:

```sh
bunx calaca skin build skins/acme.ts -o acme.css            # Tailwind source
bunx calaca skin build skins/acme.ts --prebuilt --minify    # standalone CSS
bunx calaca css build app.css -o site.css --content "site/**/*.html"
```

`--content` scans markup and keeps only what it uses, `--include` adds a
contract scripts create at runtime, `--watch` rebuilds on change. The CLI
runs on [Bun](https://bun.sh).

## License

MIT
