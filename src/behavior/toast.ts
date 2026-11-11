/**
 * Toasts for `ca-toast`. Call `toast("Lesson moved to Thursday", { tone: "success" })`,
 * dispatch `new CustomEvent("ca:toast", { detail: { message, tone } })` on the
 * document, or give a button `data-ca-toast="message"` and optionally
 * `data-ca-toast-tone`.
 *
 * The first toast creates the region (a manual popover, in the top layer) with
 * a status element that exists before any message, so screen readers announce
 * each one. Toasts close after `duration` ms (5 seconds) unless the pointer is
 * over the region or focus is inside it. A toast with an action stays until it
 * is closed, so people who need longer can still reach the action.
 *
 * While a modal dialog is open, everything outside it is inert, so the region
 * moves into the topmost open dialog and back to the body when it closes.
 */
export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  tone?: ToastTone;
  /** Milliseconds before the toast closes itself; Infinity keeps it open. */
  duration?: number;
  /** One action, such as Undo. Toasts with an action do not close by themselves. */
  action?: { label: string; onClick: () => void };
}

const MAX = 4;
let region: HTMLElement | undefined;
let status: HTMLElement | undefined;

function ensureRegion(): HTMLElement {
  if (region?.isConnected) return region;
  region = document.createElement("section");
  region.className = "ca-toast__region";
  region.setAttribute("popover", "manual");
  region.setAttribute("aria-label", "Notifications");
  status = document.createElement("p");
  status.className = "ca-toast__status";
  status.setAttribute("role", "status");
  region.append(status);
  document.body.append(region);
  return region;
}

function button(className: string, label: string): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.textContent = label;
  return element;
}

/** Puts the region where it is not inert (the topmost modal dialog, or the body) and shows it on top. */
function place(host: HTMLElement, show = host.querySelector(".ca-toast") !== null): void {
  const modal = [...document.querySelectorAll("dialog")].filter((dialog) => dialog.matches(":modal")).at(-1);
  const parent = modal ?? document.body;
  if (host.matches(":popover-open")) host.hidePopover();
  if (host.parentElement !== parent) parent.append(host);
  // Showing again also moves the region to the top of the top layer.
  if (show) host.showPopover();
}

/** Shows a toast and returns a function that closes it. */
export function toast(message: string, options: ToastOptions = {}): () => void {
  const host = ensureRegion();
  place(host, true);

  const item = document.createElement("div");
  item.className = `ca-toast ca-toast--${options.tone ?? "neutral"}`;
  const text = document.createElement("p");
  text.className = "ca-toast__message";
  text.textContent = message;
  item.append(text);

  const close = () => {
    item.remove();
    if (!host.querySelector(".ca-toast")) host.hidePopover();
  };
  if (options.action) {
    const { label, onClick } = options.action;
    const action = button("ca-button ca-button--secondary ca-button--sm", label);
    action.addEventListener("click", () => {
      onClick();
      close();
    });
    item.append(action);
  }
  const dismiss = button("ca-toast__close", "×");
  dismiss.setAttribute("aria-label", "Dismiss notification");
  dismiss.addEventListener("click", close);
  item.append(dismiss);

  host.append(item);
  for (const old of [...host.querySelectorAll(".ca-toast")].slice(0, -MAX)) old.remove();

  // Clear, then set on the next tick, so a repeated message is announced again.
  status!.textContent = "";
  setTimeout(() => (status!.textContent = message), 50);

  const duration = options.duration ?? (options.action ? Infinity : 5000);
  if (Number.isFinite(duration)) {
    const tick = () => (host.matches(":hover, :focus-within") ? setTimeout(tick, 1000) : close());
    setTimeout(tick, duration);
  }
  return close;
}

if (typeof document !== "undefined") {
  document.addEventListener("click", (event) => {
    const trigger = (event.target as Element | null)?.closest?.<HTMLElement>("[data-ca-toast]");
    if (trigger) toast(trigger.dataset.caToast ?? "", { tone: trigger.dataset.caToastTone as ToastTone | undefined });
  });
  // A closed dialog takes its descendants out of view; move the region back to the body.
  document.addEventListener(
    "close",
    (event) => {
      if (region && (event.target as Element).contains(region)) place(region);
    },
    true,
  );
  document.addEventListener("ca:toast", (event) => {
    const { message, ...options } = (event as CustomEvent<ToastOptions & { message: string }>).detail;
    toast(message, options);
  });
}
