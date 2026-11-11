/**
 * Checkbox, radio and switch: a <label> around a native <input> and its text.
 * The label is the root, so the whole row is the click and touch target.
 */
export const checkbox = {
  name: "checkbox",
  root: "ca-checkbox",
  parts: { input: "ca-checkbox__input" },
} as const;

export const radio = {
  name: "radio",
  root: "ca-radio",
  parts: { input: "ca-radio__input" },
} as const;

/** A checkbox with role="switch", for settings that apply at once. */
export const toggle = {
  name: "switch",
  root: "ca-switch",
  parts: { input: "ca-switch__input" },
} as const;
