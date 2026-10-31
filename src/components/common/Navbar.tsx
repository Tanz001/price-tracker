import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Radio,
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  Plus,
  LogOut,
  Shield,
  LogIn,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = (path: string) =>
    `hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
      location.pathname === path || location.pathname.startsWith(path + '/')
        ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
        : ''
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-[#0B1020]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-[4.5rem] flex items-center justify-between gap-3 sm:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-2.5 text-slate-900 dark:text-white whitespace-nowrap shrink-0 group min-w-0"
        >
          <div className="relative w-8 h-8 rounded-xl bg-radar-gradient flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Radio className="w-4 h-4" />
            <span className="absolute inset-0 rounded-xl bg-indigo-500/20 animate-ping opacity-75" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-display font-bold text-lg sm:text-xl tracking-tight">
              Price<span className="text-gradient">Radar</span>
            </div>
            <div className="text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
              by Fixend
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/dashboard/products" className={navLinkClass('/dashboard/products')}>
                Products
              </Link>
              <Link to="/dashboard/alerts" className={navLinkClass('/dashboard/alerts')}>
                Alerts
              </Link>
              {isAdmin && (
                <Link to="/dashboard/admin" className={navLinkClass('/dashboard/admin')}>
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <a href="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                How it works
              </a>
              <a href="/#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                About
              </a>
              <a href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                FAQ
              </a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="w-8 h-8 rounded-xl bg-radar-gradient text-white text-xs font-bold flex items-center justify-center">
                  {user?.avatarInitials}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user?.name.split(' ')[0]}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/add"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add product
                  </Link>
                  <Link
                    to="/dashboard/alerts"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    Email alerts
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/dashboard/admin"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-radar-gradient rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-5 flex flex-col gap-1 animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-700 dark:text-slate-200 py-2">
                Dashboard
              </Link>
              <Link to="/dashboard/products" className="text-sm font-medium text-slate-700 dark:text-slate-200 py-2">
                Products
              </Link>
              <Link to="/dashboard/alerts" className="text-sm font-medium text-slate-700 dark:text-slate-200 py-2">
                Email alerts
              </Link>
              {isAdmin && (
                <Link to="/dashboard/admin" className="text-sm font-medium text-slate-700 dark:text-slate-200 py-2">
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-left text-sm font-medium text-rose-600 py-2 cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <a href="/#how-it-works" className="text-sm font-medium text-slate-700 dark:text-slate-200 py-2">
                How it works
              </a>
              <a href="/#about" className="text-sm font-medium text-slate-700 dark:text-slate-200 py-2">
                About Fixend
              </a>
              <Link to="/login" className="text-sm font-medium text-slate-700 dark:text-slate-200 py-2">
                Sign in
              </Link>
              <Link
                to="/register"
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-radar-gradient rounded-xl mt-1"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
