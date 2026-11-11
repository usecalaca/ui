/** Class names of the FAQ block: a heading with common questions, answered in an accordion. */
export const faq = {
  name: "faq",
  root: "ca-faq",
  parts: {
    header: "ca-faq__header",
    title: "ca-faq__title",
    lead: "ca-faq__lead",
    questions: "ca-faq__questions",
  },
  layout: {
    stacked: "ca-faq--stacked",
    split: "ca-faq--split",
  },
} as const;
