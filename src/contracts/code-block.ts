/**
 * Class names of a code block: a figure with a header (title such as the
 * language or file name, and actions such as Copy) above a <pre> that keeps
 * its lines and scrolls sideways.
 */
export const codeBlock = {
  name: "code-block",
  root: "ca-code-block",
  parts: {
    header: "ca-code-block__header",
    title: "ca-code-block__title",
    actions: "ca-code-block__actions",
    code: "ca-code-block__code",
    status: "ca-code-block__status",
  },
} as const;
