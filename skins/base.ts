import { defineSkin } from "../src/skin.ts";

/**
 * Base: the neutral starting point for any product skin. Pure grayscale —
 * black, white and grays only, no brand hues. Product skins extend it and
 * change what differs.
 * Pigments: a component paints itself from --ca-pigment (fill), --ca-pigment-ink
 * (text), --ca-pigment-edge (border) and their -hover forms once; a modifier
 * only sets those variables (spec 035 decision 21).
 */
const pigment = (fill: string, ink: string, edge = fill, fillHover = fill, edgeHover = edge) =>
  `[--ca-pigment:${fill}] [--ca-pigment-ink:${ink}] [--ca-pigment-edge:${edge}] [--ca-pigment-hover:${fillHover}] [--ca-pigment-edge-hover:${edgeHover}]`;

/**
 * The select's menu in the skin's style where the browser supports a
 * customizable select (appearance: base-select); elsewhere the native menu
 * stays.
 */
const picker = (...lines: string[]) =>
  [
    "[appearance:base-select] [&::picker(select)]:[appearance:base-select]",
    ...lines,
  ].map((line) =>
    line
      .split(" ")
      .map((utility) => `supports-[appearance:base-select]:${utility}`)
      .join(" "),
  );

/** Alert tone: a tinted fill, the status color on the edge and the title, body text in the page color. */
const tone = (fill: string, edge: string, title: string) =>
  `[--ca-pigment:${fill}] [--ca-pigment-edge:${edge}] [--ca-pigment-ink:var(--color-foreground)] [--ca-pigment-title:${title}]`;

/** Quiet supporting text: descriptions and secondary item copy. */
const quietText = "text-sm text-muted-foreground text-pretty";
/** A block's lead paragraph under the display title. */
const leadText = "text-lg text-muted-foreground text-pretty";
/** A block's display title. */
const blockTitle = "font-display text-3xl/tight font-semibold tracking-tight text-balance";
/** A row of actions with a little air above. */
const actionRow = "gap-2 pt-2";

export const base = defineSkin(
  "base",
  {
  "ca-button": [
    "gap-2 rounded-lg border font-medium no-underline",
    "border-(--ca-pigment-edge) bg-(--ca-pigment) text-(--ca-pigment-ink) interact:border-(--ca-pigment-edge-hover) interact:bg-(--ca-pigment-hover)",
    "disabled:opacity-60 aria-disabled:opacity-60",
    "motion-safe:transition-[background-color,border-color,scale] motion-safe:duration-150 motion-safe:ease-out active:scale-[0.97]",
  ],
  "ca-button--primary": pigment("var(--color-primary)", "var(--color-primary-foreground)", "var(--color-primary)", "var(--color-primary-hover)", "var(--color-primary-hover)"),
  "ca-button--secondary": pigment("var(--color-secondary)", "var(--color-secondary-foreground)", "var(--color-secondary)", "color-mix(in_oklab,var(--color-secondary)_90%,transparent)"),
  "ca-button--outline": pigment("var(--color-background)", "var(--color-foreground)", "var(--color-input)", "var(--color-muted)"),
  "ca-button--ghost": pigment("transparent", "var(--color-foreground)", "transparent", "var(--color-muted)"),
  "ca-button--danger": pigment("var(--color-destructive)", "white", "var(--color-destructive)", "color-mix(in_oklab,var(--color-destructive)_90%,transparent)"),
  "ca-button--xs": "h-7 px-2.5 text-xs",
  "ca-button--sm": "h-8 px-3 text-sm",
  "ca-button--md": "h-9 px-4 text-sm",
  "ca-button--lg": "h-11 px-5 text-base",
  "ca-button--xl": "h-12 px-6 text-lg",
  "ca-button--icon": "size-9 p-0",

  "ca-card": "gap-4 rounded-card border border-border bg-background p-6 text-foreground shadow-xs",
  "ca-card__title": "font-display text-lg leading-tight font-semibold text-balance",
  "ca-card__description": quietText,
  "ca-card__footer": actionRow,

  "ca-field": "gap-1.5",
  // A <legend> is not a grid item of its fieldset, so it keeps its distance with a margin.
  "ca-field__label": "text-sm font-medium text-foreground [legend&]:mb-1.5",
  "ca-field__hint": "text-sm text-muted-foreground",
  "ca-field__error": "text-sm font-medium text-destructive",
  "ca-input": [
    "rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground",
    "aria-invalid:border-destructive disabled:opacity-60",
  ],
  // Inputs stay at 16px on small screens so iOS does not zoom in on focus.
  "ca-input--sm": "h-8 px-2.5 text-base sm:text-sm",
  "ca-input--md": "h-9 px-3 text-base sm:text-sm",
  "ca-input--lg": "h-11 px-3.5 text-base",

  "ca-select": [
    "appearance-none rounded-lg border border-input bg-background text-foreground disabled:opacity-60 aria-invalid:border-destructive",
    // The arrow: two triangles in the text color, mirrored in right-to-left. Forced colors get the native arrow back.
    "bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-size-[0.3125rem_0.3125rem] bg-no-repeat",
    "[background-position:calc(100%-1.125rem)_50%,calc(100%-0.8125rem)_50%] rtl:[background-position:0.8125rem_50%,1.125rem_50%] forced-colors:appearance-auto",
    ...picker(
      "[&::picker(select)]:my-1 [&::picker(select)]:rounded-lg [&::picker(select)]:border [&::picker(select)]:border-border [&::picker(select)]:bg-background [&::picker(select)]:p-1 [&::picker(select)]:text-foreground [&::picker(select)]:shadow-lg",
      "[&_option]:rounded-md [&_option]:px-2.5 [&_option]:py-1.5 [&_option:checked]:font-medium [&_option:is(:hover,:focus-visible)]:bg-muted [&_option::checkmark]:me-2",
    ),
  ],
  "ca-select--sm": "h-8 ps-2.5 pe-8 text-base sm:text-sm",
  "ca-select--md": "h-9 ps-3 pe-9 text-base sm:text-sm",
  "ca-select--lg": "h-11 ps-3.5 pe-10 text-base",

  "ca-combobox": "text-foreground",
  "ca-combobox__listbox": "my-1 rounded-lg border border-border bg-background p-1 shadow-lg",
  "ca-combobox__option": "rounded-md px-2.5 py-1.5 text-sm text-foreground no-underline aria-selected:bg-muted aria-disabled:opacity-60 hover:bg-muted",

  "ca-checkbox": "gap-2 text-sm text-foreground has-disabled:opacity-60",
  "ca-checkbox__input": "size-4 accent-primary",
  "ca-radio": "gap-2 text-sm text-foreground has-disabled:opacity-60",
  "ca-radio__input": "size-4 accent-primary",
  "ca-switch": "gap-2.5 text-sm text-foreground has-disabled:opacity-60",
  "ca-switch__input": [
    "h-5 w-9 appearance-none rounded-full bg-input forced-colors:appearance-auto",
    // The thumb: a circle in the card color that moves to the end when on.
    "bg-[radial-gradient(circle_closest-side,var(--color-background)_calc(100%-1px),transparent_100%)] bg-size-[1rem_1rem] bg-no-repeat",
    "[background-position:0.125rem_50%] checked:[background-position:calc(100%-0.125rem)_50%] rtl:[background-position:calc(100%-0.125rem)_50%] rtl:checked:[background-position:0.125rem_50%]",
    "checked:bg-[radial-gradient(circle_closest-side,var(--color-primary-foreground)_calc(100%-1px),transparent_100%)] checked:bg-primary",
    "motion-safe:transition-[background-color,background-position] motion-safe:duration-150",
  ],
  /* Custom-control DOMs: the button box and its check/thumb child. */
  "ca-checkbox__control": [
    "size-4.5 rounded-[5px] border border-input bg-background shadow-xs",
    "data-disabled:opacity-50",
    "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
    "data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
    "motion-safe:transition-colors",
  ],
  "ca-checkbox__indicator": "size-full text-current [&_svg:not([class*='size-'])]:size-3.5",
  "ca-radio__control": [
    "size-4.5 rounded-full border border-input bg-background shadow-xs",
    "data-disabled:opacity-50",
    "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
    "motion-safe:transition-colors",
  ],
  "ca-radio__indicator": "size-full text-current [&_svg:not([class*='size-'])]:size-2.5",
  "ca-switch__control": [
    "h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] rounded-full p-px [--thumb-size:--spacing(5)]",
    "bg-input data-checked:bg-primary data-disabled:opacity-60",
    "motion-safe:transition-colors",
  ],
  "ca-switch__thumb": [
    "aspect-square h-full rounded-(--thumb-size) bg-background shadow-sm",
    "data-checked:translate-x-[calc(var(--thumb-size)-4px)] rtl:data-checked:-translate-x-[calc(var(--thumb-size)-4px)]",
    "motion-safe:transition-transform",
  ],

  "ca-badge": [
    "gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
    "border-(--ca-pigment-edge) bg-(--ca-pigment) text-(--ca-pigment-ink)",
  ],
  "ca-badge--neutral": pigment("var(--color-muted)", "var(--color-foreground)", "var(--color-border)"),
  "ca-badge--primary": pigment("var(--color-primary)", "var(--color-primary-foreground)"),
  "ca-badge--success": pigment("var(--color-background)", "var(--color-success)", "currentColor"),
  "ca-badge--warning": pigment("var(--color-background)", "var(--color-warning)", "currentColor"),
  "ca-badge--danger": pigment("var(--color-background)", "var(--color-destructive)", "currentColor"),
  "ca-badge--info": pigment("var(--color-background)", "var(--color-info)", "currentColor"),

  // The section label: a tracked uppercase kicker, the number a quiet pill.
  "ca-eyebrow": "gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
  "ca-eyebrow__number": "rounded-full border border-border bg-muted px-1.5 py-0.5 font-medium tracking-normal tabular-nums text-foreground",

  "ca-alert": [
    "gap-1 rounded-lg border p-4 text-sm",
    "border-(--ca-pigment-edge) bg-(--ca-pigment) text-(--ca-pigment-ink)",
  ],
  "ca-alert__title": "font-semibold text-(--ca-pigment-title)",
  "ca-alert__description": "text-pretty",
  "ca-alert__actions": actionRow,
  "ca-alert--neutral": tone("var(--color-muted)", "var(--color-border)", "var(--color-foreground)"),
  "ca-alert--info": tone("color-mix(in_oklab,var(--color-info)_8%,var(--color-background))", "var(--color-info)", "var(--color-info)"),
  "ca-alert--success": tone("color-mix(in_oklab,var(--color-success)_8%,var(--color-background))", "var(--color-success)", "var(--color-success)"),
  "ca-alert--warning": tone("color-mix(in_oklab,var(--color-warning)_8%,var(--color-background))", "var(--color-warning)", "var(--color-warning)"),
  "ca-alert--danger": tone("color-mix(in_oklab,var(--color-destructive)_8%,var(--color-background))", "var(--color-destructive)", "var(--color-destructive)"),

  "ca-accordion": "divide-y divide-border border-y border-border text-foreground",
  // Opening and closing animate the height where the browser supports ::details-content and interpolate-size.
  "ca-accordion__item": [
    "[interpolate-size:allow-keywords] [&::details-content]:h-0 [&::details-content]:overflow-hidden open:[&::details-content]:h-auto",
    "motion-safe:[&::details-content]:transition-[height,content-visibility] motion-safe:[&::details-content]:duration-200 motion-safe:[&::details-content]:transition-discrete",
  ],
  "ca-accordion__trigger": "gap-4 py-4 font-medium [&::after]:motion-safe:transition-[rotate] [&::after]:motion-safe:duration-150",
  "ca-accordion__content": "pb-4 text-sm text-muted-foreground text-pretty",

  "ca-tabs": "gap-4",
  "ca-tabs__list": "w-fit gap-1 rounded-lg bg-muted p-1",
  "ca-tabs__tab": [
    "rounded-md border-0 bg-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground",
    "interact:text-foreground aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-xs disabled:opacity-60",
    "motion-safe:transition-[background-color,color] motion-safe:duration-150",
  ],
  "ca-tabs__panel": "rounded-sm text-sm text-foreground",

  "ca-breadcrumb": "text-sm text-muted-foreground",
  "ca-breadcrumb__list": "gap-1.5",
  "ca-breadcrumb__item": "gap-1.5",
  "ca-breadcrumb__link": "rounded-sm text-muted-foreground underline-offset-4 interact:text-foreground interact:underline aria-[current=page]:font-medium aria-[current=page]:text-foreground aria-[current=page]:no-underline",

  "ca-pagination": "text-sm",
  "ca-pagination__list": "gap-1",
  "ca-pagination__link": [
    "h-9 gap-1 rounded-lg border border-transparent px-3 font-medium text-foreground no-underline",
    "interact:bg-muted aria-[current=page]:border-input aria-[current=page]:bg-background aria-disabled:pointer-events-none aria-disabled:opacity-60",
  ],
  "ca-pagination__ellipsis": "h-9 min-w-9 text-muted-foreground",

  "ca-avatar": "rounded-full bg-muted font-medium text-foreground",
  "ca-avatar__image": "rounded-[inherit]",
  "ca-avatar--sm": "size-8 text-xs",
  "ca-avatar--md": "size-10 text-sm",
  "ca-avatar--lg": "size-14 text-lg",

  "ca-progress": [
    "h-2 appearance-none overflow-hidden rounded-full border-0 bg-muted text-primary forced-colors:appearance-auto",
    "[&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary",
    "motion-safe:[&::-webkit-progress-value]:transition-[width] motion-safe:[&::-webkit-progress-value]:duration-300",
  ],

  "ca-table": [
    "rounded-lg border border-border text-sm text-foreground",
    "[:where(&)_th]:bg-muted [:where(&)_th]:px-3 [:where(&)_th]:py-2 [:where(&)_th]:font-medium [:where(&)_th]:text-muted-foreground [:where(&)_td]:border-t [:where(&)_td]:border-border [:where(&)_td]:px-3 [:where(&)_td]:py-2.5",
  ],
  "ca-table__caption": "px-3 py-2 text-sm font-medium",

  "ca-skeleton": "bg-muted motion-safe:animate-pulse",
  "ca-skeleton--text": "h-[1lh] w-full rounded-sm",
  "ca-skeleton--circle": "size-10 rounded-full",
  "ca-skeleton--block": "h-24 w-full rounded-card",

  "ca-empty-state": "gap-3 rounded-card border border-dashed border-border px-6 py-10 text-foreground",
  "ca-empty-state__media": "mb-1 size-12 rounded-full bg-muted text-muted-foreground",
  "ca-empty-state__title": "font-display text-lg font-semibold text-balance",
  "ca-empty-state__description": quietText,
  "ca-empty-state__actions": actionRow,

  "ca-tooltip": "align-middle",
  "ca-tooltip__content": [
    "mb-2 rounded-md bg-surface-inverse px-2.5 py-1.5 text-xs font-medium text-on-inverse shadow-md text-balance",
    "opacity-0 motion-safe:transition-[opacity,visibility] motion-safe:duration-150 [:where(.ca-tooltip:hover:not([data-dismissed]))>&]:opacity-100 [:where(.ca-tooltip:has(:focus-visible):not([data-dismissed]))>&]:opacity-100",
  ],

  "ca-tooltip__popup": [
    "rounded-md bg-surface-inverse px-2.5 py-1.5 text-xs font-medium text-on-inverse shadow-md text-balance",
    "motion-safe:transition-[opacity,scale] motion-safe:duration-150 data-ending-style:opacity-0 data-ending-style:scale-98 data-starting-style:opacity-0 data-starting-style:scale-98",
  ],
  "ca-tooltip__arrow": "rounded-[2px] bg-surface-inverse fill-surface-inverse",

  "ca-popover": "align-middle",
  "ca-popover__panel": [
    "w-80 gap-3 rounded-lg border border-border bg-background p-4 text-sm text-foreground shadow-lg",
    "motion-safe:transition-[opacity,translate] motion-safe:duration-100 motion-safe:ease-out starting:ca-open:-translate-y-1 starting:ca-open:opacity-0",
  ],

  "ca-app-shell": "bg-background text-foreground",
  "ca-app-shell__header": "gap-2 border-b border-border bg-background px-4 py-2",
  "ca-app-shell__nav": "bg-muted p-3 shadow-xl backdrop:bg-foreground/25 ca-app-shell-wide:shadow-none",
  "ca-app-shell__main": "bg-background",
  "ca-app-shell__toggle": "size-9 rounded-lg border-0 bg-transparent text-foreground interact:bg-muted",

  "ca-navbar": "gap-4 border-b border-border bg-background px-4 py-2 text-sm text-foreground",
  "ca-navbar__brand": "gap-2 rounded-md font-display text-base font-semibold text-foreground",
  "ca-navbar__menu": [
    "gap-0.5 rounded-lg border border-border bg-background p-1 text-foreground shadow-lg",
    "ca-navbar-wide:gap-1 ca-navbar-wide:rounded-none ca-navbar-wide:border-0 ca-navbar-wide:bg-transparent ca-navbar-wide:p-0 ca-navbar-wide:shadow-none",
  ],
  "ca-navbar__link": "rounded-md px-3 py-2 font-medium text-muted-foreground interact:bg-muted interact:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground",
  "ca-navbar__actions": "gap-2",
  "ca-navbar__toggle": "size-9 rounded-lg border-0 bg-transparent text-foreground interact:bg-muted",

  "ca-sidebar": "gap-6 text-sm",
  "ca-sidebar__group": "gap-1",
  "ca-sidebar__heading": "px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-foreground",
  "ca-sidebar__subheading": "px-3 pt-4 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground",
  "ca-sidebar__list": "gap-0.5",
  "ca-sidebar__link": "rounded-md px-3 py-2 text-muted-foreground interact:bg-muted interact:text-foreground aria-[current=page]:bg-muted aria-[current=page]:font-semibold aria-[current=page]:text-foreground",

  "ca-stat": "gap-1 text-foreground",
  "ca-stat__label": "text-sm font-medium text-muted-foreground",
  "ca-stat__value": "font-display text-3xl leading-tight font-semibold tabular-nums",
  "ca-stat__description": "text-sm text-muted-foreground",

  "ca-timeline": "gap-0 text-foreground",
  // The marker sits on a line along the start edge; the last item has no line below its marker.
  "ca-timeline__item": [
    "gap-0.5 border-s border-border ps-6 pb-6 last:border-transparent last:pb-0",
    "[&::before]:-start-[0.3125rem] [&::before]:top-1.5 [&::before]:size-2.5 [&::before]:rounded-full [&::before]:border-2 [&::before]:border-background [&::before]:bg-muted-foreground",
    "aria-[current=step]:[&::before]:bg-primary aria-[current=step]:[&::before]:outline-2 aria-[current=step]:[&::before]:outline-primary",
  ],
  "ca-timeline__time": "text-xs font-medium text-muted-foreground tabular-nums",
  "ca-timeline__title": "text-sm font-semibold",
  "ca-timeline__description": quietText,

  "ca-file-upload": [
    "text-sm text-muted-foreground disabled:opacity-60",
    "file:me-3 file:h-9 file:rounded-lg file:border file:border-input file:bg-background file:px-3 file:text-sm file:font-medium file:text-foreground",
    "hover:file:bg-muted",
  ],

  "ca-sheet": [
    "gap-4 border-border bg-background p-6 text-foreground shadow-xl backdrop:bg-overlay",
    "[&:not(.ca-sheet--bottom)]:border-s [&.ca-sheet--start]:border-s-0 [&.ca-sheet--start]:border-e [&.ca-sheet--bottom]:rounded-t-xl [&.ca-sheet--bottom]:border-t",
    "motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out starting:open:opacity-0 starting:open:[&.ca-sheet--bottom]:translate-y-4",
  ],
  "ca-sheet__title": "font-display text-lg leading-tight font-semibold text-balance",
  "ca-sheet__description": quietText,
  "ca-sheet__body": "text-sm",
  "ca-sheet__footer": "gap-2 border-t border-border pt-4",

  "ca-prompt-input": "rounded-card border border-border bg-background p-2 shadow-xs data-disabled:opacity-64",
  "ca-prompt-input__textarea": "min-h-11 border-0 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-none",
  "ca-prompt-input__actions": "gap-2",
  "ca-icon": "[--ca-icon-size:1em] size-(--ca-icon-size)",
  "ca-icon--sm": "[--ca-icon-size:0.875em]",
  "ca-icon--lg": "[--ca-icon-size:1.25em]",
  "ca-icon--xl": "[--ca-icon-size:1.5em]",
  "ca-scroll-area": "text-foreground",
  "ca-scroll-area__viewport": "data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain",
  "ca-scroll-area__content": "min-h-0",
  "ca-scroll-area__scrollbar": [
    "data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5",
    "opacity-0 transition-opacity delay-300 data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-100 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100",
  ],
  "ca-scroll-area__thumb": "bg-foreground/20",
  "ca-scroll-area__corner": "bg-transparent",
  "ca-scroll-area--fade": [
    "[--fade-size:1.5rem]",
    "[&>.ca-scroll-area__viewport]:mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))]",
    "[&>.ca-scroll-area__viewport]:mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))]",
    "[&>.ca-scroll-area__viewport]:mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))]",
    "[&>.ca-scroll-area__viewport]:mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))]",
  ],
  "ca-scroll-area--gutter": "[scrollbar-gutter:stable_both_edges] [&>.ca-scroll-area__viewport]:data-has-overflow-y:pe-2.5 [&>.ca-scroll-area__viewport]:data-has-overflow-x:pb-2.5",
  "ca-separator": "bg-border",
  "ca-separator--horizontal": "h-px w-full",
  "ca-separator--vertical": "w-px self-stretch",

  "ca-spinner": "rounded-full border-current border-e-transparent text-muted-foreground motion-safe:animate-spin",
  "ca-spinner--sm": "size-3.5 border-2",
  "ca-spinner--md": "size-4 border-2",
  "ca-spinner--lg": "size-6 border-[3px]",

  // Layout: space and widths come from variables the size modifiers set, so root and sizes never set the same property.
  "ca-container": "px-4 sm:px-6",
  "ca-container--sm": "[--ca-container-max:42rem]",
  "ca-container--md": "[--ca-container-max:64rem]",
  "ca-container--lg": "[--ca-container-max:80rem]",
  "ca-stack": "[gap:var(--ca-stack-gap,1rem)]",
  "ca-stack--sm": "[--ca-stack-gap:0.5rem]",
  "ca-stack--md": "[--ca-stack-gap:1rem]",
  "ca-stack--lg": "[--ca-stack-gap:2rem]",
  "ca-cluster": "[gap:var(--ca-cluster-gap,0.5rem)]",
  "ca-cluster--sm": "[--ca-cluster-gap:0.25rem]",
  "ca-cluster--md": "[--ca-cluster-gap:0.5rem]",
  "ca-cluster--lg": "[--ca-cluster-gap:1rem]",
  "ca-grid": "[gap:var(--ca-grid-gap,1.5rem)]",
  "ca-grid--sm": "[--ca-grid-gap:0.75rem]",
  "ca-grid--md": "[--ca-grid-gap:1.5rem]",
  "ca-grid--lg": "[--ca-grid-gap:2.5rem]",
  "ca-section": "[padding-block:var(--ca-section-space,4rem)]",
  "ca-section--sm": "[--ca-section-space:2.5rem]",
  "ca-section--md": "[--ca-section-space:4rem]",
  "ca-section--lg": "[--ca-section-space:6rem]",

  "ca-heading": "font-display font-semibold tracking-tight text-foreground text-balance",
  "ca-heading--xl": "text-4xl/tight sm:text-5xl/tight",
  "ca-heading--lg": "text-3xl/tight",
  "ca-heading--md": "text-2xl/tight",
  "ca-heading--sm": "text-xl/tight",
  "ca-text": "text-foreground text-pretty",
  "ca-text--sm": "text-sm leading-normal",
  "ca-text--md": "text-base leading-relaxed",
  "ca-text--lg": "text-lg leading-relaxed",
  // Prose styles plain HTML inside it; :where() keeps every rule below one class, so utilities win.
  "ca-prose": [
    "text-lg leading-relaxed text-foreground [:where(&)>*]:my-0 [:where(&)>*+*]:mt-6",
    "[:where(&)_:is(h2,h3,h4)]:font-display [:where(&)_:is(h2,h3,h4)]:leading-tight [:where(&)_:is(h2,h3,h4)]:font-semibold [:where(&)_:is(h2,h3,h4)]:text-balance [:where(&)>:is(h2,h3,h4)]:mt-8 [:where(&)_h2]:text-3xl [:where(&)_h3]:text-2xl [:where(&)_h4]:text-xl",
    "[:where(&)_:is(ul,ol)]:ps-6 [:where(&)_ul]:list-disc [:where(&)_ol]:list-decimal [:where(&)_li+li]:mt-1",
    "[:where(&)_a]:text-foreground [:where(&)_a]:underline [:where(&)_a]:underline-offset-4",
    "[:where(&)_code]:rounded-sm [:where(&)_code]:bg-muted [:where(&)_code]:px-1 [:where(&)_code]:font-mono [:where(&)_code]:text-[0.875em]",
    // Code inside a <pre> (or a ca-code-block) keeps the block's own look.
    "[:where(&)_pre]:overflow-x-auto [:where(&)_pre]:text-sm [:where(&)_pre]:leading-relaxed [:where(&)_pre_code]:bg-transparent [:where(&)_pre_code]:p-0 [:where(&)_pre_code]:text-[length:inherit]",
    "[:where(&)_blockquote]:border-s-2 [:where(&)_blockquote]:border-border [:where(&)_blockquote]:ps-4 [:where(&)_blockquote]:text-muted-foreground",
    "[:where(&)_hr]:h-px [:where(&)_hr]:border-0 [:where(&)_hr]:bg-border",
    // Block-level code and figures breathe more than running text. The air
    // above comes from the previous sibling's bottom margin, because a
    // ca-code-block's own m-0 reset outranks a margin on the figure itself.
    "[:where(&)>:is(pre,figure)]:mt-6 [:where(&)>:is(pre,figure)+*]:mt-6 [:where(&)>*:has(+:is(pre,figure))]:mb-6",
    // Two blocks back to back: the first one's :where() margin above loses
    // to a ca-code-block's m-0 reset, so this gap needs class specificity.
    "[&>:is(pre,figure):has(+:is(pre,figure))]:mb-6",
  ],
  // The underline is the affordance: foreground at rest, the accent on hover
  // and focus, growing a step as it changes color.
  "ca-link": [
    "text-foreground underline decoration-foreground decoration-2 underline-offset-4",
    "interact:decoration-primary interact:decoration-[3px] interact:underline-offset-[6px]",
    "motion-safe:transition-[text-decoration-color,text-decoration-thickness,text-underline-offset] motion-safe:duration-200",
  ],
  "ca-code": "rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.875em] text-foreground",
  "ca-code-block": "overflow-hidden rounded-lg border border-border bg-muted text-foreground",
  "ca-code-block__header": "gap-3 border-b border-border bg-background px-4 py-1.5",
  "ca-code-block__title": "font-mono text-xs text-muted-foreground",
  "ca-code-block__actions": "gap-2",
  "ca-code-block__code": "p-4 font-mono text-sm leading-relaxed",
  "ca-code-block__status": "text-sm",

  "ca-stepper": "gap-x-6 gap-y-4 text-foreground",
  "ca-stepper__item": "gap-x-3 gap-y-1",
  "ca-stepper__marker": [
    "mb-1 size-8 rounded-full border-2 border-input bg-background text-sm font-semibold tabular-nums text-muted-foreground",
    "[[data-status=current]>&]:border-primary [[data-status=current]>&]:text-foreground [[data-status=complete]>&]:border-primary [[data-status=complete]>&]:bg-primary [[data-status=complete]>&]:text-primary-foreground",
  ],
  "ca-stepper__label": "text-sm font-medium [[data-status=upcoming]>&]:text-muted-foreground",
  "ca-stepper__description": "text-xs text-muted-foreground",

  "ca-date-range": "gap-1.5 text-foreground",
  "ca-date-range__fields": "gap-3",
  "ca-date-range__field": "gap-1.5 text-sm font-medium",
  "ca-date-range__separator": "h-9 text-muted-foreground",

  "ca-editor": "overflow-hidden rounded-lg border border-input bg-background text-foreground focus-within:border-ring",
  "ca-editor__toolbar": "gap-1 border-b border-border bg-muted p-1",
  "ca-editor__tool": [
    "size-8 rounded-md border-0 bg-transparent text-sm font-semibold text-muted-foreground",
    "interact:bg-background interact:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs",
  ],
  "ca-editor__content": [
    "px-3 py-2 text-base leading-relaxed sm:text-sm",
    "[:where(&)>*+*]:mt-2 [:where(&)_h3]:text-lg [:where(&)_h3]:font-semibold [:where(&)_:is(ul,ol)]:ps-6 [:where(&)_ul]:list-disc [:where(&)_ol]:list-decimal [:where(&)_a]:underline [:where(&)_a]:underline-offset-4",
  ],
  "ca-editor__link": "w-72 gap-3 rounded-lg border border-border bg-background p-3 text-sm text-foreground shadow-lg",

  "ca-kbd": "min-w-6 justify-center rounded-md border border-b-2 border-border bg-muted px-1.5 font-mono text-[0.8em] leading-5 text-foreground",

  "ca-toast__region": "gap-2 p-4",
  "ca-toast": [
    "gap-3 rounded-lg border py-3 ps-4 pe-3 text-sm shadow-lg",
    "border-(--ca-pigment-edge) bg-(--ca-pigment) text-(--ca-pigment-ink)",
    "motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out starting:translate-y-2 starting:opacity-0",
  ],
  "ca-toast__message": "py-0.5 font-medium text-pretty",
  "ca-toast__close": "size-7 rounded-md border-0 bg-transparent text-base leading-none text-muted-foreground interact:bg-muted interact:text-foreground",
  "ca-toast__status": "text-sm",
  // Toasts float over content, so their fill is opaque: the status color mixed into the card surface.
  "ca-toast--neutral": tone("var(--color-background)", "var(--color-border)", "var(--color-foreground)"),
  "ca-toast--info": tone("color-mix(in_oklab,var(--color-info)_8%,var(--color-background))", "var(--color-info)", "var(--color-info)"),
  "ca-toast--success": tone("color-mix(in_oklab,var(--color-success)_8%,var(--color-background))", "var(--color-success)", "var(--color-success)"),
  "ca-toast--warning": tone("color-mix(in_oklab,var(--color-warning)_8%,var(--color-background))", "var(--color-warning)", "var(--color-warning)"),
  "ca-toast--danger": tone("color-mix(in_oklab,var(--color-destructive)_8%,var(--color-background))", "var(--color-destructive)", "var(--color-destructive)"),

  "ca-features": "gap-10 text-foreground",
  "ca-features__header": "gap-3",
  "ca-features__title": blockTitle,
  "ca-features__lead": leadText,
  "ca-features__list": "gap-x-8 gap-y-10",
  "ca-features__item": "gap-x-4 gap-y-2",
  "ca-features__icon": "mb-2 size-10 rounded-lg bg-muted text-foreground",
  "ca-features__item-title": "text-base font-semibold",
  "ca-features__item-text": quietText,

  "ca-steps": "gap-10 text-foreground",
  "ca-steps__header": "gap-3",
  "ca-steps__title": blockTitle,
  "ca-steps__lead": leadText,
  "ca-steps__list": "gap-x-8 gap-y-8",
  "ca-steps__item": "gap-x-4 gap-y-2",
  "ca-steps__number": "mb-2 size-9 rounded-full border border-input font-display text-sm font-semibold tabular-nums",
  "ca-steps__item-title": "text-base font-semibold",
  "ca-steps__item-text": quietText,
  "ca-steps__media": "border-t border-border",

  "ca-cta": "gap-8 rounded-card bg-muted px-6 py-12 text-foreground sm:px-10",
  "ca-cta__content": "gap-3",
  "ca-cta__title": blockTitle,
  "ca-cta__lead": leadText,
  "ca-cta__actions": "gap-3",

  "ca-faq": "gap-x-12 gap-y-8 text-foreground",
  "ca-faq__header": "gap-3",
  "ca-faq__title": blockTitle,
  "ca-faq__lead": leadText,
  "ca-faq__questions": "text-base",

  "ca-footer": "gap-x-8 gap-y-10 border-t border-border py-12 text-sm text-foreground",
  "ca-footer__brand": "gap-2",
  "ca-footer__nav": "gap-x-6 gap-y-2",
  "ca-footer__group": "gap-3",
  "ca-footer__heading": "font-medium text-foreground",
  "ca-footer__links": "gap-x-6 gap-y-2",
  "ca-footer__link": "rounded-sm text-muted-foreground no-underline interact:text-foreground interact:underline",
  "ca-footer__legal": "border-t border-border pt-6 text-xs text-muted-foreground",

  "ca-split": "gap-x-12 gap-y-8 text-foreground",
  "ca-split__content": "gap-4",
  "ca-split__eyebrow": "text-sm font-medium uppercase tracking-wider text-muted-foreground",
  "ca-split__title": blockTitle,
  "ca-split__lead": leadText,
  "ca-split__media": "[&>img]:rounded-card [&>video]:rounded-card",

  "ca-comparison": "gap-10 text-foreground",
  "ca-comparison__header": "gap-3",
  "ca-comparison__title": blockTitle,
  "ca-comparison__lead": leadText,
  "ca-comparison__panels": "gap-4",
  "ca-comparison__panel": "rounded-card border border-border bg-background p-6",
  "ca-comparison__panel-title": "font-display text-lg font-semibold",

  "ca-check-list": "gap-3 text-base",
  "ca-check-list__item": "gap-3",
  "ca-check-list__icon": "mt-0.5 size-5 text-primary",
  "ca-check-list__text": "text-muted-foreground",

  "ca-dialog": [
    "w-lg gap-4 rounded-xl border border-border bg-background p-6 text-foreground shadow-xl backdrop:bg-overlay",
    "motion-safe:transition-[opacity,scale] motion-safe:duration-150 motion-safe:ease-out starting:open:scale-95 starting:open:opacity-0",
  ],
  "ca-dialog__title": "font-display text-lg leading-tight font-semibold text-balance",
  "ca-dialog__description": quietText,
  "ca-dialog__footer": actionRow,

  "ca-dropdown": "align-middle [&>[popovertarget]::before]:motion-safe:transition-[rotate] [&>[popovertarget]::before]:motion-safe:duration-150",
  "ca-dropdown__menu": [
    "gap-0.5 rounded-lg border border-border bg-background p-1 text-foreground shadow-lg",
    "motion-safe:transition-[opacity,translate] motion-safe:duration-100 motion-safe:ease-out starting:ca-open:-translate-y-1 starting:ca-open:opacity-0",
  ],
  "ca-dropdown__item": [
    "gap-2 rounded-md border-0 bg-transparent px-2.5 py-1.5 text-sm text-foreground no-underline",
    "interact:bg-muted disabled:opacity-60 aria-disabled:opacity-60",
  ],
  "ca-dropdown__label": "px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground",
  "ca-dropdown__separator": "mx-0 my-1 h-px bg-border",

  "ca-hero": "gap-10 px-6 py-16 text-foreground",
  "ca-hero__content": "gap-4",
  "ca-hero__eyebrow": "text-sm font-medium text-muted-foreground",
  "ca-hero__title": "font-display text-[clamp(2rem,9cqi,3.5rem)] leading-[1.1] font-semibold tracking-tight text-balance",
  "ca-hero__lead": leadText,
  "ca-hero__actions": "gap-3 pt-2",
  "ca-hero__media": "[&>img]:rounded-card [&>video]:rounded-card",
},
  undefined,
  {
    light: {
      "--ca-surface-page": "oklch(98.5% 0 0)",
      "--ca-surface-card": "oklch(100% 0 0)",
      "--ca-surface-muted": "oklch(96% 0 0)",
      "--ca-surface-inverse": "oklch(15% 0 0)",
      "--ca-text-primary": "oklch(15% 0 0)",
      "--ca-text-secondary": "oklch(44% 0 0)",
      "--ca-text-on-action": "oklch(100% 0 0)",
      "--ca-text-on-secondary": "oklch(15% 0 0)",
      "--ca-text-on-inverse": "oklch(100% 0 0)",
      "--ca-border-default": "oklch(88% 0 0)",
      "--ca-border-strong": "oklch(55% 0 0)",
      "--ca-focus-ring": "oklch(44% 0 0)",
      "--ca-action-primary": "oklch(15% 0 0)",
      "--ca-action-primary-hover": "oklch(27% 0 0)",
      "--ca-action-secondary": "oklch(93% 0 0)",
      "--ca-status-success": "oklch(48% 0.12 155)",
      "--ca-status-warning": "oklch(50% 0.12 65)",
      "--ca-status-error": "oklch(52% 0.2 25)",
      "--ca-status-info": "oklch(48% 0.13 250)",
      "--ca-overlay": "oklch(0% 0 0 / 0.4)",
      "--ca-radius-control": "0.5rem",
      "--ca-radius-card": "0.75rem",
      "--ca-font-sans": 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      "--ca-font-display": 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      "--ca-font-mono": 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
    },
    dark: {
      "--ca-surface-page": "oklch(14.5% 0 0)",
      "--ca-surface-card": "oklch(20% 0 0)",
      "--ca-surface-muted": "oklch(26% 0 0)",
      "--ca-surface-inverse": "oklch(100% 0 0)",
      "--ca-text-primary": "oklch(100% 0 0)",
      "--ca-text-secondary": "oklch(72% 0 0)",
      "--ca-text-on-action": "oklch(15% 0 0)",
      "--ca-text-on-secondary": "oklch(100% 0 0)",
      "--ca-text-on-inverse": "oklch(15% 0 0)",
      "--ca-border-default": "oklch(30% 0 0)",
      "--ca-border-strong": "oklch(60% 0 0)",
      "--ca-focus-ring": "oklch(70% 0 0)",
      "--ca-action-primary": "oklch(100% 0 0)",
      "--ca-action-primary-hover": "oklch(85% 0 0)",
      "--ca-action-secondary": "oklch(30% 0 0)",
      "--ca-status-success": "oklch(74% 0.14 155)",
      "--ca-status-warning": "oklch(80% 0.14 75)",
      "--ca-status-error": "oklch(72% 0.16 25)",
      "--ca-status-info": "oklch(74% 0.12 250)",
      "--ca-overlay": "oklch(0% 0 0 / 0.6)",
    },
  },
);
