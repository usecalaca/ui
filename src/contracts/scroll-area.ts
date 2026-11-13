/**
 * Scroll area: a scrollable region with custom scrollbars. Custom-scrollbar
 * DOMs (Base UI ScrollArea, shadcn ScrollArea) render a viewport, content,
 * a scrollbar per axis with a thumb, and an optional corner.
 */
export const scrollArea = {
  name: "scroll-area",
  root: "ca-scroll-area",
  parts: {
    viewport: "ca-scroll-area__viewport",
    content: "ca-scroll-area__content",
    scrollbar: "ca-scroll-area__scrollbar",
    thumb: "ca-scroll-area__thumb",
    corner: "ca-scroll-area__corner",
  },
  variant: {
    /** Fade out the edges while there is more to scroll. */
    fade: "ca-scroll-area--fade",
    /** Reserve space beside the content when that axis overflows. */
    gutter: "ca-scroll-area--gutter",
  },
} as const;
