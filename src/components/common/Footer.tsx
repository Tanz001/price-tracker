import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Github, Twitter, Mail, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1020] text-slate-600 dark:text-slate-400">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-7 h-7 rounded-lg bg-radar-gradient flex items-center justify-center text-white">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">PriceRadar</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              AI-powered price comparison and drop alert radar scanning 100+ stores 24/7 so you never overpay.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400 dark:text-slate-500">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:support@priceradar.io" aria-label="Email support" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="/#supported-stores" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Supported stores
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  My Trackers
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Supported Stores */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Popular Stores
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Amazon & Prime Deals</li>
              <li>Walmart & Rollbacks</li>
              <li>Best Buy & Daily Deals</li>
              <li>AliExpress & Daraz</li>
              <li>eBay & Verified Sellers</li>
            </ul>
          </div>

          {/* Trust & Legal */}
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

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© 2026 PriceRadar. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Free forever</span>
            <span>·</span>
            <span>No credit card required</span>
            <span>·</span>
            <Link to="/unsubscribe" className="hover:underline">Manage preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
