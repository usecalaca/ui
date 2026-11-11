import { defineSkin } from "../src/skin.ts";
import { base } from "./base.ts";

/**
 * Calaca: the signature skin of Calaca UI, from the Calaca UI brand book v1.0
 * (November 2026). Hueso (bone) paper and tinta (ink) carry the brand,
 * cempasúchil (marigold) is the accent, rosa and jade support it sparingly.
 * Friendly and chunky: rounded shapes, 2px ink edges, hard offset shadows,
 * Nunito Black headings and a dashed focus ring.
 *
 * Accessibility adjustments to the book: the focus ring is ink in light mode
 * (marigold on paper is 2.3:1, below the 3:1 a focus indicator needs), and
 * status text uses darker jade and rosa so it reaches 4.5:1. Brand colors keep
 * their exact values wherever they fill a surface.
 */
const ink = "oklch(23.38% 0.0383 294.75)";
const bone = "oklch(95.41% 0.0188 83.06)";
const paper = "oklch(97.73% 0.0102 81.8)";
const marigold = "oklch(73.49% 0.1613 58.77)";

export const calaca = defineSkin(
  "calaca",
  {
    "ca-button": [
      "rounded-xl border-2 font-extrabold",
      // The shadow is a pigment too, so a modifier can switch it off without touching box-shadow itself.
      "shadow-[3px_3px_0_0_var(--ca-pigment-shadow,var(--color-foreground))] active:translate-x-0.5 active:translate-y-0.5 active:scale-100 active:shadow-none",
      "motion-safe:transition-[background-color,translate,box-shadow] focus-visible:[--tw-outline-style:dashed]",
    ],
    "ca-button--primary": "[--ca-pigment-edge:var(--color-foreground)] [--ca-pigment-edge-hover:var(--color-foreground)]",
    "ca-button--secondary": "[--ca-pigment-edge:var(--color-foreground)] [--ca-pigment-edge-hover:var(--color-foreground)]",
    "ca-button--ghost": "[--ca-pigment-shadow:transparent]",
    "ca-button--sm": "h-8 px-3 text-sm",
    "ca-button--md": "h-10 px-5 text-base",
    "ca-button--lg": "h-12 px-6 text-lg",

    "ca-card": "border-2 border-input shadow-[6px_6px_0_0_var(--color-foreground)]",
    "ca-card__title": "text-xl font-black tracking-[-0.02em]",

    "ca-field__label": "font-bold",
    "ca-input": "rounded-xl border-2 focus-visible:[--tw-outline-style:dashed]",

    "ca-select": [
      "rounded-xl border-2 focus-visible:[--tw-outline-style:dashed]",
      "supports-[appearance:base-select]:[&::picker(select)]:rounded-xl supports-[appearance:base-select]:[&::picker(select)]:border-2 supports-[appearance:base-select]:[&::picker(select)]:border-input supports-[appearance:base-select]:[&::picker(select)]:p-1.5 supports-[appearance:base-select]:[&::picker(select)]:shadow-[4px_4px_0_0_var(--color-foreground)]",
      "supports-[appearance:base-select]:[&_option]:rounded-lg supports-[appearance:base-select]:[&_option]:font-semibold supports-[appearance:base-select]:[&_option:checked]:bg-primary supports-[appearance:base-select]:[&_option:checked]:text-primary-foreground",
    ],
    "ca-combobox__listbox": "rounded-xl border-2 border-input p-1.5 shadow-[4px_4px_0_0_var(--color-foreground)]",
    "ca-combobox__option": "rounded-lg font-semibold",
    "ca-checkbox": "font-semibold",
    "ca-checkbox__input": "size-5",
    "ca-radio": "font-semibold",
    "ca-radio__input": "size-5",
    "ca-switch": "font-semibold",
    "ca-switch__input": "h-6 w-11 border-2 border-input bg-size-[1.125rem_1.125rem] [background-position:0.0625rem_50%] checked:[background-position:calc(100%-0.0625rem)_50%] rtl:[background-position:calc(100%-0.0625rem)_50%] rtl:checked:[background-position:0.0625rem_50%] focus-visible:[--tw-outline-style:dashed]",

    "ca-badge": "border-[1.5px] font-mono text-[0.7rem] font-semibold tracking-[0.08em] uppercase",

    // The eyebrow from the brand book: a mono label and a marigold number pill with a 1.5px ink edge.
    "ca-eyebrow": "font-mono text-[0.7rem] font-semibold tracking-[0.12em]",
    "ca-eyebrow__number": "border-[1.5px] border-foreground bg-primary px-[0.45rem] py-0 font-bold text-primary-foreground",

    "ca-alert": "rounded-xl border-2",
    "ca-alert__title": "font-extrabold",
    "ca-accordion": "divide-y-2 divide-border rounded-card border-2 border-input shadow-[4px_4px_0_0_var(--color-foreground)]",
    "ca-accordion__trigger": "px-5 font-extrabold focus-visible:[--tw-outline-style:dashed]",
    "ca-accordion__content": "px-5",

    "ca-tabs__list": "rounded-xl border-2 border-input p-1",
    "ca-tabs__tab": "rounded-lg font-bold aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-none focus-visible:[--tw-outline-style:dashed]",

    "ca-breadcrumb__link": "font-semibold",
    "ca-pagination__link": "rounded-xl border-2 font-bold aria-[current=page]:border-input aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground focus-visible:[--tw-outline-style:dashed]",
    "ca-avatar": "border-2 border-input font-extrabold",
    "ca-progress": "h-3 border-2 border-input",
    "ca-table": "rounded-card border-2 border-input [:where(&)_th]:font-mono [:where(&)_th]:text-[0.7rem] [:where(&)_th]:font-semibold [:where(&)_th]:tracking-[0.12em] [:where(&)_th]:uppercase",

    "ca-skeleton--block": "rounded-card",
    "ca-empty-state": "border-2 border-dashed border-input",
    "ca-empty-state__media": "border-2 border-input bg-primary text-primary-foreground",
    "ca-empty-state__title": "text-xl font-black tracking-[-0.02em]",

    "ca-tooltip__content": "rounded-lg font-bold",
    "ca-popover__panel": "rounded-xl border-2 border-input shadow-[4px_4px_0_0_var(--color-foreground)]",

    "ca-navbar": "border-b-2 border-input",
    "ca-navbar__brand": "text-xl font-black tracking-[-0.04em]",
    "ca-navbar__menu": "rounded-xl border-2 border-input shadow-[4px_4px_0_0_var(--color-foreground)] ca-navbar-wide:border-0 ca-navbar-wide:shadow-none",
    "ca-navbar__link": "rounded-full border-[1.5px] border-transparent font-bold interact:border-input interact:bg-transparent aria-[current=page]:border-input aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground",
    "ca-navbar__toggle": "rounded-xl border-2 border-input",
    "ca-sidebar__heading": "border-b-2 border-input pb-2 font-mono text-[0.7rem] font-bold tracking-[0.12em] uppercase",
    "ca-sidebar__subheading": "flex items-center gap-1.5 font-mono text-[0.7rem] font-bold tracking-[0.12em] uppercase text-foreground before:size-1.5 before:shrink-0 before:rounded-full before:bg-primary before:content-['']",
    "ca-sidebar__link": "aria-[current=page]:font-extrabold",

    "ca-stat__label": "font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase",
    "ca-stat__value": "text-4xl font-black tracking-[-0.03em]",
    "ca-timeline__item": "border-s-2 [&::before]:-start-[0.375rem] [&::before]:border-input",
    "ca-timeline__title": "font-extrabold",
    "ca-file-upload": "file:h-10 file:rounded-xl file:border-2 file:font-bold",

    "ca-toast": "rounded-xl border-2 shadow-[4px_4px_0_0_var(--color-foreground)]",
    "ca-toast__message": "font-bold",
    "ca-toast__close": "rounded-lg focus-visible:[--tw-outline-style:dashed]",

    "ca-sheet": "border-input [&:not(.ca-sheet--bottom)]:border-s-2 [&.ca-sheet--start]:border-e-2 [&.ca-sheet--bottom]:rounded-t-[1.25rem] [&.ca-sheet--bottom]:border-t-2",
    "ca-sheet__title": "text-xl font-black tracking-[-0.02em]",
    "ca-sheet__footer": "border-t-2",
    "ca-spinner": "text-primary",
    "ca-spinner--md": "border-[3px]",

    "ca-heading": "font-black tracking-[-0.03em]",
    "ca-prose": "[:where(&)_:is(h2,h3,h4)]:font-black [:where(&)_:is(h2,h3,h4)]:tracking-[-0.02em] [:where(&)_a]:decoration-primary [:where(&)_a]:decoration-2",
    "ca-link": "focus-visible:[--tw-outline-style:dashed]",
    "ca-code-block": "rounded-xl border-2 border-input",
    "ca-code-block__header": "border-b-2 border-input",

    "ca-features__title": "font-black tracking-[-0.03em]",
    "ca-features__icon": "border-2 border-input bg-primary text-primary-foreground",
    "ca-features__item-title": "font-extrabold",
    "ca-steps__title": "font-black tracking-[-0.03em]",
    "ca-steps__number": "border-2 bg-primary font-black text-primary-foreground",
    "ca-steps__item-title": "font-extrabold",
    "ca-cta": "border-2 border-input shadow-[6px_6px_0_0_var(--color-foreground)]",
    "ca-cta__title": "font-black tracking-[-0.03em]",
    "ca-faq__title": "font-black tracking-[-0.03em]",
    "ca-footer": "border-t-2 border-input",
    "ca-footer__heading": "font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase",
    "ca-footer__link": "font-semibold",

    "ca-stepper__marker": "font-black [[data-status=current]>&]:border-input [[data-status=current]>&]:bg-primary [[data-status=current]>&]:text-primary-foreground [[data-status=complete]>&]:border-input [[data-status=complete]>&]:bg-secondary [[data-status=complete]>&]:text-secondary-foreground",
    "ca-stepper__label": "font-bold",
    "ca-editor": "rounded-xl border-2 focus-within:border-input",
    "ca-editor__toolbar": "border-b-2 border-input",
    "ca-editor__tool": "rounded-lg aria-pressed:bg-primary aria-pressed:text-primary-foreground",
    "ca-editor__link": "rounded-xl border-2 border-input shadow-[4px_4px_0_0_var(--color-foreground)]",

    "ca-kbd": "rounded-lg border-[1.5px] border-b-[3px] border-input font-semibold",

    "ca-dialog": "border-2 border-input shadow-[8px_8px_0_0_var(--color-foreground)]",
    "ca-dialog__title": "text-xl font-black tracking-[-0.02em]",

    "ca-dropdown__menu": "rounded-xl border-2 border-input p-1.5 shadow-[4px_4px_0_0_var(--color-foreground)]",
    "ca-dropdown__item": "rounded-lg font-bold",
    "ca-dropdown__label": "font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase",

    "ca-hero__eyebrow": "font-mono text-xs font-semibold tracking-[0.12em] uppercase",
    "ca-hero__title": "font-black tracking-[-0.03em]",
  },
  base,
  {
    light: {
      "--ca-surface-page": paper,
      "--ca-surface-card": "oklch(100% 0 0)",
      "--ca-surface-muted": bone,
      "--ca-surface-inverse": ink,
      "--ca-text-primary": ink,
      "--ca-text-secondary": "oklch(44.78% 0.0256 76.23)",
      "--ca-text-on-action": ink,
      "--ca-text-on-secondary": bone,
      "--ca-text-on-inverse": bone,
      "--ca-border-default": "oklch(90.07% 0.0265 82.38)",
      "--ca-border-strong": ink,
      "--ca-focus-ring": ink,
      "--ca-action-primary": marigold,
      "--ca-action-primary-hover": "oklch(77.61% 0.1392 61.77)",
      "--ca-action-secondary": ink,
      "--ca-status-success": "oklch(50.7% 0.086 182.13)",
      "--ca-status-warning": "oklch(53.16% 0.1282 54.75)",
      "--ca-status-error": "oklch(53.13% 0.2015 5.62)",
      "--ca-status-info": "oklch(35.83% 0.1048 286.38)",
      "--ca-overlay": "oklch(23.38% 0.0383 294.75 / 0.55)",
      "--ca-radius-control": "0.75rem",
      "--ca-radius-card": "1.25rem",
      "--ca-font-sans": '"Nunito", ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
      "--ca-font-display": '"Nunito", ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
      "--ca-font-mono": '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
    },
    dark: {
      "--ca-surface-page": ink,
      "--ca-surface-card": "oklch(28.11% 0.051 292.66)",
      "--ca-surface-muted": "oklch(32.34% 0.0546 293.48)",
      "--ca-surface-inverse": bone,
      "--ca-text-primary": bone,
      "--ca-text-secondary": "oklch(82.44% 0.0275 80.23)",
      "--ca-text-on-action": ink,
      "--ca-text-on-secondary": ink,
      "--ca-text-on-inverse": ink,
      "--ca-border-default": "oklch(40.4% 0.0634 293.01)",
      "--ca-border-strong": bone,
      "--ca-focus-ring": marigold,
      "--ca-action-primary": marigold,
      "--ca-action-primary-hover": "oklch(77.61% 0.1392 61.77)",
      "--ca-action-secondary": bone,
      "--ca-status-success": "oklch(73.31% 0.115 182.72)",
      "--ca-status-warning": marigold,
      "--ca-status-error": "oklch(72.49% 0.1506 359.52)",
      "--ca-status-info": "oklch(76.57% 0.0897 291.41)",
      "--ca-overlay": "oklch(0% 0 0 / 0.63)",
    },
  },
);
