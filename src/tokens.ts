/**
 * The Calaca token contract: every value a skin or brand supplies as a CSS
 * custom property. src/tokens.css maps them onto Tailwind's theme tokens
 * (color, radius, font, typescale, shadow, motion), so components never read
 * a brand value directly. Tokens added after the first contract carry their
 * Tailwind default as a var() fallback in CA_TOKEN_ALIASES, so existing
 * themes keep working without setting them.
 */
export const CALACA_TOKENS = [
  // Surfaces
  "--ca-surface-page",
  "--ca-surface-card",
  "--ca-surface-muted",
  "--ca-surface-inverse",
  // Text
  "--ca-text-primary",
  "--ca-text-secondary",
  "--ca-text-on-action",
  "--ca-text-on-secondary",
  "--ca-text-on-inverse",
  // Borders and focus
  "--ca-border-default",
  "--ca-border-strong",
  "--ca-focus-ring",
  // Actions
  "--ca-action-primary",
  "--ca-action-primary-hover",
  "--ca-action-secondary",
  // Status
  "--ca-status-success",
  "--ca-status-warning",
  "--ca-status-error",
  "--ca-status-info",
  // Overlays such as dialog backdrops
  "--ca-overlay",
  // Shape
  "--ca-radius-control",
  "--ca-radius-card",
  "--ca-radius-shell",
  // Type families
  "--ca-font-sans",
  "--ca-font-display",
  "--ca-font-mono",
  // Typescale: a numeric ramp — a brand shifts the whole ramp, semantic roles
  // stay per component in skins
  "--ca-type-xs",
  "--ca-type-sm",
  "--ca-type-base",
  "--ca-type-lg",
  "--ca-type-xl",
  "--ca-type-2xl",
  "--ca-type-3xl",
  "--ca-type-4xl",
  "--ca-type-5xl",
  "--ca-type-6xl",
  "--ca-type-7xl",
  "--ca-type-8xl",
  "--ca-type-9xl",
  // Font weight
  "--ca-weight-medium",
  "--ca-weight-semibold",
  "--ca-weight-bold",
  "--ca-weight-black",
  // Line height
  "--ca-leading-tight",
  "--ca-leading-snug",
  "--ca-leading-normal",
  "--ca-leading-relaxed",
  "--ca-leading-loose",
  // Letter spacing ("caps" is for uppercase labels)
  "--ca-tracking-tighter",
  "--ca-tracking-tight",
  "--ca-tracking-normal",
  "--ca-tracking-wide",
  "--ca-tracking-wider",
  "--ca-tracking-widest",
  "--ca-tracking-caps",
  // Elevation ("strong" is a color for composing custom shadow values)
  "--ca-shadow",
  "--ca-shadow-2xs",
  "--ca-shadow-xs",
  "--ca-shadow-sm",
  "--ca-shadow-md",
  "--ca-shadow-lg",
  "--ca-shadow-xl",
  "--ca-shadow-2xl",
  "--ca-shadow-strong",
  // Motion
  "--ca-ease",
  "--ca-ease-emphasis",
  "--ca-duration",
  // Density: scales every spacing utility through --spacing
  "--ca-density",
] as const;

export type CalacaToken = (typeof CALACA_TOKENS)[number];

/**
 * Aliases mapping the contract onto Tailwind's theme tokens. tokens.css
 * declares them on :root, where each var() resolves once and inherits. A skin
 * region redeclares them so the var() resolves against the region's own
 * --ca-* values instead of the page's; skin.ts asserts they stay in sync.
 */
export const CA_TOKEN_ALIASES: Record<string, string> = {
  "--font-sans": "var(--ca-font-sans)",
  "--font-display": "var(--ca-font-display)",
  "--font-mono": "var(--ca-font-mono)",
  "--color-background": "var(--ca-surface-card)",
  "--color-foreground": "var(--ca-text-primary)",
  "--color-primary": "var(--ca-action-primary)",
  "--color-primary-hover": "var(--ca-action-primary-hover)",
  "--color-primary-foreground": "var(--ca-text-on-action)",
  "--color-secondary": "var(--ca-action-secondary)",
  "--color-secondary-foreground": "var(--ca-text-on-secondary)",
  "--color-muted": "var(--ca-surface-muted)",
  "--color-muted-foreground": "var(--ca-text-secondary)",
  "--color-surface-page": "var(--ca-surface-page)",
  "--color-surface-inverse": "var(--ca-surface-inverse)",
  "--color-on-inverse": "var(--ca-text-on-inverse)",
  "--color-border": "var(--ca-border-default)",
  "--color-input": "var(--ca-border-strong)",
  "--color-ring": "var(--ca-focus-ring)",
  "--color-overlay": "var(--ca-overlay)",
  "--color-destructive": "var(--ca-status-error)",
  "--color-success": "var(--ca-status-success)",
  "--color-warning": "var(--ca-status-warning)",
  "--color-info": "var(--ca-status-info)",
  "--radius-sm": "calc(var(--ca-radius-control) - 4px)",
  "--radius-md": "calc(var(--ca-radius-control) - 2px)",
  "--radius-lg": "var(--ca-radius-control)",
  "--radius-xl": "calc(var(--ca-radius-control) + 4px)",
  "--radius-card": "var(--ca-radius-card)",
  "--radius-shell": "var(--ca-radius-shell, 1rem)",
  // Typescale and type rhythm — fallbacks are Tailwind's own defaults
  "--text-xs": "var(--ca-type-xs, 0.75rem)",
  "--text-sm": "var(--ca-type-sm, 0.875rem)",
  "--text-base": "var(--ca-type-base, 1rem)",
  "--text-lg": "var(--ca-type-lg, 1.125rem)",
  "--text-xl": "var(--ca-type-xl, 1.25rem)",
  "--text-2xl": "var(--ca-type-2xl, 1.5rem)",
  "--text-3xl": "var(--ca-type-3xl, 1.875rem)",
  "--text-4xl": "var(--ca-type-4xl, 2.25rem)",
  "--text-5xl": "var(--ca-type-5xl, 3rem)",
  "--text-6xl": "var(--ca-type-6xl, 3.75rem)",
  "--text-7xl": "var(--ca-type-7xl, 4.5rem)",
  "--text-8xl": "var(--ca-type-8xl, 6rem)",
  "--text-9xl": "var(--ca-type-9xl, 8rem)",
  "--font-weight-medium": "var(--ca-weight-medium, 500)",
  "--font-weight-semibold": "var(--ca-weight-semibold, 600)",
  "--font-weight-bold": "var(--ca-weight-bold, 700)",
  "--font-weight-black": "var(--ca-weight-black, 900)",
  "--leading-tight": "var(--ca-leading-tight, 1.25)",
  "--leading-snug": "var(--ca-leading-snug, 1.375)",
  "--leading-normal": "var(--ca-leading-normal, 1.5)",
  "--leading-relaxed": "var(--ca-leading-relaxed, 1.625)",
  "--leading-loose": "var(--ca-leading-loose, 2)",
  "--tracking-tighter": "var(--ca-tracking-tighter, -0.05em)",
  "--tracking-tight": "var(--ca-tracking-tight, -0.025em)",
  "--tracking-normal": "var(--ca-tracking-normal, 0em)",
  "--tracking-wide": "var(--ca-tracking-wide, 0.025em)",
  "--tracking-wider": "var(--ca-tracking-wider, 0.05em)",
  "--tracking-widest": "var(--ca-tracking-widest, 0.1em)",
  "--tracking-caps": "var(--ca-tracking-caps, 0.1em)",
  // Elevation — a flat brand sets every step to none, a glowing brand
  // composes its own spec around --ca-shadow-strong
  "--shadow": "var(--ca-shadow, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))",
  "--shadow-2xs": "var(--ca-shadow-2xs, 0 1px rgb(0 0 0 / 0.05))",
  "--shadow-xs": "var(--ca-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05))",
  "--shadow-sm": "var(--ca-shadow-sm, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))",
  "--shadow-md": "var(--ca-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))",
  "--shadow-lg": "var(--ca-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))",
  "--shadow-xl": "var(--ca-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1))",
  "--shadow-2xl": "var(--ca-shadow-2xl, 0 25px 50px -12px rgb(0 0 0 / 0.25))",
  // Motion — ease-out and the transition default redirect to the brand
  "--ease-out": "var(--ca-ease, cubic-bezier(0, 0, 0.2, 1))",
  "--ease-emphasis": "var(--ca-ease-emphasis, cubic-bezier(0.16, 1, 0.3, 1))",
  "--default-transition-duration": "var(--ca-duration, 150ms)",
  // Density — one factor rescales every spacing utility; the core's minimum
  // hit areas are absolute, so the WCAG floor survives a compact brand
  "--spacing": "calc(0.25rem * var(--ca-density, 1))",
};
