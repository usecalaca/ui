/**
 * Class names of a date range: a fieldset with two native date inputs, from
 * and until. ca-date-range.js keeps the end on or after the start.
 */
export const dateRange = {
  name: "date-range",
  root: "ca-date-range",
  parts: {
    fields: "ca-date-range__fields",
    field: "ca-date-range__field",
    separator: "ca-date-range__separator",
  },
} as const;
