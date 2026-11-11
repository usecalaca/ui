/**
 * Class names of the navbar: brand, main links, actions and a menu button.
 * Below 40rem of its own width (64rem with the roomy layout) the links move
 * into a popover that the menu button opens; above it they sit in the bar.
 */
export const navbar = {
  name: "navbar",
  root: "ca-navbar",
  parts: {
    brand: "ca-navbar__brand",
    menu: "ca-navbar__menu",
    link: "ca-navbar__link",
    actions: "ca-navbar__actions",
    toggle: "ca-navbar__toggle",
  },
  layout: {
    roomy: "ca-navbar--roomy",
  },
} as const;
