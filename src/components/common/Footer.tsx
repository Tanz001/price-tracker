import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Github, Twitter, Mail, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1020] text-slate-600 dark:text-slate-400">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-7 h-7 rounded-lg bg-radar-gradient flex items-center justify-center text-white">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <span className="font-display font-bold text-lg tracking-tight block">PriceRadar</span>
                <span className="text-[10px] font-semibold text-slate-500">by Fixend</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              AI-powered price tracking that finds product prices across the internet from the best available sources.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400 dark:text-slate-500">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:hello@fixend.com" aria-label="Email Fixend" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard/add" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Add product by URL
                </Link>
              </li>
              <li>
                <Link to="/dashboard/products" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  My Trackers
                </Link>
              </li>
              <li>
                <Link to="/dashboard/alerts" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Email alerts
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              About Fixend
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>PriceRadar is a project by the Fixend team</li>
              <li>Development agency for web & product work</li>
              <li>Custom software, UI, and dashboards</li>
              <li>
                <a href="/#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Learn more about us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Trust & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero spam guarantee</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant drop alerts</span>
              </li>
              <li>
                <Link to="/unsubscribe" className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Unsubscribe Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-3 sm:gap-4 text-center sm:text-left">
          <p>© 2026 PriceRadar by Fixend. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Free forever</span>
            <span className="hidden sm:inline">·</span>
            <span>Built by Fixend</span>
            <span className="hidden sm:inline">·</span>
            <Link to="/unsubscribe" className="hover:underline">Manage preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
