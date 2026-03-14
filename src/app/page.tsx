'use client'

import Link from 'next/link';
import { toast } from 'sonner';
import CountUp from '@/components/ui/CountUp';
import { ArrowRight, Copy, TrendingUp, Zap, Shield, Globe, Check, Terminal, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Lightweight inline provider icons (replaces heavy @lobehub/icons barrel export)
const GoogleIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);
const AnthropicIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.257 0h3.603L16.74 20.48h-3.603L6.57 3.52zM6.57 3.52H3.603L10.173 20.48h3.603L6.57 3.52z" opacity="0.4" />
    <path d="M13.827 3.52L7.257 20.48h3.603l6.57-16.96h-3.603z" />
  </svg>
);
const OpenAIIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const featuredModels = [
  {
    name: 'Gemini 3.1 Pro',
    provider: 'Google DeepMind',
    Icon: GoogleIcon,
    tokensWk: '142.2B',
    latency: '842ms',
    change: '+12.4%',
    positive: true,
    isNew: true,
  },
  {
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    Icon: AnthropicIcon,
    tokensWk: '28.5B',
    latency: '1.2s',
    change: '+8.2%',
    positive: true,
    isNew: true,
  },
  {
    name: 'Gpt 5.3 Codex',
    provider: 'OpenAI',
    Icon: OpenAIIcon,
    tokensWk: '842.1B',
    latency: '2.1s',
    change: '+15.7%',
    positive: true,
    isNew: true,
  },
];

function RevealSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className || ''}`}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="animate-fade" style={{
        position: 'relative',
        paddingTop: '20px',
        paddingBottom: '60px',
      }}>
        <div className="hero-grid-bg" />

        <div className="hero-split flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 items-center max-w-[1200px] mx-auto px-6 w-full gap-12">

          {/* Left */}
          <div style={{ zIndex: 2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '8px',
              background: 'var(--bg-soft)',
              color: 'var(--text-muted)',
              marginBottom: '32px',
              border: '1px solid var(--border)',
              fontSize: '11px', fontWeight: '600', letterSpacing: '0.3px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
              Operational
            </div>

            <h1 className="text-[2.2rem] md:text-[3.2rem] lg:text-[3.8rem] text-foreground tracking-tight leading-[1.1] font-extrabold mb-6">
              The unified gateway{' '}
              <span className="text-muted-foreground font-bold">for machine intelligence.</span>
            </h1>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: '15px',
              lineHeight: '1.6',
              fontWeight: '400',
              maxWidth: '400px',
              marginBottom: '28px',
            }}>
              Access 150+ LLMs through a single endpoint. Route across OpenAI, Anthropic, Google, and more — no client changes needed.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/dashboard" className="btn-primary" style={{
                padding: '12px 28px',
                gap: '8px',
                fontSize: '14px',
              }}>
                Get started
                <ArrowRight size={15} strokeWidth={2} />
              </Link>

              <button
                className="btn-copy-endpoint"
                onClick={() => {
                  navigator.clipboard.writeText('api.frenix.sh/v1');
                  toast.success('Endpoint copied');
                }}
              >
                <span>api.frenix.sh/v1</span>
                <Copy size={13} strokeWidth={2} style={{ opacity: 0.4 }} />
              </button>
            </div>

            {/* Partner Logos */}
            <div className="mt-12 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Integrated with:</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <OpenAIIcon size={18} />
                  <span className="text-xs font-bold">OpenAI</span>
                </div>
                <div className="flex items-center gap-2">
                  <AnthropicIcon size={18} />
                  <span className="text-xs font-bold">Anthropic</span>
                </div>
                <div className="flex items-center gap-2">
                  <GoogleIcon size={18} />
                  <span className="text-xs font-bold">Google</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Featured Models */}
          <div className="w-full lg:z-[2]">
            <div className="flex justify-between items-baseline mb-5">
              <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Featured Models</span>
              <Link href="/dashboard" className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 whitespace-nowrap">
                View All <TrendingUp size={12} />
              </Link>
            </div>

            <div className="flex gap-4">
              {/* Bracket (Hidden on mobile for space) */}
              <div className="hidden sm:block w-[14px] shrink-0 relative">
                <svg width="14" height="100%" viewBox="0 0 14 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  <path d="M12 0 Q2 0, 2 12 L2 38 Q2 50, 0 50 Q2 50, 2 62 L2 88 Q2 100, 12 100" stroke="currentColor" className="text-white/10" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                {featuredModels.map((m, i) => (
                  <div
                    key={i}
                    className="group model-card p-4 md:p-5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-default"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                        <m.Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm md:text-base font-bold text-foreground truncate">{m.name}</span>
                          {m.isNew && (
                            <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">New</span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium">{m.provider}</span>
                      </div>
                      <span className={cn(
                        "text-xs md:text-sm font-bold tabular-nums",
                        m.positive ? "text-emerald-500" : "text-rose-500"
                      )}>{m.change}</span>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-[11px] md:text-xs font-bold uppercase tracking-widest">
                      <p className="text-muted-foreground/60">
                        <span className="text-foreground tracking-normal lowercase text-sm mr-1.5">{m.tokensWk}</span>
                        Tokens
                      </p>
                      <p className="text-muted-foreground/60">
                        <span className="text-foreground tracking-normal lowercase text-sm mr-1.5">{m.latency}</span>
                        Latency
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Features ──────────────────────────────────────────── */}
      <RevealSection>
        <section className="max-w-[1200px] mx-auto mb-24 px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-foreground">
              Why use an AI Gateway for your LLM infrastructure?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Managing multiple API keys, provider SDKs, and error handling for 150+ models is a massive technical debt. Frenix unifies this into a single, high-performance orchestration layer.
            </p>
          </div>

          <div className="feature-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-8 md:p-12 lg:p-14 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col justify-between min-h-[450px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                  <Zap size={22} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground tracking-tight">
                  How does dynamic routing work?
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mb-10">
                  Frenix uses a latency-aware load balancer that continuously pings upstream providers. When you request a model like <span className="text-primary font-bold">gpt-4o</span>, we route it to the fastest available region, providing sub-40ms overhead while ensuring 99.9% availability.
                </p>
              </div>

              <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-mono text-[11px] md:text-xs text-muted-foreground/80 overflow-hidden">
                <div className="opacity-50 mb-1"># Unified endpoint</div>
                <div><span className="text-primary">curl</span> -X POST api.frenix.sh/v1/chat/completions \</div>
                <div>&nbsp; -H <span className="text-emerald-400/80">&quot;Authorization: Bearer sk-frenix-...&quot;</span> \</div>
                <div>&nbsp; -d <span className="text-emerald-400/80">&apos;{`{"model":"gpt-4o","messages":[...]}`}&apos;</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield size={18} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground tracking-tight">GitHub OAuth</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Authenticate with GitHub in seconds. Secure token management, zero configuration.
                </p>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe size={18} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground tracking-tight">Universal API</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  One token, every model. Drop-in replacement for direct provider calls.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <RevealSection delay={80}>
        <div className="max-w-[1200px] mx-auto mb-24 px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 border-y border-white/5">
            {[
              { num: 99.7, suffix: "%", label: "Uptime SLA" },
              { num: 38, prefix: "<", suffix: "ms", label: "Avg latency" },
              { num: 150, suffix: "+", label: "Models supported" },
            ].map((s, i) => (
              <div key={i} className="py-12 md:py-16 text-center group transition-colors hover:bg-white/[0.01]">
                <div className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground tabular-nums mb-3">
                  {s.prefix}<CountUp to={s.num} duration={2} separator="." />{s.suffix}
                </div>
                <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <RevealSection>
        <section id="pricing" className="max-w-[1200px] mx-auto mb-24 px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
              Pricing
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Start free. Scale when you need to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 px-3 py-1 bg-white/5 rounded-md self-start">Free</span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter">$<CountUp to={0} duration={1} /></span>
                <span className="text-muted-foreground text-sm font-medium">/mo</span>
              </div>
              <p className="text-muted-foreground/60 text-sm md:text-base mb-10 leading-relaxed">For hobbyists and side projects.</p>

              <div className="flex-1 space-y-4 mb-12">
                {["10 requests/minute", "All community models", "Standard latency", "Discord support"].map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3 text-sm font-medium text-foreground opacity-90">
                    <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-emerald-500" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/signin" className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm tracking-wide hover:bg-white/10 transition-colors">
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 md:p-12 bg-white/[0.03] border border-white/10 rounded-3xl flex flex-col relative overflow-hidden group">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 px-3 py-1 bg-white/5 rounded-md self-start">Developer Pro</span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white font-black">$<CountUp to={10} duration={2} /></span>
                <span className="text-muted-foreground text-sm font-medium">/mo</span>
              </div>
              <p className="text-muted-foreground/60 text-sm md:text-base mb-10 leading-relaxed">For scaling apps and professional developers.</p>

              <div className="flex-1 space-y-4 mb-12">
                {["20 requests/minute", "Unlimited keys", "Priority latency", "Privacy-first logs", "Dedicated support"].map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3 text-sm font-medium text-foreground opacity-90">
                    <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-emerald-500" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/signin" className="w-full h-14 rounded-2xl bg-primary text-black flex items-center justify-center font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all">
                Upgrade Now
              </Link>
            </div>

            {/* Team */}
            <div className="p-8 md:p-12 bg-white rounded-[40px] flex flex-col relative overflow-hidden group border-[6px] border-primary/20">
               <div className="absolute top-8 right-8 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-black/5 rounded-md text-black/60">High Value</div>

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-6">Team Bot</span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter text-black">$<CountUp to={49} duration={2} /></span>
                <span className="text-black/40 text-sm font-medium">/mo</span>
              </div>
              <p className="text-black/60 text-sm md:text-base mb-10 leading-relaxed">Built for AI agents and automated workflows requiring high-performance model orchestration.</p>

              <div className="flex-1 space-y-4 mb-12 relative">
                {["All Models Access*", "Shared Workspace", "Team Identity Logs", "XOR Payload Security", "24/7 Priority Channel"].map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3 text-sm font-bold text-black/80">
                    <div className="size-5 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-black" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
                <p className="text-[9px] text-black/30 font-bold italic mt-2 uppercase tracking-tight">*Excludes Opus & Gemini 3.1 Pro</p>
              </div>

              <Link href="/signin" className="w-full h-14 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm tracking-widest uppercase hover:bg-black/90 transition-all">
                Join Team
              </Link>
            </div>
          </div>

          {/* Enterprise */}
          <div className="mt-6 p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="text-lg font-bold text-foreground mb-2 block">Enterprise</span>
              <p className="text-muted-foreground text-sm max-w-lg leading-relaxed opacity-80">
                Custom quotas, private deployments, and white-glove support for mission-critical apps.
              </p>
            </div>
            <Link href="/signin" className="h-12 px-8 rounded-xl border border-white/10 flex items-center justify-center font-bold text-sm hover:bg-white/5 transition-colors shrink-0 whitespace-nowrap">
              Contact Sales <ArrowUpRight size={16} className="ml-2" />
            </Link>
          </div>
          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '12px' }}>
            Prices in USD. By subscribing you agree to our <Link href="/about" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>About Us</Link>, <Link href="/terms" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms</Link> and <Link href="/refund" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Refund Policy</Link>.
          </p>
        </section>
      </RevealSection>

      {/* ── Conversational FAQ (AI Search Optimization) ──────────────── */}
      <RevealSection>
        <section className="max-w-[1200px] mx-auto mb-24 px-6 py-16 border-t border-white/5">
          <div className="mb-14 text-center">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-foreground/80 mb-4 italic">Common Questions</h2>
            <p className="text-muted-foreground/60 text-sm font-medium">Everything you need to know about the Frenix V2 Infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Can I use Frenix as a backup for OpenAI?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   Absolutely. Many of our users use Frenix as their primary endpoint with OpenAI as the default model. If OpenAI experiences a regional outage, our gateway can automatically failover to a comparable model (like Claude 3.5 Sonnet or Gemini 1.5 Pro) without you needing to update a single line of code.
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">What is the security protocol for my payload?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   Frenix implements a zero-retention policy for your data. Your requests are proxied directly to the upstream providers via an encrypted TLS tunnel. We only store anonymized metadata (tokens used, latency, and status) to provide you with comprehensive observability and billing.
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Are there any hidden costs?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   No. We pass through the raw provider costs directly. Our revenue comes from our tiered subscription model for features like priority latency and advanced analytics, not by marking up your token consumption.
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">How do I integrate Frenix into my existing app?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   Integration takes less than 30 seconds. In your OpenAI client library, simply replace the `baseURL` with `https://api.frenix.sh/v1` and use your Frenix API key. Everything else — from chat parameters to response streaming — remains identical.
                </p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <RevealSection>
        <section className="max-w-[1200px] mx-auto mb-20 px-6">
          <div className="px-8 md:px-16 py-16 md:py-20 bg-white text-black rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
            <div className="text-center lg:text-left relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-[1.1] !text-black">
                Ship faster with one unified API.
              </h2>
              <p className="!text-black/60 text-sm md:text-lg font-medium leading-relaxed max-w-md">
                Stop managing multiple provider SDKs. Swap your base URL to Frenix and get access to every model from a single key.
              </p>
              
              <div className="mt-8 flex items-center gap-4 border-t border-black/5 pt-8">
                 <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-black text-[10px] text-black/40">FT</div>
                 <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">Frenix Engineering</span>
                    <span className="text-[10px] font-bold text-black/40 uppercase mt-1">Infrastructure Authority</span>
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
              <Link href="/dashboard" className="h-14 px-10 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                Get started <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link href="/docs" className="h-14 px-8 border border-black/10 rounded-2xl flex items-center justify-center font-bold text-sm hover:bg-black/5 transition-colors">
                <Terminal size={18} className="mr-2" /> Docs
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
