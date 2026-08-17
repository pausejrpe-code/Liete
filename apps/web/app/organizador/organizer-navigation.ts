import type { SidebarItemHrefMap } from "@liete/ui-web";
import { withBasePath } from "../../lib/site-path";

export const organizerSidebarItemHrefs = {
  account: withBasePath("/organizador/perfil/"),
  analytics: withBasePath("/organizador/financeiro/"),
  dashboard: withBasePath("/organizador/"),
  explore: withBasePath("/organizador/excursoes/")
} satisfies SidebarItemHrefMap;
