/** Class names of the button element, written in full so Tailwind's scanner finds them. */
export const button = {
  name: "button",
  root: "ca-button",
  variant: {
    primary: "ca-button--primary",
    secondary: "ca-button--secondary",
    outline: "ca-button--outline",
    ghost: "ca-button--ghost",
    danger: "ca-button--danger",
  },
  size: {
    xs: "ca-button--xs",
    sm: "ca-button--sm",
    md: "ca-button--md",
    lg: "ca-button--lg",
    xl: "ca-button--xl",
    icon: "ca-button--icon",
  },
} as const;
