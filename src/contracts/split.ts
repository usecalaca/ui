/**
 * Class names of the split block: content beside media — the recurring
 * "story next to a screenshot" section. Layouts pick the media side (spec 035
 * decision 18).
 */
export const split = {
  name: "split",
  root: "ca-split",
  parts: {
    content: "ca-split__content",
    eyebrow: "ca-split__eyebrow",
    title: "ca-split__title",
    lead: "ca-split__lead",
    media: "ca-split__media",
  },
  layout: {
    mediaEnd: "ca-split--media-end",
    mediaStart: "ca-split--media-start",
  },
} as const;
