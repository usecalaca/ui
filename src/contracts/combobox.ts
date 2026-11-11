/**
 * Class names of the combobox: a text input (`role="combobox"`) with a list of
 * options that filters as people type (WAI-ARIA combobox pattern).
 */
export const combobox = {
  name: "combobox",
  root: "ca-combobox",
  parts: {
    listbox: "ca-combobox__listbox",
    option: "ca-combobox__option",
  },
} as const;
