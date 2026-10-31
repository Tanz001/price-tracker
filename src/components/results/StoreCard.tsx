import React from 'react';
import { ExternalLink, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { StoreOffer } from '../../types';

interface StoreCardProps {
  offer: StoreOffer;
  layout?: 'list' | 'grid';
}

export const StoreCard: React.FC<StoreCardProps> = ({ offer, layout = 'list' }) => {
  const isBest = offer.isBestPrice;

  return (
    <div
      className={`relative rounded-[20px] p-5 transition-all duration-200 border ${
        isBest
          ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] border-emerald-500 dark:border-emerald-400 shadow-md shadow-emerald-500/10'
          : 'bg-white dark:bg-[#121832] border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      } ${layout === 'grid' ? 'flex flex-col justify-between' : 'flex flex-col sm:flex-row sm:items-center justify-between gap-4'}`}
    >
      {/* Top Best Price Tag */}
      {isBest && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 animate-best-pulse">
            ★ Best Price
          </span>
        </div>
      )}

      {/* Store Identity & Seller Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 text-sm border border-slate-200 dark:border-slate-700 shrink-0">
            {offer.storeName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {offer.storeName}
              </h4>
              {offer.verifiedSeller && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400" title="Verified Retailer">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-0.5 font-medium text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{offer.sellerRating}</span>
              </span>
              <span>·</span>
              <span>{(offer.sellerReviews).toLocaleString()} reviews</span>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Info */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span className={offer.shippingCost === 0 ? 'font-medium text-emerald-600 dark:text-emerald-400' : ''}>
              {offer.shippingText}
            </span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{offer.deliveryEstimate}</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className={`flex items-center justify-between sm:justify-end gap-5 ${layout === 'grid' ? 'pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-2' : ''}`}>
        <div className="text-left sm:text-right">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              ${offer.price.toFixed(2)}
            </span>
            {offer.originalPrice > offer.price && (
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500 line-through tabular-nums">
                ${offer.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:justify-end">
            {offer.discountPercent > 0 && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                -{offer.discountPercent}% OFF
              </span>
            )}
            <span className={`text-[11px] font-medium ${offer.inStock ? 'text-slate-500 dark:text-slate-400' : 'text-rose-500 font-semibold'}`}>
              {offer.stockStatus}
            </span>
          </div>
        </div>

        <a
          href={offer.productUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
            isBest
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
              : 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900'
          }`}
        >
          <span>Visit store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
