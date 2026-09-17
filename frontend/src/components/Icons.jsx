export const Icon = ({ children, className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IconDashboard = (p) => <Icon {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></Icon>;
export const IconUsers = (p) => <Icon {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><circle cx="17" cy="8.5" r="2.4"/><path d="M15 13.6c2.3.3 4 1.9 4 4.4"/></Icon>;
export const IconBuilding = (p) => <Icon {...p}><path d="M5 20V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14M13 20V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11M3 20h18M8 8.5h.01M8 12h.01M8 15.5h.01"/></Icon>;
export const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/></Icon>;
export const IconCalendarOff = (p) => <Icon {...p}><rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8 3.5v3.5M16 3.5v3.5M9 14l6 4M15 14l-6 4"/></Icon>;
export const IconTag = (p) => <Icon {...p}><path d="M12 3.5h5.5a1 1 0 0 1 1 1V10L10 18.5l-6.5-6.5L12 3.5Z"/><circle cx="15" cy="7.5" r="1.2"/></Icon>;
export const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></Icon>;
export const IconLogout = (p) => <Icon {...p}><path d="M9 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3M16 17l4-5-4-5M20 12H9"/></Icon>;
export const IconMenu = (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>;
export const IconChevRight = (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
export const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>;
export const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
export const IconEdit = (p) => <Icon {...p}><path d="M4 20h4L18.5 9.5a2 2 0 0 0-4-4L4 16v4Z"/></Icon>;
export const IconTrash = (p) => <Icon {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/></Icon>;
export const IconCheck = (p) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7"/></Icon>;
export const IconX = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
