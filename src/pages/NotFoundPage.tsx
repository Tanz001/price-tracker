import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center text-center">
      <div className="w-full max-w-md rounded-[24px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="relative w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Tag className="w-10 h-10 rotate-12" />
          <span className="absolute -top-1 -right-1 font-mono font-bold text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            This page took a price cut and disappeared.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The link you followed may be broken, or the page was moved to a better deal.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to PriceRadar Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
