import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconDashboard, IconUsers, IconBuilding, IconClock, IconCalendarOff,
  IconTag, IconSettings, IconLogout, IconMenu, IconX,
} from "../components/Icons";

const NAV = [
  { to: "/", label: "Dashboard", icon: IconDashboard, end: true },
  { to: "/employees", label: "Employees", icon: IconUsers, perm: "employees.view" },
  { to: "/departments", label: "Departments", icon: IconBuilding },
  { to: "/attendance", label: "Attendance", icon: IconClock, perm: "attendance.view" },
  { to: "/leave", label: "Leave Requests", icon: IconCalendarOff, perm: "leaves.view" },
  { to: "/holidays", label: "Holidays", icon: IconTag },
  { to: "/settings", label: "Settings", icon: IconSettings, perm: "settings.manage" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2 px-6 h-[70px] shrink-0">
      <span className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
        <span className="text-white font-display font-extrabold text-base">D</span>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-white">ECIBEL</span>
    </div>
  );
}

function SidebarLinks({ can, onNavigate }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV.filter((item) => !item.perm || can(item.perm)).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
              isActive ? "bg-brand text-white" : "text-white/65 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <item.icon className="w-[18px] h-[18px] shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-navy flex-col fixed inset-y-0">
        <Logo />
        <SidebarLinks can={can} />
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-white/65 hover:bg-white/10 hover:text-white w-full transition-colors">
            <IconLogout className="w-[18px] h-[18px]" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-navy flex flex-col">
            <div className="flex items-center justify-between pr-4">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="text-white/70"><IconX className="w-5 h-5" /></button>
            </div>
            <SidebarLinks can={can} onNavigate={() => setMobileOpen(false)} />
            <div className="p-4 border-t border-white/10">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-white/65 hover:bg-white/10 hover:text-white w-full">
                <IconLogout className="w-[18px] h-[18px]" /> Sign out
              </button>
            </div>
          </div>
          <div className="flex-1 bg-navy/40" onClick={() => setMobileOpen(false)}></div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="h-[70px] bg-white border-b border-line flex items-center justify-between px-5 lg:px-8 sticky top-0 z-30">
          <button className="lg:hidden text-navy" onClick={() => setMobileOpen(true)}>
            <IconMenu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-navy leading-tight">{user?.name}</p>
              <p className="text-xs text-slate leading-tight capitalize">{user?.role_label || user?.role?.replaceAll("_", " ")}</p>
            </div>
            <span className="w-9 h-9 rounded-full bg-brand text-white font-display font-bold text-sm flex items-center justify-center">
              {user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
          </div>
        </header>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
