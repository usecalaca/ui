/** Class names of the steps block: a numbered process, such as how to get started. */
export const steps = {
  name: "steps",
  root: "ca-steps",
  parts: {
    header: "ca-steps__header",
    title: "ca-steps__title",
    lead: "ca-steps__lead",
    list: "ca-steps__list",
    item: "ca-steps__item",
    number: "ca-steps__number",
    itemTitle: "ca-steps__item-title",
    itemText: "ca-steps__item-text",
  },
  layout: {
    row: "ca-steps--row",
    column: "ca-steps--column",
  },
} as const;
