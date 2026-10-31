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
    url: 'https://example.com/product/sony-wh-1000xm5-headphones',
  },
  {
    name: 'iPhone 15 Pro',
    url: 'https://example.com/product/iphone-15-pro-titanium',
  },
  {
    name: 'PS5 Slim Console',
    url: 'https://example.com/product/playstation-5-slim-console',
  },
];

const COVERAGE_POINTS = [
  { title: 'Across the internet', desc: 'We look for the same product wherever it is listed online.' },
  { title: 'Best available sources', desc: 'Results prioritize trusted marketplaces and high-quality sellers.' },
  { title: 'Live price radar', desc: 'Keep watching after you track — get notified when prices move.' },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Product Matching',
    desc: 'Extracts exact specs, model identifiers, and variants even when listings use completely different titles.',
  },
  {
    icon: Store,
    title: 'Internet-wide comparison',
    desc: 'Finds your product across the open web and surfaces the best prices from strong available sources.',
  },
  {
    icon: LineChart,
    title: 'Price History Charts',
    desc: 'Interactive price trajectories with lowest points, market averages, and trend context over time.',
  },
  {
    icon: Bell,
    title: 'Instant Email Alerts',
    desc: 'Receive notifications the moment a tracked product drops in price.',
  },
  {
    icon: TrendingDown,
    title: 'Target Price Triggers',
    desc: 'Set a budget threshold and only get contacted when the item dips into your range.',
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
    a: 'Paste any product URL from the web. Our AI parsing engine extracts the model, specs, and variants, then searches trusted online sources to locate matching offers and compare live prices.',
  },
  {
    q: 'Where do you find prices?',
    a: 'PriceRadar looks across the internet and prioritizes the best available resources — marketplaces, official listings, and verified sellers — so you can see a clear picture without hunting store by store.',
  },
  {
    q: 'Is PriceRadar really free?',
    a: 'Yes, free for shoppers. No credit card required. PriceRadar is a project by the Fixend team, built to demonstrate smart product experiences.',
  },
  {
    q: 'Can I track refurbished or open-box deals?',
    a: 'Yes. Results can distinguish between new, refurbished, and marketplace listings, and show seller context alongside each offer.',
  },
  {
    q: 'How do I stop receiving alert emails?',
    a: 'Every email includes a one-click unsubscribe link. You can also manage alerts from the dashboard at any time.',
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
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Decorative Background Animated Gradient Blobs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] sm:h-[650px] overflow-hidden -z-10">
        <div className="absolute top-8 left-[-10%] sm:left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#4F46E5] opacity-20 sm:opacity-15 blur-3xl animate-blob-a" />
        <div className="absolute top-24 right-[-15%] sm:right-1/4 w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full bg-[#7C3AED] opacity-20 sm:opacity-15 blur-3xl animate-blob-b" />
        <div className="absolute top-40 left-1/3 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-[#06B6D4] opacity-15 sm:opacity-10 blur-3xl animate-blob-a" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#F8FAFC] dark:to-[#0B1020]" />
      </div>

      {/* HERO SECTION */}
      <section className="hero-min-height relative flex flex-col justify-center pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Copy + form */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-200 backdrop-blur">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">✨</span>
                <span className="truncate">AI finds the best price across the internet</span>
              </div>

              <h1
                ref={headlineRef}
                className="text-[1.85rem] leading-[1.15] xs:text-4xl sm:text-5xl md:text-[3.4rem] lg:text-[3.6rem] font-bold tracking-tight text-slate-900 dark:text-white sm:leading-[1.1]"
                style={{ textWrap: 'balance' }}
              >
                Never overpay again. Paste a link, we&apos;ll find the best price.
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                PriceRadar searches the open web for your product, compares live offers from the best available sources, and emails you when the price changes.
              </p>

              <div ref={heroCardRef} className="relative w-full max-w-xl mx-auto lg:mx-0 pt-1">
                <div className="p-2.5 sm:p-3.5 rounded-[18px] sm:rounded-[22px] bg-white/95 dark:bg-[#121832]/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-indigo-500/10 backdrop-blur">
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
                    <div className="relative flex-1 flex items-center min-w-0">
                      <div className="absolute left-3 sm:left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                        <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <input
                        id="hero-product-input"
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          if (urlError) setUrlError('');
                        }}
                        placeholder="Paste any product link…"
                        className={`w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-[4.5rem] sm:pr-24 rounded-[12px] sm:rounded-[14px] bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                          urlError
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-200 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handlePaste}
                        className="absolute right-1.5 sm:right-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
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
                      className="h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-7 text-sm font-bold shadow-lg shadow-indigo-500/30 shrink-0"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Find prices
                    </Button>
                  </form>

                  {urlError && (
                    <div className="pt-2 text-left px-2 text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1.5 animate-in fade-in">
                      <span>⚠️</span>
                      <span>{urlError}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium w-full sm:w-auto text-center lg:text-left">Try:</span>
                  {DEMO_LINKS.map((demo) => (
                    <button
                      key={demo.name}
                      onClick={() => handleDemoClick(demo.url)}
                      className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium transition-all hover:border-indigo-500 hover:text-indigo-600 cursor-pointer shadow-sm"
                    >
                      {demo.name}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 pt-3 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Free forever</span>
                  <span className="hidden xs:inline">·</span>
                  <span>No credit card</span>
                  <span className="hidden xs:inline">·</span>
                  <span>by Fixend</span>
                </div>
              </div>
            </div>

            {/* Visual panel — stacked on mobile, side on desktop */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="rounded-[24px] sm:rounded-[28px] bg-slate-900 dark:bg-[#070B18] border border-slate-800 p-4 sm:p-5 shadow-2xl shadow-indigo-500/20 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Live preview</p>
                        <p className="text-sm sm:text-base font-bold text-white">Best price found</p>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold shrink-0">
                        -18%
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-800/70 border border-slate-700/60 p-4 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 truncate">Sony WH-1000XM5</p>
                        <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">$328.00</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Top available source</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-500 line-through">$399.99</p>
                        <p className="text-xs font-semibold text-slate-300">You save $71.99</p>
                      </div>
                    </div>

                    <div
                      ref={floatingCardRef}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 dark:bg-[#121832] border border-slate-200/20 dark:border-slate-700 text-left shadow-lg"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                            Price Drop
                          </span>
                          <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          Alert ready · track this product
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Sources', value: 'Web' },
                        { label: 'Check', value: '15m' },
                        { label: 'Alerts', value: 'Email' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl bg-slate-800/50 border border-slate-700/50 px-2 py-2.5 text-center"
                        >
                          <p className="text-[10px] text-slate-400">{item.label}</p>
                          <p className="text-xs font-bold text-white mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COVERAGE STRIP */}
      <section id="coverage" className="py-10 sm:py-12 border-y border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Built for smarter shopping
            </p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white px-1" style={{ textWrap: 'balance' }}>
              We find product prices available across the internet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              No need to check every marketplace yourself — PriceRadar pulls from the best resources it can find and keeps watching for drops.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {COVERAGE_POINTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 px-5 py-4 shadow-sm"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3 steps) */}
      <section id="how-it-works" className="py-14 sm:py-20 px-4 sm:px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Effortless 3-Step Process
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            How PriceRadar saves you money
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No browser extensions required. Paste a link and let AI search the best sources online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: '1',
              title: 'Paste a link',
              desc: 'Drop in any product URL. Our AI identifies the exact item, model, and specs.',
              icon: Link2,
            },
            {
              num: '2',
              title: 'Compare the web',
              desc: 'We search across the internet and surface live prices from the best available resources.',
              icon: Search,
            },
            {
              num: '3',
              title: 'Get alerted',
              desc: 'Enter your email. We notify you the moment a tracked product drops in price.',
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
      <section ref={previewSectionRef} className="py-12 sm:py-16 px-4 sm:px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="rounded-[20px] sm:rounded-[24px] bg-slate-900 dark:bg-[#070B18] p-4 sm:p-6 md:p-10 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          
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
                  <p className="text-[11px] text-slate-400">Best available source</p>
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
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Built for Smart Shoppers
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Everything you need to catch every deal
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Intelligent features engineered to help you catch real drops from the best sources online.
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

      {/* ABOUT FIXEND */}
      <section id="about" className="py-14 sm:py-20 px-4 sm:px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#121832] border border-slate-200 dark:border-slate-800 shadow-radar overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-6 sm:p-10 lg:p-12 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                About
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                A project by the Fixend team
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                PriceRadar is built by <span className="font-semibold text-slate-900 dark:text-white">Fixend</span> —
                our agency focused on development services. We design and ship modern web products, dashboards,
                and digital experiences for clients who need reliable engineering with strong product craft.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                From product strategy to polished interfaces and scalable frontends, Fixend helps teams turn ideas
                into production-ready software.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Web development', 'Product UI', 'Dashboards', 'Custom software'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-radar-gradient p-6 sm:p-10 lg:p-12 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
              <div className="relative space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">Fixend</p>
                <h4 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                  Development services that move products forward
                </h4>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  We partner with startups and growing businesses to build websites, apps, and internal tools —
                  with the same attention to detail you see in PriceRadar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION (5 questions) */}
      <section id="faq" className="py-14 sm:py-20 px-4 sm:px-6 max-w-[900px] mx-auto scroll-fade-up">
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Got Questions?
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
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
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-[1200px] mx-auto scroll-fade-up">
        <div className="rounded-[22px] sm:rounded-[28px] bg-radar-gradient p-6 sm:p-10 md:p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
              Ready to catch the next price drop?
            </h3>
            <p className="text-sm sm:text-base text-indigo-100 max-w-lg mx-auto leading-relaxed">
              Paste a link in seconds and never miss a sudden discount from the best sources across the internet.
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
              Free forever · Create an account to save trackers · Cancel anytime
            </p>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-xs font-semibold text-white/90 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Or create a free account →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
