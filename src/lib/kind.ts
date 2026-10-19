import type { Project } from "./data";
import type { UI } from "./i18n";

/** "Web" / "Mobile" / "Web + Mobile" / "Mobile + Hardware" for a project. */
export function kindLabel(p: Project, t: UI["work"]) {
  if (p.renders || p.companion?.kind === "render") return t.mobileHardware;
  if (p.companion) return t.webMobile;
  return p.device === "browser" ? t.web : t.mobile;
}
