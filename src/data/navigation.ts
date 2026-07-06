export interface NavItem {
  to: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { to: '/habits', label: 'Habits', icon: 'ListChecks' },
  { to: '/calendar', label: 'Calendar', icon: 'CalendarDays' },
  { to: '/statistics', label: 'Statistics', icon: 'BarChart3' },
  { to: '/achievements', label: 'Achievements', icon: 'Trophy' },
  { to: '/settings', label: 'Settings', icon: 'Settings' },
];
