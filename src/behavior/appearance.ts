/**
 * Skin and appearance switching. Load it as a classic,
 * render-blocking script in <head>, so the remembered choice applies before
 * first paint:
 *   <script src="ca-appearance.js"></script>
 * Controls are plain form elements:
 *   <select data-ca-control="skin"><option value="">Default</option>…</select>
 *   <select data-ca-control="appearance"><option value="system">System</option>…</select>
 * Radio buttons with the same attribute work too. "system" (or an empty value)
 * removes the attribute, so the appearance follows prefers-color-scheme.
 * An appearance pin is mirrored onto data-theme, so pages that use it as
 * their dark-mode attribute follow the same choice.
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
  apply(control, target.value, true);
  sync(control);
});

document.addEventListener("DOMContentLoaded", () => {
  for (const control of ["skin", "appearance"] as const) sync(control);
});
