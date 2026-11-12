import { defineSkin } from "../src/skin.ts";
import { base } from "./base.ts";

/**
 * Bloque skin for the spec 035 pilot: deliberately far from the base skin
 * (square, heavy, offset shadows, larger targets) to show that a skin changes
 * shape, density, type and motion, not only color. Lists only what differs.
 */
export const bloque = defineSkin(
  "bloque",
  {
    "ca-button": [
      "gap-3 rounded-none border-2 font-bold uppercase tracking-wide",
      "shadow-[4px_4px_0_0_var(--color-foreground)] active:translate-x-0.5 active:translate-y-0.5 active:scale-100 active:shadow-[2px_2px_0_0_var(--color-foreground)]",
      "motion-safe:transition-[translate,box-shadow,background-color] motion-safe:duration-75 motion-safe:ease-linear",
    ],
    "ca-button--primary":
      "[--ca-pigment:var(--color-surface-inverse)] [--ca-pigment-ink:var(--color-on-inverse)] [--ca-pigment-edge:var(--color-foreground)] [--ca-pigment-edge-hover:var(--color-foreground)] [--ca-pigment-hover:color-mix(in_oklab,var(--color-surface-inverse)_90%,transparent)]",
    "ca-button--secondary": "[--ca-pigment-edge:var(--color-foreground)] [--ca-pigment-edge-hover:var(--color-foreground)]",
    "ca-button--outline": "[--ca-pigment-edge:var(--color-foreground)] [--ca-pigment-edge-hover:var(--color-foreground)]",
    "ca-button--sm": "h-10 px-4 text-xs",
    "ca-button--md": "h-12 px-6 text-sm",
    "ca-button--lg": "h-14 px-8 text-base",

    "ca-card": "gap-6 rounded-none border-2 border-foreground p-8 shadow-[6px_6px_0_0_var(--color-foreground)]",
    "ca-card__title": "text-xl font-bold tracking-wide uppercase",
    "ca-card__footer": "gap-4 pt-4",

    "ca-field": "gap-2",
    "ca-field__label": "text-xs font-bold tracking-wide uppercase",
    "ca-input": "rounded-none border-2 border-foreground",
    "ca-input--sm": "h-10 px-3",
    "ca-input--md": "h-12 px-4",
    "ca-input--lg": "h-14 px-5",

    "ca-select": [
      "rounded-none border-2 border-foreground",
      "supports-[appearance:base-select]:[&::picker(select)]:rounded-none supports-[appearance:base-select]:[&::picker(select)]:border-2 supports-[appearance:base-select]:[&::picker(select)]:border-foreground supports-[appearance:base-select]:[&::picker(select)]:p-0 supports-[appearance:base-select]:[&::picker(select)]:shadow-[4px_4px_0_0_var(--color-foreground)]",
      "supports-[appearance:base-select]:[&_option]:rounded-none supports-[appearance:base-select]:[&_option]:px-4 supports-[appearance:base-select]:[&_option]:py-2.5 supports-[appearance:base-select]:[&_option:checked]:bg-surface-inverse supports-[appearance:base-select]:[&_option:checked]:text-on-inverse",
    ],
    "ca-select--sm": "h-10 ps-3",
    "ca-select--md": "h-12 ps-4",
    "ca-select--lg": "h-14 ps-5",
    "ca-combobox__listbox": "rounded-none border-2 border-foreground p-0 shadow-[4px_4px_0_0_var(--color-foreground)]",
    "ca-combobox__option": "rounded-none px-4 py-2.5 aria-selected:bg-surface-inverse aria-selected:text-on-inverse",
    "ca-checkbox": "gap-3 text-base",
    "ca-checkbox__input": "size-5",
    "ca-radio": "gap-3 text-base",
    "ca-radio__input": "size-5",
    "ca-switch": "gap-3 text-base",
    "ca-switch__input": [
      "rounded-none border-2 border-foreground",
      // Square thumb: a solid block in the box the base skin sizes for the circle.
      "bg-[linear-gradient(var(--color-background),var(--color-background))]",
      "checked:bg-[linear-gradient(var(--color-primary-foreground),var(--color-primary-foreground))]",
    ],

    "ca-badge": "rounded-none border-2 px-2.5 py-1 font-bold tracking-wide uppercase",

    // Bloque keeps its label square and loud: a heavy inverse chip, not a pill.
    "ca-eyebrow": "gap-3 text-xs font-bold tracking-widest",
    "ca-eyebrow__number": "rounded-none border-2 border-foreground bg-surface-inverse px-2 py-0.5 font-bold text-on-inverse",

    "ca-alert": "gap-2 rounded-none border-2 p-5",
    "ca-alert__title": "tracking-wide uppercase",
    "ca-alert__actions": "gap-4 pt-3",
    "ca-accordion": "divide-y-2 divide-foreground border-2 border-foreground",
    "ca-accordion__trigger": "px-5 py-5 text-sm font-bold tracking-wide uppercase",
    "ca-accordion__content": "px-5 pb-5",

    "ca-tabs": "gap-6",
    "ca-tabs__list": "gap-0 rounded-none border-2 border-foreground bg-transparent p-0",
    "ca-tabs__tab": "rounded-none px-5 py-3 text-xs font-bold tracking-wide uppercase aria-selected:bg-surface-inverse aria-selected:text-on-inverse aria-selected:shadow-none motion-safe:duration-75",
    "ca-tabs__panel": "rounded-none text-base",

    "ca-breadcrumb": "text-xs font-bold tracking-wide uppercase",
    "ca-pagination__link": "rounded-none border-2 font-bold aria-[current=page]:border-foreground aria-[current=page]:bg-surface-inverse aria-[current=page]:text-on-inverse",
    "ca-avatar": "rounded-none border-2 border-foreground font-bold",
    "ca-progress": "h-4 rounded-none border-2 border-foreground [&::-webkit-progress-value]:rounded-none [&::-moz-progress-bar]:rounded-none",
    "ca-table": "rounded-none border-2 border-foreground [:where(&)_th]:bg-transparent [:where(&)_th]:font-bold [:where(&)_th]:tracking-wide [:where(&)_th]:uppercase [:where(&)_th]:text-xs [:where(&)_th]:text-foreground [:where(&)_td]:border-t-2 [:where(&)_td]:border-foreground",

    "ca-skeleton": "motion-safe:animate-none",
    "ca-skeleton--text": "rounded-none",
    "ca-skeleton--block": "rounded-none",
    "ca-empty-state": "gap-4 rounded-none border-2 border-foreground px-8 py-12",
    "ca-empty-state__media": "rounded-none border-2 border-foreground",
    "ca-empty-state__title": "font-bold tracking-wide uppercase",
    "ca-empty-state__actions": "gap-4 pt-4",

    "ca-tooltip__content": "rounded-none px-3 py-2 font-bold tracking-wide uppercase",
    "ca-popover__panel": "gap-4 rounded-none border-2 border-foreground p-5 shadow-[4px_4px_0_0_var(--color-foreground)] motion-safe:duration-75 motion-safe:ease-linear",

    "ca-navbar": "border-b-2 border-foreground px-6 py-3",
    "ca-navbar__brand": "font-bold tracking-wide uppercase",
    "ca-navbar__menu": "rounded-none border-2 border-foreground p-0 shadow-[4px_4px_0_0_var(--color-foreground)] ca-navbar-wide:border-0 ca-navbar-wide:shadow-none",
    "ca-navbar__link": "rounded-none text-xs font-bold tracking-wide uppercase aria-[current=page]:bg-surface-inverse aria-[current=page]:text-on-inverse",
    "ca-navbar__toggle": "size-10 rounded-none border-2 border-foreground",
    "ca-sidebar__heading": "font-bold tracking-wide uppercase",
    "ca-sidebar__subheading": "text-[0.65rem] font-bold tracking-[0.15em] uppercase",
    "ca-sidebar__link": "rounded-none font-bold aria-[current=page]:bg-surface-inverse aria-[current=page]:text-on-inverse",

    "ca-stat__label": "text-xs font-bold tracking-wide uppercase",
    "ca-stat__value": "font-bold",
    "ca-timeline__item": "border-s-2 border-foreground last:border-transparent [&::before]:-start-[0.4375rem] [&::before]:rounded-none [&::before]:size-3 [&::before]:bg-foreground",
    "ca-timeline__time": "font-bold tracking-wide uppercase",
    "ca-file-upload": "file:h-12 file:rounded-none file:border-2 file:border-foreground file:px-5 file:font-bold file:tracking-wide file:uppercase file:text-xs",

    "ca-toast": "gap-4 rounded-none border-2 py-4 ps-5 shadow-[4px_4px_0_0_var(--color-foreground)] motion-safe:duration-75 motion-safe:ease-linear",
    "ca-toast__message": "font-bold",
    "ca-toast__close": "rounded-none border-2 border-foreground",

    "ca-sheet": "gap-6 border-foreground p-8 [&:not(.ca-sheet--bottom)]:border-s-2 [&.ca-sheet--start]:border-e-2 [&.ca-sheet--bottom]:rounded-none [&.ca-sheet--bottom]:border-t-2 shadow-none motion-safe:duration-75 motion-safe:ease-linear",
    "ca-sheet__title": "text-xl font-bold tracking-wide uppercase",
    "ca-sheet__footer": "gap-4 border-t-2 border-foreground",
    "ca-separator": "bg-foreground",
    "ca-separator--horizontal": "h-0.5",
    "ca-separator--vertical": "w-0.5",
    "ca-spinner": "rounded-none border-foreground",

    "ca-stack--md": "[--ca-stack-gap:1.5rem]",
    "ca-stack--lg": "[--ca-stack-gap:3rem]",
    "ca-section--lg": "[--ca-section-space:8rem]",
    "ca-heading": "font-bold tracking-wide uppercase",
    "ca-prose": "[:where(&)_:is(h2,h3,h4)]:font-bold [:where(&)_:is(h2,h3,h4)]:tracking-wide [:where(&)_:is(h2,h3,h4)]:uppercase [:where(&)_blockquote]:border-foreground",
    "ca-link": "font-bold decoration-[3px] interact:decoration-[5px]",
    "ca-code": "rounded-none",
    "ca-code-block": "rounded-none border-2 border-foreground",
    "ca-code-block__header": "border-b-2 border-foreground",
    "ca-code-block__title": "font-bold tracking-wide uppercase",

    "ca-features__title": "font-bold tracking-wide uppercase",
    "ca-features__icon": "rounded-none border-2 border-foreground",
    "ca-features__item-title": "font-bold",
    "ca-steps__title": "font-bold tracking-wide uppercase",
    "ca-steps__number": "rounded-none border-2 border-foreground bg-surface-inverse text-on-inverse",
    "ca-steps__item-title": "font-bold",
    "ca-cta": "rounded-none border-2 border-foreground bg-transparent shadow-[8px_8px_0_0_var(--color-foreground)]",
    "ca-cta__title": "font-bold tracking-wide uppercase",
    "ca-faq__title": "font-bold tracking-wide uppercase",
    "ca-footer": "border-t-2 border-foreground",
    "ca-footer__heading": "text-xs font-bold tracking-wide uppercase",
    "ca-footer__legal": "border-t-2 border-foreground",

    "ca-stepper__marker": "rounded-none font-bold",
    "ca-stepper__label": "font-bold tracking-wide uppercase text-xs",
    "ca-editor": "rounded-none border-2 border-foreground",
    "ca-editor__toolbar": "border-b-2 border-foreground",
    "ca-editor__tool": "rounded-none aria-pressed:bg-surface-inverse aria-pressed:text-on-inverse",
    "ca-editor__link": "rounded-none border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]",

    "ca-kbd": "rounded-none border-2 border-b-4 border-foreground font-bold",

    "ca-dialog": [
      "gap-6 rounded-none border-2 border-foreground p-8 shadow-[8px_8px_0_0_var(--color-foreground)]",
      "motion-safe:duration-75 motion-safe:ease-linear starting:open:scale-100 starting:open:translate-y-2",
    ],
    "ca-dialog__title": "text-xl font-bold tracking-wide uppercase",
    "ca-dialog__footer": "gap-4 pt-4",

    "ca-dropdown__menu": "gap-0 rounded-none border-2 border-foreground p-0 shadow-[4px_4px_0_0_var(--color-foreground)] motion-safe:duration-75 motion-safe:ease-linear",
    "ca-dropdown__item": "rounded-none px-4 py-2.5 text-xs font-bold tracking-wide uppercase",
    "ca-dropdown__label": "px-4 pt-3 font-bold tracking-wide uppercase",
    "ca-dropdown__separator": "my-0 h-0.5 bg-foreground",

    "ca-hero": "gap-12 py-20",
    "ca-hero__content": "gap-6",
    "ca-hero__eyebrow": "text-xs font-bold tracking-widest uppercase",
    "ca-hero__title": "font-bold tracking-wide uppercase",
    "ca-hero__actions": "gap-4 pt-4",
    "ca-hero__media": "[&>img]:rounded-none [&>video]:rounded-none",
  },
  base,
);
