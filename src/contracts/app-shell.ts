/**
 * Class names of the app shell: a viewport-height grid with a navigation
 * column, a header and a main region. Below 48rem of its own width the nav
 * is a [popover] drawer the
 * toggle button opens; above it docks in the grid. Collapsing a docked nav
 * is host state: set data-collapsed on the root to shrink it to zero width,
 * or to an icon rail with ca-app-shell--rail.
 */
export const appShell = {
  name: "app-shell",
  root: "ca-app-shell",
  parts: {
    header: "ca-app-shell__header",
    nav: "ca-app-shell__nav",
    main: "ca-app-shell__main",
    toggle: "ca-app-shell__toggle",
  },
  layout: {
    rail: "ca-app-shell--rail",
  },
} as const;
