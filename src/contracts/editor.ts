/**
 * Class names of the rich text editor: a toolbar above an editable area, and
 * a hidden input that carries the HTML with the form. ca-editor.js runs the
 * toolbar, the link form and plain-text paste.
 */
export const editor = {
  name: "editor",
  root: "ca-editor",
  parts: {
    toolbar: "ca-editor__toolbar",
    tool: "ca-editor__tool",
    content: "ca-editor__content",
    link: "ca-editor__link",
  },
} as const;
