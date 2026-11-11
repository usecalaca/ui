/**
 * Class names of toasts: short messages in a region at the end of the screen.
 * ca-toast.js creates the region, adds and removes toasts and announces them.
 */
export const toast = {
  name: "toast",
  root: "ca-toast",
  parts: {
    region: "ca-toast__region",
    message: "ca-toast__message",
    close: "ca-toast__close",
    status: "ca-toast__status",
  },
  variant: {
    neutral: "ca-toast--neutral",
    info: "ca-toast--info",
    success: "ca-toast--success",
    warning: "ca-toast--warning",
    danger: "ca-toast--danger",
  },
} as const;
