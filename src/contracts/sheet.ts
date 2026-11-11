/**
 * Class names of a sheet: a native modal <dialog> that slides in from an edge
 * of the screen, for navigation, filters or details. The side is a layout.
 */
export const sheet = {
  name: "sheet",
  root: "ca-sheet",
  parts: {
    title: "ca-sheet__title",
    description: "ca-sheet__description",
    body: "ca-sheet__body",
    footer: "ca-sheet__footer",
  },
  layout: {
    end: "ca-sheet--end",
    start: "ca-sheet--start",
    bottom: "ca-sheet--bottom",
  },
} as const;
