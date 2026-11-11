/**
 * Combobox behavior for `ca-combobox` (WAI-ARIA combobox pattern with a
 * listbox, list autocomplete). Markup: an input with `role="combobox"`,
 * `aria-controls`, `aria-expanded="false"` and `aria-autocomplete="list"`,
 * and a `role="listbox"` of `role="option"` elements with ids.
 *
 * - The listbox floats when it has `popover="manual"`: it opens in the top
 *   layer, anchored under the input, and closes on Escape and when focus
 *   leaves. Without `popover` it is part of the page (such as results in a
 *   search dialog): it shows while it has options and leaves Escape alone.
 * - Typing filters the options by their text, unless the root has
 *   `data-filter="none"`: then the app renders the options itself, and the
 *   script follows its changes.
 * - `data-autoselect` on the root makes the first option active, so Enter
 *   takes it right away.
 * - An option that is a link (`<a role="option" href>`) navigates; any other
 *   option fills the input with its `data-value` or its text.
 *
 * One set of document listeners serves every combobox. Importing it during
 * server rendering is a no-op.
 */
interface Parts {
  root: Element;
  input: HTMLInputElement;
  listbox: HTMLElement;
}

function parts(target: EventTarget | null): Parts | null {
  const root = (target as Element | null)?.closest?.(".ca-combobox");
  const input = root?.querySelector<HTMLInputElement>("[role='combobox']");
  const listbox = root?.querySelector<HTMLElement>("[role='listbox']");
  return root && input && listbox ? { root, input, listbox } : null;
}

const options = (p: Parts) => [...p.listbox.querySelectorAll<HTMLElement>("[role='option']")];
const available = (p: Parts) => options(p).filter((option) => !option.hidden && option.getAttribute("aria-disabled") !== "true");
const floating = (p: Parts) => p.listbox.hasAttribute("popover");
const isOpen = (p: Parts) => (floating(p) ? p.listbox.matches(":popover-open") : !p.listbox.hidden);

function activate(p: Parts, active: HTMLElement | undefined): void {
  for (const option of options(p)) option.setAttribute("aria-selected", String(option === active));
  if (active) {
    p.input.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView({ block: "nearest" });
  } else p.input.removeAttribute("aria-activedescendant");
}

function show(p: Parts, open: boolean): void {
  const any = open && options(p).some((option) => !option.hidden);
  if (!floating(p)) p.listbox.hidden = !any;
  else if (any && !isOpen(p)) {
    const name = `--ca-combobox-${p.listbox.id}`;
    p.input.style.setProperty("anchor-name", name);
    p.listbox.style.setProperty("position-anchor", name);
    p.listbox.showPopover();
  } else if (!any && isOpen(p)) p.listbox.hidePopover();
  p.input.setAttribute("aria-expanded", String(any));
  activate(p, any && p.root.hasAttribute("data-autoselect") ? available(p)[0] : undefined);
}

function filter(p: Parts): void {
  if (p.root.getAttribute("data-filter") !== "none") {
    const query = p.input.value.trim().toLowerCase();
    for (const option of options(p)) option.hidden = !(option.textContent ?? "").toLowerCase().includes(query);
  }
  show(p, true);
}

function choose(p: Parts, option: HTMLElement): void {
  if (option instanceof HTMLAnchorElement) {
    option.click();
    return;
  }
  p.input.value = option.dataset.value ?? (option.textContent ?? "").trim();
  show(p, false);
  p.input.dispatchEvent(new Event("change", { bubbles: true }));
}

// Options the app renders (data-filter="none") can change after the input event; follow them.
const watched = new WeakSet<Element>();
function watch(p: Parts): void {
  if (p.root.getAttribute("data-filter") !== "none" || watched.has(p.listbox)) return;
  watched.add(p.listbox);
  new MutationObserver(() => show(p, document.activeElement === p.input || !floating(p))).observe(p.listbox, { childList: true });
}

if (typeof document !== "undefined") {
  document.addEventListener("input", (event) => {
    const p = parts(event.target);
    if (!p || event.target !== p.input) return;
    watch(p);
    filter(p);
  });

  document.addEventListener("keydown", (event) => {
    const p = parts(event.target);
    if (!p || event.target !== p.input) return;
    const list = available(p);
    const index = list.findIndex((option) => option.getAttribute("aria-selected") === "true");
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen(p)) filter(p);
      const down = event.key === "ArrowDown";
      const next = list.length ? list[(index + (down ? 1 : -1) + list.length + (index < 0 && !down ? 1 : 0)) % list.length] : undefined;
      activate(p, next);
    } else if (event.key === "Enter" && isOpen(p) && index >= 0) {
      event.preventDefault();
      choose(p, list[index]!);
    } else if (event.key === "Escape" && floating(p)) {
      if (isOpen(p)) show(p, false);
      else p.input.value = "";
      event.preventDefault();
    }
  });

  // Keep focus in the input while an option is clicked.
  document.addEventListener("pointerdown", (event) => {
    if ((event.target as Element | null)?.closest?.(".ca-combobox [role='option']")) event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    const option = (event.target as Element | null)?.closest?.<HTMLElement>(".ca-combobox [role='option']");
    const p = parts(option ?? null);
    // A link option navigates by itself.
    if (option && p && !(option instanceof HTMLAnchorElement) && option.getAttribute("aria-disabled") !== "true") choose(p, option);
  });

  document.addEventListener("focusout", (event) => {
    const p = parts(event.target);
    if (p && floating(p) && !p.root.contains(event.relatedTarget as Node | null)) show(p, false);
  });
}

// A module, so it can be imported for its side effect in typed code.
export {};
