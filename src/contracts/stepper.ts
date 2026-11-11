/**
 * Class names of a stepper: where people are in a process of a few steps,
 * such as booking a lesson. Each item has data-status="complete", "current"
 * or "upcoming"; the current one also has aria-current="step".
 */
export const stepper = {
  name: "stepper",
  root: "ca-stepper",
  parts: {
    item: "ca-stepper__item",
    marker: "ca-stepper__marker",
    label: "ca-stepper__label",
    description: "ca-stepper__description",
  },
  layout: {
    horizontal: "ca-stepper--horizontal",
    vertical: "ca-stepper--vertical",
  },
} as const;
