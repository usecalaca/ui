/** Class names of the alert: a message about the page or a task, with a tone. */
export const alert = {
  name: "alert",
  root: "ca-alert",
  parts: {
    title: "ca-alert__title",
    description: "ca-alert__description",
    actions: "ca-alert__actions",
  },
  variant: {
    neutral: "ca-alert--neutral",
    info: "ca-alert--info",
    success: "ca-alert--success",
    warning: "ca-alert--warning",
    danger: "ca-alert--danger",
  },
} as const;
