/**
 * Class names of the dropdown: a button that opens a popover with actions or
 * links. Native popover behavior (disclosure pattern), not an ARIA menu.
 */
export const dropdown = {
  name: "dropdown",
  root: "ca-dropdown",
  parts: {
    menu: "ca-dropdown__menu",
    item: "ca-dropdown__item",
    label: "ca-dropdown__label",
    separator: "ca-dropdown__separator",
  },
} as const;
