/** Class names of tabs: a tab list and one panel per tab (WAI-ARIA tabs pattern). */
export const tabs = {
  name: "tabs",
  root: "ca-tabs",
  parts: {
    list: "ca-tabs__list",
    tab: "ca-tabs__tab",
    panel: "ca-tabs__panel",
  },
} as const;
