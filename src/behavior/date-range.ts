/**
 * Date range behavior for `ca-date-range`: the input with
 * `data-ca-range="start"` sets the earliest date of the one with
 * `data-ca-range="end"`, and the end sets the latest start, so pickers on
 * every device respect the range. An end before a new start moves to the
 * start. Importing it during server rendering is a no-op.
 */
if (typeof document !== "undefined") {
  const sync = (range: Element, moved: "start" | "end" | null) => {
    const start = range.querySelector<HTMLInputElement>("[data-ca-range='start']");
    const end = range.querySelector<HTMLInputElement>("[data-ca-range='end']");
    if (!start || !end) return;
    end.min = start.value;
    start.max = end.value;
    if (moved === "start" && start.value && end.value && end.value < start.value) {
      end.value = start.value;
      end.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };
  document.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    const range = input.closest?.(".ca-date-range");
    if (range && input.dataset.caRange) sync(range, input.dataset.caRange as "start" | "end");
  });
  // Apply the limits to ranges that are in the page with values already.
  const ready = () => document.querySelectorAll(".ca-date-range").forEach((range) => sync(range, null));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
}

// A module, so it can be imported for its side effect in typed code.
export {};
