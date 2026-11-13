/**
 * Class names of the comparison block: a heading and panels set against each
 * other — "before vs after", "us vs them". Panels compose from elements such
 * as ca-check-list; the highlighted side is a host decision.
 */
export const comparison = {
  name: "comparison",
  root: "ca-comparison",
  parts: {
    header: "ca-comparison__header",
    title: "ca-comparison__title",
    lead: "ca-comparison__lead",
    panels: "ca-comparison__panels",
    panel: "ca-comparison__panel",
    panelTitle: "ca-comparison__panel-title",
  },
} as const;
