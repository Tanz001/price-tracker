import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Radio, Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTrackClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const heroInput = document.getElementById('hero-product-input');
      if (heroInput) {
        heroInput.focus();
        heroInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate('/?focus=input');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-[#0B1020]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line with radar icon */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
        >
          <div className="relative w-8 h-8 rounded-xl bg-radar-gradient flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
            <Radio className="w-4 h-4" />
            <span className="absolute inset-0 rounded-xl bg-indigo-500/20 animate-ping opacity-75" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Price<span className="text-gradient">Radar</span>
          </span>
        </Link>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="/#how-it-works"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            How it works
          </a>
          <a
            href="/#supported-stores"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            Supported stores
          </a>
          <a
            href="/#faq"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            FAQ
          </a>
          <Link
            to="/dashboard"
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              location.pathname === '/dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Tracked products
          </Link>
        </nav>

        {/* Zone 3: 1 primary action + dark mode toggle */}
        <div className="flex items-center gap-3 shrink-0">
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

          <button
            onClick={handleTrackClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-radar-gradient rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Track a product</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
          >
            How it works
          </a>
          <a
            href="/#supported-stores"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
          >
            Supported stores
          </a>
          <a
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
          >
            FAQ
          </a>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
          >
            Tracked products
          </Link>
          <button
            onClick={handleTrackClick}
            className="w-full py-2.5 text-center text-xs font-semibold text-white bg-radar-gradient rounded-xl"
          >
            Track a product
          </button>
        </div>
      )}
    </header>
  );
};
