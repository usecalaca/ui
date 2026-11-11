/**
 * Copy buttons, for code blocks and anything else: `data-ca-copy="<id>"`
 * copies the text of that element. The result is announced in the code
 * block's `ca-code-block__status` part, or in the element the button names
 * with `aria-describedby`. `data-ca-copied` changes the message. With
 * `data-ca-copy-toast` the result shows as a toast instead (load ca-toast.js),
 * which announces it too.
 *
 * A text-only button also says "Copied" for two seconds, right where the
 * visitor looks (`data-ca-copied-label` changes the word). Buttons with an
 * icon keep their content.
 *
 * One document listener serves every button. Importing it during server
 * rendering is a no-op.
 */
if (typeof document !== "undefined") {
  document.addEventListener("click", async (event) => {
    const button = (event.target as Element | null)?.closest?.<HTMLElement>("[data-ca-copy]");
    if (!button) return;
    const source = document.getElementById(button.dataset.caCopy ?? "");
    const status =
      button.closest(".ca-code-block")?.querySelector<HTMLElement>(".ca-code-block__status") ??
      document.getElementById(button.getAttribute("aria-describedby") ?? "");
    let message = button.dataset.caCopied ?? "Copied to clipboard";
    let tone = "success";
    try {
      await navigator.clipboard.writeText((source?.textContent ?? "").trim());
    } catch {
      message = "Copy failed: select the text and copy it yourself";
      tone = "danger";
    }
    if (tone === "success" && !button.children.length) {
      button.dataset.caLabel ??= button.textContent ?? "";
      button.textContent = button.dataset.caCopiedLabel ?? "Copied";
      clearTimeout(Number(button.dataset.caTimer));
      button.dataset.caTimer = String(
        setTimeout(() => {
          button.textContent = button.dataset.caLabel ?? "";
          delete button.dataset.caLabel;
        }, 2000),
      );
    }
    if (button.hasAttribute("data-ca-copy-toast")) {
      document.dispatchEvent(new CustomEvent("ca:toast", { detail: { message, tone } }));
      return;
    }
    if (!status) return;
    // Clear, then set on the next tick, so a second copy is announced again.
    status.textContent = "";
    setTimeout(() => (status.textContent = message), 50);
  });
}

// A module, so it can be imported for its side effect in typed code.
export {};
