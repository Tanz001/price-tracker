import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Link2,
  Clipboard,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Search,
  Bell,
  LineChart,
  Shield,
  Zap,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Store,
  Layers,
  Flame,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

gsap.registerPlugin(ScrollTrigger);

const DEMO_LINKS = [
  {
    name: 'Sony WH-1000XM5',
    url: 'https://www.amazon.com/dp/B09XS7JWHH/sony-wh-1000xm5-headphones',
  },
  {
    name: 'iPhone 15 Pro',
    url: 'https://www.apple.com/shop/buy-iphone/iphone-15-pro-titanium',
  },
  {
    name: 'PS5 Slim Console',
    url: 'https://www.bestbuy.com/site/sony-playstation-5-slim-console/6564750.p',
  },
];

const STORE_LIST = [
  { name: 'Amazon', color: 'from-amber-500/10 to-amber-500/20', domain: 'amazon.com' },
  { name: 'Walmart', color: 'from-blue-500/10 to-blue-500/20', domain: 'walmart.com' },
  { name: 'Best Buy', color: 'from-yellow-500/10 to-yellow-500/20', domain: 'bestbuy.com' },
  { name: 'Daraz', color: 'from-orange-500/10 to-orange-500/20', domain: 'daraz.pk' },
  { name: 'AliExpress', color: 'from-red-500/10 to-red-500/20', domain: 'aliexpress.com' },
  { name: 'eBay', color: 'from-emerald-500/10 to-emerald-500/20', domain: 'ebay.com' },
  { name: 'Target', color: 'from-rose-500/10 to-rose-500/20', domain: 'target.com' },
  { name: 'Flipkart', color: 'from-blue-600/10 to-blue-600/20', domain: 'flipkart.com' },
  { name: 'Newegg', color: 'from-orange-600/10 to-orange-600/20', domain: 'newegg.com' },
  { name: 'Etsy', color: 'from-amber-600/10 to-amber-600/20', domain: 'etsy.com' },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Product Matching',
    desc: 'Extracts exact specs, model identifiers, and variants even when retailers use completely different titles.',
  },
  {
    icon: Store,
    title: 'Multi-Store Comparison',
    desc: 'Scans 100+ authorized retailers, marketplace merchants, and verified sellers side by side in real time.',
  },
  {
    icon: LineChart,
    title: 'Price History Charts',
    desc: 'Interactive 365-day price trajectories with lowest ever, market averages, and seasonal discount indicators.',
  },
  {
    icon: Bell,
    title: 'Instant Email Alerts',
    desc: 'Receive immediate notifications the moment any store drops prices, before stock runs out.',
  },
  {
    icon: TrendingDown,
    title: 'Target Price Triggers',
    desc: 'Set custom price thresholds so you are only contacted when an item dips inside your personal budget.',
  },
  {
    icon: Shield,
    title: 'One-Click Unsubscribe',
    desc: 'Zero clutter. Pause alerts or unsubscribe completely with a single click at any time.',
  },
];

const FAQS = [
  {
    q: 'How does PriceRadar identify products from any link?',
    a: 'When you paste a product URL from Amazon, Daraz, eBay, Walmart, or any retail site, our AI parsing engine extracts the manufacturer model number, UPC/EAN barcodes, specs, and exact variants to query our multi-store database and locate identical items across every competitor.',
  },
  {
    q: 'How often do you check store prices?',
    a: 'We monitor prices every 15 minutes across verified retailers. As soon as a price reduction, coupon, or flash sale is registered, our radar dispatches an alert email to your inbox.',
  },
  {
    q: 'Is PriceRadar really free?',
    a: 'Yes, 100% free forever for shoppers. We do not require credit cards, and we never sell your email to advertisers. When you click "Visit Store" to purchase a deal, we may receive a small affiliate commission from select stores at zero extra cost to you.',
  },
  {
    q: 'Can I track refurbished or open-box deals?',
    a: 'Yes. Our retailer results clearly distinguish between Brand New, Certified Refurbished, and marketplace listings, and show warranty and seller ratings alongside each offer.',
  },
  {
    q: 'How do I stop receiving alert emails?',
    a: 'Every single email contains a direct one-click unsubscribe link. You can also visit our Unsubscribe page or dashboard at any time to toggle notifications or delete active trackers.',
  },
];

export const LandingPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [shakeInput, setShakeInput] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 1. Hero headline split by words
    if (headlineRef.current) {
      const text = headlineRef.current.innerText;
      const words = text.split(' ');
      headlineRef.current.innerHTML = words
        .map((w) => `<span class="inline-block overflow-hidden"><span class="inline-block hero-word">${w}&nbsp;</span></span>`)
        .join('');

      gsap.fromTo(
        headlineRef.current.querySelectorAll('.hero-word'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power4.out',
        }
      );
    }

    // 2. Hero input card animation
    if (heroCardRef.current) {
      gsap.fromTo(
        heroCardRef.current,
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.4)',
          delay: 0.4,
        }
      );
    }

    // 3. Floating mock price drop notification gentle oscillation
    if (floatingCardRef.current) {
      gsap.to(floatingCardRef.current, {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // 4. Scroll trigger animations for sections
    const scrollSections = document.querySelectorAll('.scroll-fade-up');
    scrollSections.forEach((sec) => {
      gsap.fromTo(
        sec,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const validateUrl = (testUrl: string): boolean => {
    try {
      const parsed = new URL(testUrl);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed || !validateUrl(trimmed)) {
      setUrlError("That doesn't look like a valid product link");
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      return;
    }

    setUrlError('');
    navigate(`/results?url=${encodeURIComponent(trimmed)}`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        if (urlError) setUrlError('');
        addToast({
          type: 'info',
          message: 'Pasted URL from clipboard',
        });
      }
    } catch (e) {
      addToast({
        type: 'info',
        message: 'Clipboard access not allowed. Please paste manually.',
      });
    }
  };

  const handleDemoClick = (demoUrl: string) => {
    setUrl(demoUrl);
    setUrlError('');
    navigate(`/results?url=${encodeURIComponent(demoUrl)}`);
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Decorative Background Animated Gradient Blobs */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#4F46E5] opacity-15 blur-3xl animate-blob-a" />
        <div className="absolute top-32 right-1/4 w-[420px] h-[420px] rounded-full bg-[#7C3AED] opacity-15 blur-3xl animate-blob-b" />
        <div className="absolute top-48 left-1/3 w-80 h-80 rounded-full bg-[#06B6D4] opacity-10 blur-3xl animate-blob-a" />
      </div>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 max-w-[1200px] mx-auto text-center relative">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Pill Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-200">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">✨</span>
            <span>AI finds the best price across 100+ stores</span>
          </div>

          {/* H1 Headline */}
          <h1
            ref={headlineRef}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
            style={{ textWrap: 'balance' }}
          >
            Never overpay again. Paste a link, we'll track every store.
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            PriceRadar finds your product on every website that sells it, compares prices live, and emails you the moment the price changes.
          </p>

          {/* Main Floating Input Card */}
          <div
            ref={heroCardRef}
            className="pt-2 relative max-w-2xl mx-auto"
          >
            <div className="p-3 sm:p-3.5 rounded-[20px] bg-white dark:bg-[#121832] border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-indigo-500/10">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 flex items-center">
                  <div className="absolute left-4 text-slate-400 dark:text-slate-500">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <input
                    id="hero-product-input"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError('');
                    }}
                    placeholder="Paste a product link (Amazon, Daraz, eBay…)"
                    className={`w-full h-13 pl-12 pr-20 rounded-[14px] bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      urlError
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  magnetic
                  className="h-13 px-7 text-sm font-bold shadow-lg shadow-indigo-500/30"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Find prices
                </Button>
              </form>

              {/* Inline Error with shake animation */}
              {urlError && (
                <div className="pt-2 text-left pl-3 text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1.5 animate-in fade-in">
                  <span>⚠️</span>
                  <span>{urlError}</span>
                </div>
              )}
            </div>

            {/* Example Quick-Pick Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Try:</span>
              {DEMO_LINKS.map((demo) => (
                <button
                  key={demo.name}
                  onClick={() => handleDemoClick(demo.url)}
                  className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all hover:border-indigo-500 hover:text-indigo-600 cursor-pointer shadow-sm"
                >
                  {demo.name}
                </button>
              ))}
            </div>

            {/* Trust Row */}
            <div className="flex items-center justify-center gap-4 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Free forever</span>
              <span>·</span>
              <span>No credit card</span>
              <span>·</span>
              <span>Unsubscribe anytime</span>
            </div>
          </div>
        </div>

        {/* Floating Mock Notification Card */}
        <div
          ref={floatingCardRef}
          className="hidden lg:flex items-center gap-3 absolute top-36 right-8 p-3.5 rounded-2xl bg-white/95 dark:bg-[#121832]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl max-w-xs text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Price Drop
              </span>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              Sony WH-1000XM5: $328.00
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dropped 18% on Walmart
            </p>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTED STORES MARQUEE */}
      <section id="supported-stores" className="py-10 border-y border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 mb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Monitoring inventory & live prices across top global retailers
          </p>
        </div>

        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div className="flex items-center gap-4 animate-marquee py-2">
            {[...STORE_LIST, ...STORE_LIST].map((store, i) => (
              <div
                key={`${store.name}-${i}`}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 hover:border-indigo-400 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-radar-gradient flex items-center justify-center text-[10px] font-bold text-white">
                  {store.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {store.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {store.domain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3 steps) */}
      <section id="how-it-works" className="py-20 px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Effortless 3-Step Process
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            How PriceRadar saves you money
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No browser extensions to install, no passwords to create. Just paste a link and let our AI do the heavy lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: '1',
              title: 'Paste a link',
              desc: 'Drop in any product URL. Our AI identifies the exact item, manufacturer code, and specs.',
              icon: Link2,
            },
            {
              num: '2',
              title: 'Compare every store',
              desc: 'We scan the web and list every seller with live prices, shipping terms, and stock status.',
              icon: Search,
            },
            {
              num: '3',
              title: 'Get alerted',
              desc: 'Enter your email. We notify you the moment any verified store drops its price.',
              icon: Bell,
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-[20px] p-8 bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar hover:shadow-radar-hover transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-300 dark:text-slate-700">
                    0{step.num}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LIVE DEMO PREVIEW (Mock card showing the experience) */}
      <section ref={previewSectionRef} className="py-16 px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="rounded-[24px] bg-slate-900 dark:bg-[#070B18] p-6 sm:p-10 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Live Radar Simulation</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  See what happens when you paste a link
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoClick(DEMO_LINKS[0].url)}
                className="text-white border-slate-700 hover:bg-slate-800 self-start sm:self-auto"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Inspect Live Results
              </Button>
            </div>

            {/* Mock results row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Lowest Detected</p>
                  <p className="text-2xl font-mono font-bold text-emerald-400">$328.00</p>
                  <p className="text-[11px] text-slate-400">Walmart (Free 2-day)</p>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  -18% Drop
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Competitor Price</p>
                  <p className="text-2xl font-mono font-bold text-slate-200">$399.99</p>
                  <p className="text-[11px] text-slate-400">Original Retail</p>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs font-medium">
                  Standard
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-400">Immediate Savings</p>
                  <p className="text-2xl font-mono font-bold text-emerald-300">$71.99</p>
                  <p className="text-[11px] text-emerald-400/80">In your pocket</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURE GRID (6 cards) */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Built for Smart Shoppers
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Everything you need to catch every deal
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Intelligent features engineered to beat algorithmic retailer price hikes and flash discount windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-[20px] p-6 bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FAQ ACCORDION (5 questions) */}
      <section id="faq" className="py-20 px-6 max-w-[900px] mx-auto scroll-fade-up">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Got Questions?
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about our product tracking and radar alerts.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL CTA BANNER WITH ACCENT GRADIENT */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="rounded-[28px] bg-radar-gradient p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
              Ready to catch the next price drop?
            </h3>
            <p className="text-sm sm:text-base text-indigo-100 max-w-lg mx-auto leading-relaxed">
              Paste a link in seconds and never miss a sudden discount across Amazon, Walmart, Best Buy, and 100+ stores.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  const input = document.getElementById('hero-product-input');
                  if (input) input.focus();
                }}
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-bold w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start tracking for free
              </Button>
            </div>
            <p className="text-xs text-indigo-200 pt-2">
              No account setup required · 100% free · Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
