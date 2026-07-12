'use client'

import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, Copy, Terminal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ClickSpark from '@/components/ui/ClickSpark';
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Claude, DeepSeek, Exa, Grok, Meta, OpenAI, Google } from '@lobehub/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Particles from "@/components/ui/Particles";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import dynamic from 'next/dynamic';
import WhatsNewPopup from '@/components/ui/WhatsNewPopup';
import { motion, AnimatePresence } from 'framer-motion';

const RiveIllustration = dynamic(() => import('@/components/ui/RiveIllustration'), { ssr: false });

const UserIcon = ({ size = 17, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);


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

const SWITCHER_MODELS = ['"claude-3-5-sonnet"', '"gpt-4o"', '"gemini-1.5-pro"', '"deepseek-coder"'];

const ModelSwitcherCode = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SWITCHER_MODELS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="text-emerald-400 font-semibold inline-block"
    >
      {SWITCHER_MODELS[index]}
    </motion.span>
  );
};

const FailoverRouteVisual = () => {
  const [activeRoute, setActiveRoute] = useState<'primary' | 'fallback'>('primary');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRoute((prev) => (prev === 'primary' ? 'fallback' : 'primary'));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[280px] h-[180px] bg-zinc-950 rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between scale-90 sm:scale-100 shadow-xl">
      {/* Top Client Node */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400">
            <UserIcon size={16} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">API Request</span>
            <span className="text-[8px] text-zinc-500 font-mono">POST /v1/chat</span>
          </div>
        </div>
        <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
      </div>

      {/* Connection Lines & Gateway */}
      <div className="relative flex-1 flex items-center justify-center my-2">
        {/* Animated paths using SVG */}
        <svg className="absolute inset-0 size-full pointer-events-none" viewBox="0 0 240 60" fill="none">
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -20;
              }
            }
          `}</style>
          {/* Primary Route Path */}
          <path
            d="M 20 10 Q 120 -15 220 10"
            stroke={activeRoute === 'primary' ? '#10b981' : '#ef4444'}
            strokeWidth="2"
            strokeDasharray={activeRoute === 'primary' ? '4 4' : 'none'}
            style={{ animation: activeRoute === 'primary' ? 'dash 1.5s linear infinite' : 'none' }}
          />
          {/* Fallback Route Path */}
          <path
            d="M 20 30 Q 120 55 220 30"
            stroke={activeRoute === 'fallback' ? '#10b981' : '#27272a'}
            strokeWidth="2"
            strokeDasharray={activeRoute === 'fallback' ? '4 4' : 'none'}
            style={{ animation: activeRoute === 'fallback' ? 'dash 1.5s linear infinite' : 'none' }}
          />
        </svg>

        {/* Central Overlay badge */}
        <div className="z-10 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono text-zinc-500">
          Proxy Gateway
        </div>
      </div>

      {/* Target Nodes */}
      <div className="flex justify-between items-center border-t border-zinc-900 pt-3">
        <div className="flex items-center gap-1.5 text-left">
          <div className={`size-1.5 rounded-full transition-colors duration-500 ${activeRoute === 'primary' ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-rose-950'}`} />
          <span className={`text-[9px] font-mono transition-colors duration-500 ${activeRoute === 'primary' ? 'text-zinc-400 font-bold' : 'text-zinc-650'}`}>
            OpenAI (Outage)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-left">
          <div className={`size-1.5 rounded-full transition-colors duration-500 ${activeRoute === 'fallback' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-800'}`} />
          <span className={`text-[9px] font-mono transition-colors duration-500 ${activeRoute === 'fallback' ? 'text-white font-bold' : 'text-zinc-650'}`}>
            Anthropic (Backup)
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="relative">
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      />

      {/* Dismissible "What's New" corner popup — fires once per version on load */}
      <WhatsNewPopup />

      {/* ── Dark Sections Wrapper ── */}
      <div className="relative">
        {/* Dark Horizon Glow & Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="sticky top-0 w-full h-screen z-[-10]"
            style={{
              background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
            }}
          />
          <div className="absolute inset-0 z-[-5]">
            <Particles
              particleColors={["#ffffff", "#3b82f6", "#2dd4bf"]}
              particleCount={180}
              particleSpread={12}
              speed={0.04}
              particleBaseSize={70}
              moveParticlesOnHover={true}
              particleHoverFactor={0.3}
              alphaParticles={true}
              sizeRandomness={1.5}
              cameraDistance={22}
              disableRotation={false}
            />
          </div>
        </div>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="animate-fade flex flex-col items-center justify-center min-h-[95vh] relative pt-20 pb-20 z-10">
          <div className="hero-split flex flex-col items-center text-center max-w-[1200px] mx-auto px-4 sm:px-6 w-full gap-10 relative z-10">

            {/* Center Content */}
            <div className="flex flex-col items-center">
              <div className="mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 group hover:bg-white/10 transition-all cursor-default">
                <div className="size-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">1ms Proxy Overhead</span>
              </div>
              
              <h1 className="text-[1.3rem] sm:text-[2.2rem] md:text-[3.6rem] lg:text-[4.4rem] text-white tracking-tight leading-tight font-semibold mb-6 md:mb-8 uppercase text-center whitespace-nowrap">
                <DiaTextReveal
                  text="Your Unified AI Gateway"
                  duration={2}
                  textColor="#ffffff"
                  startOnView={true}
                />
              </h1>

              <p className="text-[13px] md:text-[17px] text-muted-foreground/60 leading-relaxed max-w-xl mx-auto mb-10 font-medium tracking-wide px-2">
                Access 150+ LLMs through a single endpoint with &lt;1ms routing overhead. Route across OpenAI, Anthropic, Google, and more — no client changes needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full sm:w-auto">
                <Link href="/dashboard" className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white text-black flex items-center justify-center font-bold text-[13px] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-white/5 group">
                  Get started
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </Link>

                <button
                  className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[13px] text-white/60 hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                  onClick={() => {
                    navigator.clipboard.writeText('api.frenix.sh/v1');
                    toast.success('Endpoint copied');
                  }}
                >
                  <span className="mr-3">api.frenix.sh/v1</span>
                  <Copy size={14} strokeWidth={2} style={{ opacity: 0.4 }} />
                </button>
              </div>

              {/* exa.ai — sole partner logo in hero */}
              <div className="mt-14 flex flex-col items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white font-semibold">Powered alongside</span>
                <a
                  href="https://exa.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-40 hover:opacity-90 transition-all duration-500 grayscale hover:grayscale-0 flex items-center gap-2"
                  aria-label="exa.ai"
                >
                  <Exa size={28} />
                  <span className="text-[13px] font-bold tracking-tight text-white">exa.ai</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── Why Frenix (Grid Layout Cards) ─────────────────── */}
        <RevealSection>
          <section className="max-w-[1200px] mx-auto pt-40 px-6 relative z-10">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-16 text-left uppercase italic" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Why Frenix?
            </h2>

            <div className="flex flex-col gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden min-h-[420px] group">
                {/* Left Column (Light Graphic) */}
                <div className="bg-[#f4f4f3] flex items-center justify-center p-8 relative overflow-hidden h-[300px] md:h-auto">
                  {/* Central Frenix Icon / Node & Orbiting AI logos */}
                  <div className="relative size-48 flex items-center justify-center pointer-events-none scale-90 sm:scale-100">
                    <div className="absolute size-16 rounded-full bg-black flex items-center justify-center z-20 shadow-2xl border border-zinc-800">
                      <img src="/logo-withoutbg.png" alt="Frenix" className="size-9" />
                    </div>
                    <OrbitingCircles radius={68} duration={20} iconSize={20} className="border-black/5">
                      <OpenAI size={20} color="#000" />
                      <Claude size={18} color="#000" />
                      <Google size={20} color="#000" />
                    </OrbitingCircles>
                    <OrbitingCircles radius={100} duration={25} reverse iconSize={22} angleOffset={45} className="border-black/5">
                      <Meta size={22} color="#000" />
                      <Grok size={22} color="#000" />
                      <DeepSeek size={22} color="#000" />
                    </OrbitingCircles>
                  </div>
                </div>
                {/* Right Column (Text) */}
                <div className="bg-[#0c0c0c] p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-4 relative text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    One API Key, Unified Access to All Top AI Models
                  </h3>
                  <p className="text-[13px] md:text-sm text-zinc-400 leading-relaxed font-medium">
                    Stop juggling 20+ different API accounts, credentials, and SDK protocols. Frenix gives you one dashboard, one routing endpoint, and direct access to all leading LLMs from OpenAI, Anthropic, Google, DeepSeek, and others.
                  </p>
                  <p className="text-[13px] md:text-sm text-zinc-500 leading-relaxed font-medium">
                    Whether you are calling text generation, multimodal vision, or embedding models, every request is standardized into a single OpenAI-compatible protocol.
                  </p>
                  <div className="mt-4 flex items-center justify-center size-8 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden min-h-[420px] group">
                {/* Left Column (Text) */}
                <div className="bg-[#0c0c0c] p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-4 order-2 md:order-1 relative text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    Instant Model Switching with Zero Code Refactors
                  </h3>
                  <p className="text-[13px] md:text-sm text-zinc-400 leading-relaxed font-medium">
                    Swap models and providers with a single line configuration update. Never rewrite your application&apos;s wrapper logic or redeploy services just to test a new model. Just update the model ID parameter in your REST request body.
                  </p>
                  <p className="text-[13px] md:text-sm text-zinc-500 leading-relaxed font-medium">
                    A/B test different LLMs on live production payloads to find the optimal balance between performance, accuracy, and latency.
                  </p>
                  <div className="mt-4 flex items-center justify-center size-8 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer">
                    <ArrowRight size={14} />
                  </div>
                </div>
                {/* Right Column (Light Graphic) */}
                <div className="bg-[#f4f4f3] flex items-center justify-center p-8 relative overflow-hidden h-[300px] md:h-auto order-1 md:order-2">
                  {/* Code / Config Switcher Visual */}
                  <div className="w-full max-w-[280px] bg-[#0c0c0c] rounded-2xl p-5 border border-zinc-800 font-mono text-[10px] text-zinc-400 shadow-xl leading-normal scale-90 sm:scale-100 text-left">
                    <div className="flex gap-1.5 mb-4">
                      <div className="size-2 rounded-full bg-zinc-800" />
                      <div className="size-2 rounded-full bg-zinc-800" />
                      <div className="size-2 rounded-full bg-zinc-800" />
                    </div>
                    <div className="text-zinc-650">{'// request_body.json'}</div>
                    <div className="text-zinc-500">{'{'}</div>
                    <div className="pl-4 flex items-center gap-1.5">
                      <span className="text-blue-400">&quot;model&quot;</span>:
                      <AnimatePresence mode="wait">
                        <ModelSwitcherCode />
                      </AnimatePresence>
                    </div>
                    <div className="pl-4"><span className="text-blue-400">&quot;temperature&quot;</span>: <span className="text-amber-500">0.7</span>,</div>
                    <div className="pl-4"><span className="text-blue-400">&quot;messages&quot;</span>: [...]</div>
                    <div className="text-zinc-500">{'}'}</div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden min-h-[420px] group">
                {/* Left Column (Light Graphic) */}
                <div className="bg-[#f4f4f3] flex items-center justify-center p-8 relative overflow-hidden h-[300px] md:h-auto">
                  {/* Failover / Backup route visual */}
                  <FailoverRouteVisual />
                </div>
                {/* Right Column (Text) */}
                <div className="bg-[#0c0c0c] p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-4 relative text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    Resilient Failover Groups & Latency Routing
                  </h3>
                  <p className="text-[13px] md:text-sm text-zinc-400 leading-relaxed font-medium">
                    Outages are inevitable, but your downtime doesn&apos;t have to be. Frenix monitors model health in real-time, automatically routing around provider degradation and rate limits.
                  </p>
                  <p className="text-[13px] md:text-sm text-zinc-500 leading-relaxed font-medium">
                    Set custom fallback paths so requests fall back from primary options to secondary models instantly, keeping your user experiences uninterrupted.
                  </p>
                  <div className="mt-4 flex items-center justify-center size-8 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Blue Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
          </section>
        </RevealSection>


      {/* ── FAQ Section (Dark Mode) ── */}
      <section className="max-w-3xl mx-auto px-6 mb-32 relative z-10 pt-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Frequently Asked</h2>
          <p className="text-zinc-500 text-lg font-medium mt-4 max-w-xl mx-auto">Everything you need to know about the Frenix orchestration layer.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="item-1" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] data-[state=open]:bg-white/[0.03]">
            <AccordionTrigger className="text-white font-bold text-base hover:no-underline py-5">What exactly is a Unified Endpoint?</AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5">
              A Unified Endpoint allows you to access models from OpenAI, Anthropic, Google, and more through a single API key and a standardized REST interface. You no longer need to manage multiple SDKs or complex authentication flows for each provider.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] data-[state=open]:bg-white/[0.03]">
            <AccordionTrigger className="text-white font-bold text-base hover:no-underline py-5">How does Frenix handle latency?</AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5">
              Frenix is built on a global edge network that minimizes regional hop-latency. Our routing logic is optimized to deliver the fastest possible time-to-first-token by selecting the most responsive provider cluster for your specific geographic location.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] data-[state=open]:bg-white/[0.03]">
            <AccordionTrigger className="text-white font-bold text-base hover:no-underline py-5">Is my data used for model training?</AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5">
              Absolutely not. Frenix acts as a zero-retention gateway. We do not store your prompts or completions, and we only work with enterprise-tier provider accounts that explicitly opt-out of data training by default.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] data-[state=open]:bg-white/[0.03]">
            <AccordionTrigger className="text-white font-bold text-base hover:no-underline py-5">How difficult is it to switch providers?</AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5">
              It takes exactly one line of code change. Because our interface is standardized, you simply update the &apos;provider&apos; parameter in your request body, and Frenix handles the mapping, payload conversion, and execution seamlessly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] data-[state=open]:bg-white/[0.03]">
            <AccordionTrigger className="text-white font-bold text-base hover:no-underline py-5">What happens if a provider goes down?</AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5">
              Frenix offers built-in automatic failover groups. You can define a &quot;Fallback Model&quot; in your configuration, and if your primary provider experiences an outage or rate-limit, Frenix will automatically reroute the request to ensure your application remains operational.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border border-white/5 rounded-2xl px-6 bg-white/[0.01] data-[state=open]:bg-white/[0.03]">
            <AccordionTrigger className="text-white font-bold text-base hover:no-underline py-5">Is there a free tier available?</AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5">
              Yes! Frenix offers a generous free tier that includes access to all supported models with reasonable rate limits. You can upgrade to a paid plan anytime for higher throughput, priority routing, and advanced analytics.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── CTA Section (Dark Mode) ── */}
      <section className="max-w-[1200px] mx-auto pb-32 px-4 sm:px-6 relative z-10">
        <div className="px-8 md:px-16 py-16 md:py-24 bg-black text-white rounded-[40px] flex flex-col lg:flex-row items-center justify-start relative overflow-hidden group shadow-2xl shadow-purple-900/20 border border-white/5">
          <div className="text-center lg:text-left relative z-10 max-w-xl w-full">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
              Ship faster with one unified API.
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start relative z-10 mt-10">
              <Link href="/dashboard" className="h-14 px-10 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                Get started <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link href="/docs" className="h-14 px-8 border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center font-bold text-sm text-white hover:bg-black/60 transition-colors shadow-xl">
                <Terminal size={18} className="mr-2" /> Docs
              </Link>
            </div>
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[40px]">
            <RiveIllustration />
          </div>
        </div>
      </section>

      {/* ── End Dark Sections Wrapper ── */}
      </div>
    </div>

  );
}