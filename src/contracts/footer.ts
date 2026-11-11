/** Class names of the footer block: brand, groups of links and a legal line. */
export const footer = {
  name: "footer",
  root: "ca-footer",
  parts: {
    brand: "ca-footer__brand",
    nav: "ca-footer__nav",
    group: "ca-footer__group",
    heading: "ca-footer__heading",
    links: "ca-footer__links",
    link: "ca-footer__link",
    legal: "ca-footer__legal",
  },
  layout: {
    simple: "ca-footer--simple",
    columns: "ca-footer--columns",
  },
} as const;
