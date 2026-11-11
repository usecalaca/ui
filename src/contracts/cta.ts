/** Class names of the call-to-action block: one message and the action that follows it. */
export const cta = {
  name: "cta",
  root: "ca-cta",
  parts: {
    content: "ca-cta__content",
    title: "ca-cta__title",
    lead: "ca-cta__lead",
    actions: "ca-cta__actions",
  },
  layout: {
    centered: "ca-cta--centered",
    split: "ca-cta--split",
  },
} as const;
