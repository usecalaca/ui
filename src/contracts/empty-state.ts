/** Class names of an empty state: what to do when a list or page has nothing yet. */
export const emptyState = {
  name: "empty-state",
  root: "ca-empty-state",
  parts: {
    media: "ca-empty-state__media",
    title: "ca-empty-state__title",
    description: "ca-empty-state__description",
    actions: "ca-empty-state__actions",
  },
} as const;
