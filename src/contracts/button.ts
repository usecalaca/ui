/** Class names of the button element, written in full so Tailwind's scanner finds them. */
export const button = {
  name: "button",
  root: "ca-button",
  variant: {
    primary: "ca-button--primary",
    secondary: "ca-button--secondary",
    outline: "ca-button--outline",
    ghost: "ca-button--ghost",
  },
  size: {
    sm: "ca-button--sm",
    md: "ca-button--md",
    lg: "ca-button--lg",
  },
} as const;
