/**
 * Rich text editor behavior for `ca-editor`. Markup: a `role="toolbar"` of
 * buttons with `data-command` (bold, italic, insertUnorderedList,
 * insertOrderedList, formatBlock with `data-value`, unlink, or link, which
 * opens the `ca-editor__link` popover form), a `contenteditable` area with
 * `role="textbox"` and `aria-multiline="true"`, and an
 * `<input type="hidden">` that receives the HTML on every change.
 *
 * - Arrow keys, Home and End move focus between tools (roving tabindex).
 * - Tools show their state with aria-pressed as the selection moves.
 * - Paste inserts plain text, so no styles from other apps come along.
 *
 * Formatting uses document.execCommand, which every browser supports for
 * contenteditable although it is marked legacy. Sanitize the HTML on the
 * server before you store or show it. Importing this module during server
 * rendering is a no-op.
 */
const STATES = ["bold", "italic", "insertUnorderedList", "insertOrderedList"];
let saved: Range | null = null;

const parts = (target: EventTarget | null) => {
  const root = (target as Element | null)?.closest?.(".ca-editor");
  const content = root?.querySelector<HTMLElement>(".ca-editor__content");
  return root && content ? { root, content, output: root.querySelector<HTMLInputElement>("input[type='hidden']") } : null;
};

function refresh(root: Element): void {
  for (const tool of root.querySelectorAll<HTMLElement>(".ca-editor__tool[data-command]")) {
    const command = tool.dataset.command!;
    if (STATES.includes(command)) tool.setAttribute("aria-pressed", String(document.queryCommandState(command)));
  }
}

function run(content: HTMLElement, command: string, value?: string): void {
  content.focus();
  if (saved) {
    const selection = getSelection();
    selection?.removeAllRanges();
    selection?.addRange(saved);
  }
  document.execCommand(command, false, value);
  content.dispatchEvent(new Event("input", { bubbles: true }));
}

if (typeof document !== "undefined") {
  // Remember the selection in the content before a tool or the link form takes focus.
  document.addEventListener("selectionchange", () => {
    const selection = getSelection();
    const p = parts(selection?.anchorNode?.parentElement ?? null);
    if (!p || !selection?.rangeCount || !p.content.contains(selection.anchorNode)) return;
    saved = selection.getRangeAt(0).cloneRange();
    refresh(p.root);
  });

  document.addEventListener("click", (event) => {
    const tool = (event.target as Element | null)?.closest?.<HTMLElement>(".ca-editor__tool[data-command]");
    const p = parts(tool ?? null);
    if (!tool || !p || tool.dataset.command === "link") return;
    run(p.content, tool.dataset.command!, tool.dataset.value);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target as HTMLFormElement;
    const p = parts(form);
    if (!p || !form.classList.contains("ca-editor__link")) return;
    event.preventDefault();
    const url = new FormData(form).get("url")?.toString().trim();
    form.hidePopover();
    if (url) run(p.content, "createLink", url);
    form.reset();
  });

  document.addEventListener("input", (event) => {
    const p = parts(event.target);
    if (p && event.target === p.content && p.output) p.output.value = p.content.innerHTML;
  });

  document.addEventListener("paste", (event) => {
    const p = parts(event.target);
    if (!p || !p.content.contains(event.target as Node)) return;
    event.preventDefault();
    // Without plain text on the clipboard, nothing is inserted and the selection stays.
    const text = event.clipboardData?.getData("text/plain");
    if (text) document.execCommand("insertText", false, text);
  });

  document.addEventListener("keydown", (event) => {
    const tool = (event.target as Element | null)?.closest?.<HTMLElement>(".ca-editor__tool");
    const toolbar = tool?.closest("[role='toolbar']");
    if (!tool || !toolbar) return;
    const tools = [...toolbar.querySelectorAll<HTMLElement>(".ca-editor__tool")];
    const index = tools.indexOf(tool);
    const forward = getComputedStyle(toolbar).direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const next =
      event.key === forward ? tools[(index + 1) % tools.length]
      : event.key === (forward === "ArrowRight" ? "ArrowLeft" : "ArrowRight") ? tools[(index - 1 + tools.length) % tools.length]
      : event.key === "Home" ? tools[0]
      : event.key === "End" ? tools.at(-1)
      : undefined;
    if (!next) return;
    event.preventDefault();
    for (const item of tools) item.tabIndex = item === next ? 0 : -1;
    next.focus();
  });
}

// A module, so it can be imported for its side effect in typed code.
export {};
