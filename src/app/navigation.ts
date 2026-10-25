import { Boxes, House, ListTodo, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

const home: NavItem = { to: "/", labelKey: "nav.home", icon: House };

export const NAV_ITEMS: readonly NavItem[] = [
  home,
  { to: "/tasks", labelKey: "nav.tasks", icon: ListTodo },
  { to: "/showcase", labelKey: "nav.showcase", icon: Boxes },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
];

export const DEFAULT_NAV_ITEM = home;
