/** Class names of the features block: a set of features, each with an optional icon, a title and a line of text. */
export const features = {
  name: "features",
  root: "ca-features",
  parts: {
    header: "ca-features__header",
    title: "ca-features__title",
    lead: "ca-features__lead",
    list: "ca-features__list",
    item: "ca-features__item",
    icon: "ca-features__icon",
    itemTitle: "ca-features__item-title",
    itemText: "ca-features__item-text",
  },
  layout: {
    grid: "ca-features--grid",
    list: "ca-features--list",
  },
} as const;
