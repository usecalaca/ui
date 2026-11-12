/**
 * Class names of the hero block: the opening section of a page. One structure
 * (content beside or above optional media) and three layouts for genuinely
 * different arrangements (spec 035 decision 18).
 */
export const hero = {
  name: "hero",
  root: "ca-hero",
  parts: {
    content: "ca-hero__content",
    eyebrow: "ca-hero__eyebrow",
    title: "ca-hero__title",
    lead: "ca-hero__lead",
    actions: "ca-hero__actions",
    media: "ca-hero__media",
  },
  layout: {
    centered: "ca-hero--centered",
    split: "ca-hero--split",
    stacked: "ca-hero--stacked",
  },
} as const;
