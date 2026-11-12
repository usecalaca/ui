/**
 * Skin and appearance switching (spec 035 decision 17). Load it as a classic,
 * render-blocking script in <head>, so the remembered choice applies before
 * first paint:
 *   <script src="ca-appearance.js"></script>
 * Controls are plain form elements:
 *   <select data-ca-control="skin"><option value="">Default</option>…</select>
 *   <select data-ca-control="appearance"><option value="system">System</option>…</select>
 * Radio buttons with the same attribute work too. "system" (or an empty value)
 * removes the attribute, so the appearance follows prefers-color-scheme.
 * An appearance pin is mirrored onto data-theme, the platform's dark pin, so
 * --sf-* chrome on mixed pages follows the same choice.
 */
type Control = "skin" | "appearance";

const root = document.documentElement;
const keys: Record<Control, string> = { skin: "ca-skin", appearance: "ca-appearance" };

function read(control: Control): string | null {
  try {
    return localStorage.getItem(keys[control]);
  } catch {
    return null;
  }
}

function apply(control: Control, value: string | null, remember: boolean): void {
  const clear = !value || value === "system";
  if (clear) delete root.dataset[control];
  else root.dataset[control] = value;
  if (control === "appearance") {
    if (clear) delete root.dataset.theme;
    else root.dataset.theme = value;
  }
  if (!remember) return;
  try {
    if (clear) localStorage.removeItem(keys[control]);
    else localStorage.setItem(keys[control], value);
  } catch {
    // Storage can be blocked; the choice then lasts for this page only.
  }
}

function isControl(name: string | undefined): name is Control {
  return name === "skin" || name === "appearance";
}

// Browser chrome tints with the rendered skin: <meta name="theme-color">
// follows --ca-surface-page, so a reskin (or a pinned appearance) recolors the
// surrounding UI too. Static light/dark media metas remain the no-JS fallback.
function tintChrome(): void {
  const surface = getComputedStyle(root).getPropertyValue("--ca-surface-page").trim();
  if (!surface) return;
  const metas = document.querySelectorAll<HTMLMetaElement>("meta[name=theme-color]");
  let meta = metas[0];
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.append(meta);
  }
  meta.removeAttribute("media");
  meta.content = surface;
  for (let i = 1; i < metas.length; i++) metas[i]!.remove();
}

// Only a remembered choice is applied; without one, attributes set by the page stay.
for (const control of ["skin", "appearance"] as const) {
  const stored = read(control);
  if (stored !== null) apply(control, stored, false);
}

// Show the current choice in every control for it: selects hold the value,
// radios and checkboxes check the matching one.
function sync(control: Control): void {
  const current = control === "appearance" ? (root.dataset.appearance ?? root.dataset.theme ?? "system") : (root.dataset.skin ?? "");
  for (const element of document.querySelectorAll<HTMLSelectElement | HTMLInputElement>(`[data-ca-control="${control}"]`)) {
    if (element instanceof HTMLInputElement) element.checked = element.value === current;
    else element.value = current;
  }
}

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement || target instanceof HTMLInputElement)) return;
  const control = target.dataset.caControl;
  if (!isControl(control)) return;
  const change = () => {
    apply(control, target.value, true);
    sync(control);
    tintChrome();
  };
  // Opt-in: <html data-ca-vt> wraps the swap in a view transition. Reduced
  // motion and browsers without the API keep the instant swap.
  if (root.hasAttribute("data-ca-vt") && typeof document.startViewTransition === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(change);
  } else {
    change();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  for (const control of ["skin", "appearance"] as const) sync(control);
  tintChrome();
});

// An unpinned appearance follows the system; the tint follows along.
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (!root.dataset.appearance) tintChrome();
});
