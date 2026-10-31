import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Plus,
  Radio,
  Search,
  Shield,
  Sun,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const USER_NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/products', label: 'Products', icon: Package },
  { to: '/dashboard/add', label: 'Add product', icon: Plus },
  { to: '/dashboard/alerts', label: 'Alerts', icon: Bell },
];

const ADMIN_NAV = [{ to: '/dashboard/admin', label: 'Admin', icon: Shield }];

export const DashboardLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path.startsWith('/dashboard/products')) return 'Tracked products';
    if (path.startsWith('/dashboard/add')) return 'Add product';
    if (path.startsWith('/dashboard/alerts')) return 'Email alerts';
    if (path.startsWith('/dashboard/admin')) return 'Admin console';
    if (path.startsWith('/dashboard/product/')) return 'Product detail';
    return 'Dashboard';
  }, [location.pathname]);

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
    }`;

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-slate-200/80 dark:border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-radar-gradient flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white truncate">
                Price<span className="text-gradient">Radar</span>
              </div>
              <div className="text-[10px] font-semibold tracking-wide text-slate-400">
                by Fixend
              </div>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
          )}
          {USER_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={navItemClass} title={item.label}>
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {isAdmin && (
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Operations
              </p>
            )}
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={navItemClass} title={item.label}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        )}

        {!collapsed && (
          <div className="mx-1 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-[1px]">
            <div className="rounded-2xl bg-white/95 dark:bg-[#0B1020]/95 p-3.5">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Radar status</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Best sources checked regularly. Alerts fire the moment a drop hits.
              </p>
            </div>
          </div>
        )}
      </nav>

      <div className={`border-t border-slate-200/80 dark:border-slate-800 p-3 ${collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2'}`}>
        <div className={`flex items-center gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-radar-gradient text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            {user?.avatarInitials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer ${
            collapsed ? 'justify-center w-full' : 'w-full'
          }`}
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-[#070B16] text-slate-900 dark:text-slate-100 flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0B1020]/95 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        {SidebarContent}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white dark:bg-[#0B1020] border-r border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]'}`}>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#0B1020]/80 backdrop-blur-xl">
          <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dashboard</p>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{pageTitle}</h1>
            </div>

            <div className="hidden md:flex items-center max-w-xs w-full relative">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    navigate(`/dashboard/products?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                placeholder="Search products…"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/dashboard/add"
              className="inline-flex items-center justify-center gap-1.5 h-10 w-10 sm:w-auto sm:px-3.5 rounded-xl text-xs font-semibold text-white bg-radar-gradient shadow-md shadow-indigo-500/20 hover:-translate-y-0.5 transition-transform"
              aria-label="Track product"
            >
              <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Track</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-1 duration-300 max-w-[1280px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
