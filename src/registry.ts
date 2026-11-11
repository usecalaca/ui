import { accordion } from "./contracts/accordion.ts";
import { alert } from "./contracts/alert.ts";
import { avatar } from "./contracts/avatar.ts";
import { badge } from "./contracts/badge.ts";
import { breadcrumb } from "./contracts/breadcrumb.ts";
import { button } from "./contracts/button.ts";
import { card } from "./contracts/card.ts";
import { checkbox, radio, toggle } from "./contracts/choice.ts";
import { combobox } from "./contracts/combobox.ts";
import { dialog } from "./contracts/dialog.ts";
import { dropdown } from "./contracts/dropdown.ts";
import { dateRange } from "./contracts/date-range.ts";
import { editor } from "./contracts/editor.ts";
import { emptyState } from "./contracts/empty-state.ts";
import { eyebrow } from "./contracts/eyebrow.ts";
import { fileUpload } from "./contracts/file-upload.ts";
import { field, input } from "./contracts/field.ts";
import { hero } from "./contracts/hero.ts";
import { features } from "./contracts/features.ts";
import { steps } from "./contracts/steps.ts";
import { cta } from "./contracts/cta.ts";
import { faq } from "./contracts/faq.ts";
import { footer } from "./contracts/footer.ts";
import { container } from "./contracts/container.ts";
import { stack } from "./contracts/stack.ts";
import { cluster } from "./contracts/cluster.ts";
import { grid } from "./contracts/grid.ts";
import { section } from "./contracts/section.ts";
import { heading } from "./contracts/heading.ts";
import { text } from "./contracts/text.ts";
import { prose } from "./contracts/prose.ts";
import { link } from "./contracts/link.ts";
import { code } from "./contracts/code.ts";
import { codeBlock } from "./contracts/code-block.ts";
import { kbd } from "./contracts/kbd.ts";
import { navbar } from "./contracts/navbar.ts";
import { pagination } from "./contracts/pagination.ts";
import { popover } from "./contracts/popover.ts";
import { progress } from "./contracts/progress.ts";
import { select } from "./contracts/select.ts";
import { separator } from "./contracts/separator.ts";
import { sheet } from "./contracts/sheet.ts";
import { sidebar } from "./contracts/sidebar.ts";
import { skeleton } from "./contracts/skeleton.ts";
import { spinner } from "./contracts/spinner.ts";
import { stat } from "./contracts/stat.ts";
import { stepper } from "./contracts/stepper.ts";
import { table } from "./contracts/table.ts";
import { tabs } from "./contracts/tabs.ts";
import { timeline } from "./contracts/timeline.ts";
import { toast } from "./contracts/toast.ts";
import { tooltip } from "./contracts/tooltip.ts";

/**
 * One contract: a root class, optional parts (child elements) and optional
 * groups of mutually exclusive modifiers on the root. Elements use variant and
 * size; blocks use layout.
 */
export interface Contract {
  name: string;
  root: string;
  parts?: Record<string, string>;
  variant?: Record<string, string>;
  size?: Record<string, string>;
  layout?: Record<string, string>;
}

/** Every element contract (components). */
export const contracts: readonly Contract[] = [button, card, field, input, select, combobox, dateRange, checkbox, radio, toggle, fileUpload, editor, badge, alert, toast, progress, spinner, skeleton, emptyState, dialog, sheet, dropdown, popover, tooltip, accordion, tabs, navbar, sidebar, breadcrumb, pagination, stepper, avatar, table, stat, timeline, separator, container, stack, cluster, grid, section, heading, text, prose, link, code, codeBlock, kbd, eyebrow];

/** Every block contract: sections composed from elements, with layouts. */
export const blocks: readonly Contract[] = [hero, features, steps, cta, faq, footer];

/** Elements and blocks together, for tests and the prebuilt CSS build. */
export const allContracts: readonly Contract[] = [...contracts, ...blocks];

/** All class names a contract defines. */
export function contractClasses(contract: Contract): string[] {
  return [
    contract.root,
    ...Object.values(contract.parts ?? {}),
    ...Object.values(contract.variant ?? {}),
    ...Object.values(contract.size ?? {}),
    ...Object.values(contract.layout ?? {}),
  ];
}
