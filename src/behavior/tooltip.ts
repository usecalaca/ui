/**
 * Escape for `ca-tooltip` (WCAG 1.4.13): the tooltip shows with CSS on hover
 * and keyboard focus; Escape hides it until the pointer or focus leaves the
 * wrapper, without moving either. One document listener serves every
 * tooltip. Importing it during server rendering is a no-op.
 */
const TOOLTIP = ".ca-tooltip";

if (typeof document !== "undefined") {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    for (const tooltip of document.querySelectorAll<HTMLElement>(`${TOOLTIP}:hover, ${TOOLTIP}:has(:focus-visible)`)) {
      if (tooltip.hasAttribute("data-dismissed")) continue;
      tooltip.setAttribute("data-dismissed", "");
      // Only the tooltip closes; a dialog around it stays open.
      event.preventDefault();
    }
  });

  const reset = (event: Event) => {
    const tooltip = (event.target as Element | null)?.closest?.(TOOLTIP);
    const next = (event as FocusEvent | PointerEvent).relatedTarget as Node | null;
    if (tooltip && !tooltip.contains(next)) tooltip.removeAttribute("data-dismissed");
  };
  document.addEventListener("pointerout", reset);
  document.addEventListener("focusout", reset);
}

// A module, so it can be imported for its side effect in typed code.
export {};
