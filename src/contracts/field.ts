/** Class names of a form field: wrapper, label, text input, hint and error. */
export const field = {
  name: "field",
  root: "ca-field",
  parts: {
    label: "ca-field__label",
    hint: "ca-field__hint",
    error: "ca-field__error",
  },
} as const;

export const input = {
  name: "input",
  root: "ca-input",
  size: {
    sm: "ca-input--sm",
    md: "ca-input--md",
    lg: "ca-input--lg",
  },
} as const;
