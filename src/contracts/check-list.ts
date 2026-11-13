/**
 * Class names of the check-list element: a list of short items each led by an
 * icon — the pros/cons and feature bullets of marketing sections. The icon
 * decides the tone (check, cross, dot); the contract only sets the row.
 */
export const checkList = {
  name: "check-list",
  root: "ca-check-list",
  parts: {
    item: "ca-check-list__item",
    icon: "ca-check-list__icon",
    text: "ca-check-list__text",
  },
} as const;
