import React from 'react';
import { Product, StoreOffer } from '../../types';
import { Radio, ExternalLink, ArrowRight, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmailPreviewProps {
  product: Product;
  offer: StoreOffer;
  email?: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  product,
  offer,
  email = 'shopper@example.com',
}) => {
  return (
    <div className="max-w-[600px] mx-auto bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Email Meta Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/90 px-6 py-3 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-slate-700 dark:text-slate-300">From:</span>
          <span>alerts@priceradar.io</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">To:</span>
          <span className="truncate">{email}</span>
        </div>
        <span className="text-[11px] font-mono shrink-0">Just now</span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-radar-gradient flex items-center justify-center text-white">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-base text-slate-900 dark:text-white">
              PriceRadar
            </span>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <BellRing className="w-3 h-3" />
            <span>Price Dropped</span>
          </span>
        </div>

        {/* Main Alert Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            📉 Price drop alert!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Great news! An item on your radar just hit a new low price on <strong className="text-slate-900 dark:text-white">{offer.storeName}</strong>.
          </p>
        </div>

        {/* Product Card Container inside Email */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#121832] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-5 items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700/60 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              {product.brand}
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
              {product.title}
            </h3>

            {/* Before / After Price */}
            <div className="flex items-baseline justify-center sm:justify-start gap-3 pt-1">
              <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                ${offer.originalPrice.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                ${offer.price.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                Save ${(offer.originalPrice - offer.price).toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sold by: <span className="font-medium text-slate-700 dark:text-slate-300">{offer.storeName}</span> ({offer.shippingText})
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-2">
          <a
            href={offer.productUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-radar-gradient shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            <span>View Deal on {offer.storeName}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            Prices and stock availability can fluctuate rapidly.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            You received this email because you subscribed to price alerts on PriceRadar.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            <Link to="/unsubscribe" className="hover:underline">
              Unsubscribe from this product
            </Link>
            <span>·</span>
            <Link to="/dashboard" className="hover:underline">
              Manage all alerts
            </Link>
          </div>
          <p className="text-[11px] text-slate-400">
            © 2026 PriceRadar Inc. 100 Market St, San Francisco, CA.
          </p>
        </div>
      </div>
    </div>
  );
};
