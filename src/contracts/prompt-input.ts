/**
 * Class names of a prompt input: a framed container that wraps a naked
 * textarea with a row of actions, as used in AI chat composers. Clicking
 * the frame focuses the textarea; a suggestion row is a cluster of pill
 * buttons (`ca-button`), not part of this contract.
 */
export const promptInput = {
  name: "prompt-input",
  root: "ca-prompt-input",
  parts: {
    textarea: "ca-prompt-input__textarea",
    actions: "ca-prompt-input__actions",
  },
} as const;
