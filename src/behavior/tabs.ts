/**
 * Tabs behavior for `ca-tabs` (WAI-ARIA tabs pattern, automatic activation).
 * Markup: a `role="tablist"` of `role="tab"` buttons, each with
 * `aria-controls` pointing at its `role="tabpanel"`. The selected tab has
 * `aria-selected="true"` and `tabindex="0"`; the others `aria-selected="false"`,
 * `tabindex="-1"`, and their panels `hidden`.
 *
 * One listener on the document handles every tab list, including ones added
 * later by a framework. Importing it during server rendering is a no-op.
 */
const TAB = ".ca-tabs__tab[role='tab']";

function select(tab: HTMLElement): void {
  const list = tab.closest("[role='tablist']");
  if (!list) return;
  for (const other of list.querySelectorAll<HTMLElement>(TAB)) {
    const selected = other === tab;
    other.setAttribute("aria-selected", String(selected));
    other.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(other.getAttribute("aria-controls") ?? "");
    if (panel) panel.hidden = !selected;
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("click", (event) => {
    const tab = (event.target as Element | null)?.closest<HTMLElement>(TAB);
    if (tab && !tab.matches(":disabled")) select(tab);
  });

  document.addEventListener("keydown", (event) => {
    const tab = (event.target as Element | null)?.closest<HTMLElement>(TAB);
    const list = tab?.closest("[role='tablist']");
    if (!tab || !list) return;
    const tabs = [...list.querySelectorAll<HTMLElement>(TAB)].filter((item) => !item.matches(":disabled"));
    const index = tabs.indexOf(tab);
    // Arrow keys follow the reading direction: in right-to-left, ArrowLeft moves forward.
    const forward = getComputedStyle(list).direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = forward === "ArrowRight" ? "ArrowLeft" : "ArrowRight";
    const next =
      event.key === forward ? tabs[(index + 1) % tabs.length]
      : event.key === backward ? tabs[(index - 1 + tabs.length) % tabs.length]
      : event.key === "Home" ? tabs[0]
      : event.key === "End" ? tabs[tabs.length - 1]
      : undefined;
    if (!next) return;
    event.preventDefault();
    next.focus();
    select(next);
  });
}

// A module, so it can be imported for its side effect in typed code.
export {};
