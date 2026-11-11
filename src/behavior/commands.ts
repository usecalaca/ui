/**
 * Polyfill for invoker commands (`commandfor` + `command`) on dialogs, for
 * browsers that do not support them natively. Markup stays standard HTML:
 *   <button commandfor="confirm" command="show-modal">Delete project</button>
 *   <button commandfor="confirm" command="close">Cancel</button>
 * Browsers with native support never run this listener. Importing it during
 * server rendering (no DOM) is a no-op.
 */
if (typeof HTMLButtonElement !== "undefined" && !("command" in HTMLButtonElement.prototype)) {
  document.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest("button[commandfor][command]");
    if (!(button instanceof HTMLButtonElement) || button.disabled) return;
    const target = document.getElementById(button.getAttribute("commandfor") ?? "");
    if (!(target instanceof HTMLDialogElement)) return;
    const command = button.getAttribute("command");
    if (command === "show-modal" && !target.open) target.showModal();
    else if (command === "close" && target.open) target.close(button.value);
  });
}

// A module, so it can be imported for its side effect in typed code.
export {};
