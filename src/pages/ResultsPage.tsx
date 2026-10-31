import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Check,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Percent,
  PiggyBank,
  Share2,
  RefreshCw,
  Bell,
} from 'lucide-react';
import { analyzeProductUrl } from '../services/api';
import { Product, StoreOffer } from '../types';
import { StoreCard } from '../components/results/StoreCard';
import { PriceChart } from '../components/results/PriceChart';
import { TrackForm } from '../components/results/TrackForm';
import { SuccessModal } from '../components/results/SuccessModal';
import { EmailPreview } from '../components/results/EmailPreview';
import { Modal } from '../components/common/Modal';
import { CountUp } from '../components/common/CountUp';
import { ResultsSkeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

const LOADING_STEPS = [
  'Reading product page…',
  'Identifying the exact product…',
  'Searching 100+ stores…',
  'Comparing prices…',
];

export const ResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const urlParam = searchParams.get('url') || 'https://www.amazon.com/dp/B09XS7JWHH';

  // Loading state with multi-step progression
  const [loading, setLoading] = useState(true);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  // Data states
  const [product, setProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort states
  const [sortBy, setSortBy] = useState<'lowest' | 'highest' | 'rating' | 'shipping'>('lowest');
  const [filterInStock, setFilterInStock] = useState(false);
  const [filterFreeShipping, setFilterFreeShipping] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modals
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [trackedEmail, setTrackedEmail] = useState('');
  const [mobileTrackDrawerOpen, setMobileTrackDrawerOpen] = useState(false);

  // Multi-step loading cycle (approx 4 seconds)
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setLoadingStepIndex(0);
    setProgress(15);
    setError(null);

    // Progression intervals
    const t1 = setTimeout(() => {
      if (isCurrent) {
        setLoadingStepIndex(1);
        setProgress(45);
      }
    }, 1000);

    const t2 = setTimeout(() => {
      if (isCurrent) {
        setLoadingStepIndex(2);
        setProgress(75);
      }
    }, 2200);

    const t3 = setTimeout(() => {
      if (isCurrent) {
        setLoadingStepIndex(3);
        setProgress(95);
      }
    }, 3200);

    // Fetch API data
    const fetchPromise = analyzeProductUrl(urlParam);

    const totalTimer = setTimeout(async () => {
      try {
        const result = await fetchPromise;
        if (isCurrent) {
          setProduct(result.product);
          setOffers(result.offers);
          setProgress(100);
          setLoading(false);
        }
      } catch (err: any) {
        if (isCurrent) {
          setError(err.message || 'Failed to analyze product link');
          setLoading(false);
        }
      }
    }, 4000);

    return () => {
      isCurrent = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(totalTimer);
    };
  }, [urlParam]);

  // Derived filtered & sorted offers
  const filteredOffers = offers
    .filter((offer) => {
      if (filterInStock && !offer.inStock) return false;
      if (filterFreeShipping && offer.shippingCost > 0) return false;
      if (filterVerified && !offer.verifiedSeller) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'lowest') return a.price - b.price;
      if (sortBy === 'highest') return b.price - a.price;
      if (sortBy === 'rating') return b.sellerRating - a.sellerRating;
      if (sortBy === 'shipping') return a.shippingCost - b.shippingCost;
      return 0;
    });

  // Price calculations
  const prices = offers.map((o) => o.price);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const averagePrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const potentialSavings = highestPrice - lowestPrice;
  const bestOffer = offers.find((o) => o.isBestPrice) || offers[0];

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      type: 'success',
      title: 'Link copied',
      message: 'Product comparison link copied to clipboard.',
    });
  };

  const handleTrackingSuccess = (email: string) => {
    setTrackedEmail(email);
    setSuccessModalOpen(true);
    setMobileTrackDrawerOpen(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 max-w-[1200px] mx-auto">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to search</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyShare}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
          >
            Share
          </Button>

          {/* Quick email preview trigger button */}
          {product && bestOffer && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEmailPreviewOpen(true)}
            >
              Email preview
            </Button>
          )}
        </div>
      </div>

      {/* 1. MULTI-STEP AI LOADING STATE */}
      {loading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="max-w-xl mx-auto p-6 rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {LOADING_STEPS[loadingStepIndex]}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm mx-auto">
                Scanning target URL: {urlParam}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-radar-gradient h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              {LOADING_STEPS.map((step, idx) => (
                <div
                  key={step}
                  className={`flex flex-col items-center gap-1 ${
                    idx <= loadingStepIndex
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      idx <= loadingStepIndex
                        ? 'bg-indigo-600 dark:bg-indigo-400'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                  <span className="hidden sm:inline truncate max-w-[80px]">
                    Step {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Layout matching final page */}
          <ResultsSkeleton />
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="max-w-md mx-auto p-8 rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Unable to analyze this product link
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {error}. The link may be expired, geo-blocked, or private.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Try another product link
          </Button>
        </div>
      )}

      {/* 2. RESULTS CONTENT */}
      {!loading && product && (
        <div className="space-y-6">
          {/* PRODUCT HEADER CARD */}
          <div className="bg-white dark:bg-[#121832] rounded-[24px] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-radar">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Product Image */}
              <div className="w-full lg:w-64 h-56 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-700/60 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {product.brand}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {product.category}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Match confidence: {product.matchConfidence}%</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{product.reviewCount.toLocaleString()} global verified ratings</span>
                  <span>·</span>
                  <span>Model: {product.model}</span>
                </div>

                {product.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    {product.description}
                  </p>
                )}

                {/* Key specs pills */}
                {product.specs && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.entries(product.specs).map(([label, val]) => (
                      <div
                        key={label}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-slate-400 dark:text-slate-500">{label}:</span>{' '}
                        <span className="font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SUMMARY STATS ROW */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Lowest Price</span>
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <CountUp value={lowestPrice} />
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
                  Available on {bestOffer?.storeName}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Highest Price</span>
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1 tabular-nums">
                  ${highestPrice.toFixed(2)}
                </div>
                <span className="text-[11px] text-slate-400">Standard retail range</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" />
                  <span>Average Price</span>
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1 tabular-nums">
                  ${averagePrice.toFixed(2)}
                </div>
                <span className="text-[11px] text-slate-400">Across {offers.length} verified stores</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/40">
                <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                  <PiggyBank className="w-3.5 h-3.5" />
                  <span>Potential Savings</span>
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
                  ${potentialSavings.toFixed(2)}
                </div>
                <span className="text-[11px] text-indigo-700 dark:text-indigo-300/80">
                  Save vs. highest store
                </span>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN LAYOUT: Offers List + Sticky Tracker Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 columns: Filter controls + Stores List + History Chart */}
            <div className="lg:col-span-8 space-y-6">
              {/* CONTROLS BAR: Sort, Filter chips, Grid/List toggle */}
              <div className="bg-white dark:bg-[#121832] rounded-[20px] p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Filter chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFilterInStock(!filterInStock)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                      filterInStock
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    In stock {filterInStock && '✓'}
                  </button>

                  <button
                    onClick={() => setFilterFreeShipping(!filterFreeShipping)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                      filterFreeShipping
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Free shipping {filterFreeShipping && '✓'}
                  </button>

                  <button
                    onClick={() => setFilterVerified(!filterVerified)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                      filterVerified
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Verified sellers {filterVerified && '✓'}
                  </button>
                </div>

                {/* Sort Dropdown + Grid/List Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="lowest">Lowest price</option>
                      <option value="highest">Highest price</option>
                      <option value="rating">Store rating</option>
                      <option value="shipping">Shipping cost</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Grid / List Switcher */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* STORE OFFERS LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Available Offers ({filteredOffers.length})
                  </h3>
                  <span className="text-xs text-slate-500">Live prices verified</span>
                </div>

                {filteredOffers.length === 0 ? (
                  <div className="p-8 rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                      No offers match your selected filters.
                    </p>
                    <button
                      onClick={() => {
                        setFilterInStock(false);
                        setFilterFreeShipping(false);
                        setFilterVerified(false);
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                        : 'space-y-3'
                    }
                  >
                    {filteredOffers.map((offer) => (
                      <StoreCard
                        key={offer.id}
                        offer={offer}
                        layout={viewMode}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* PRICE HISTORY CHART */}
              <PriceChart productId={product.id} />
            </div>

            {/* Right 4 columns: Sticky Desktop Track Card */}
            <div className="hidden lg:block lg:col-span-4">
              <TrackForm
                productId={product.id}
                currentLowestPrice={lowestPrice}
                onSuccess={handleTrackingSuccess}
                onOpenEmailPreview={() => setEmailPreviewOpen(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM BAR (max 15% mobile viewport constraint) */}
      {!loading && product && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Lowest Price</span>
            <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              ${lowestPrice.toFixed(2)}
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setMobileTrackDrawerOpen(true)}
            leftIcon={<Bell className="w-4 h-4" />}
            className="flex-1 max-w-xs shadow-md"
          >
            Track price drops
          </Button>
        </div>
      )}

      {/* MOBILE TRACK DRAWER MODAL */}
      <Modal
        isOpen={mobileTrackDrawerOpen}
        onClose={() => setMobileTrackDrawerOpen(false)}
        title="Set Price Drop Alert"
      >
        {product && (
          <TrackForm
            productId={product.id}
            currentLowestPrice={lowestPrice}
            onSuccess={handleTrackingSuccess}
            onOpenEmailPreview={() => {
              setMobileTrackDrawerOpen(false);
              setEmailPreviewOpen(true);
            }}
          />
        )}
      </Modal>

      {/* SUCCESS MODAL WITH GSAP CONFETTI BURST */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        email={trackedEmail}
        onOpenEmailPreview={() => setEmailPreviewOpen(true)}
      />

      {/* EMAIL PREVIEW MODAL */}
      <Modal
        isOpen={emailPreviewOpen}
        onClose={() => setEmailPreviewOpen(false)}
        maxWidth="2xl"
        title="Mock Alert Email Preview"
        description="This is exactly what your price drop alert email looks like."
      >
        {product && bestOffer && (
          <EmailPreview
            product={product}
            offer={bestOffer}
            email={trackedEmail || 'shopper@example.com'}
          />
        )}
      </Modal>
    </div>
  );
};
