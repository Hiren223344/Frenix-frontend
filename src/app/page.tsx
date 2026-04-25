'use client'

import Link from 'next/link';
import { toast } from 'sonner';
import CountUp from '@/components/ui/CountUp';
import { ArrowRight, Copy, TrendingUp, Zap, Shield, Check, Terminal, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import ClickSpark from '@/components/ui/ClickSpark';
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Claude, DeepSeek, Exa, Grok, Meta, OpenAI, Google, Mistral } from '@lobehub/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClientTweetCard } from "@/components/ui/tweet-card";
import { Marquee } from "@/components/ui/marquee";
import { GlobePulse } from "@/components/ui/cobe-globe-pulse";
import Particles from "@/components/ui/Particles";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import SplitText from '@/components/ui/SplitText';
import dynamic from 'next/dynamic';

const RiveIllustration = dynamic(() => import('@/components/ui/RiveIllustration'), { ssr: false });

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

const MistralIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4.5 20.29h15L12 2zm0 4.88L15.3 15h-6.6L12 6.88z" />
  </svg>
);

const MetaIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm2 14.5c-.83 0-1.5-.67-1.5-1.5 0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5 1.5zm-4 0c-.83 0-1.5-.67-1.5-1.5 0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5 1.5zm2-4c-.83 0-1.5-.67-1.5-1.5 0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5 1.5z" />
  </svg>
);

const UserIcon = ({ size = 17, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UnifiedEndpointBeam = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const model1Ref = useRef<HTMLDivElement>(null);
  const model2Ref = useRef<HTMLDivElement>(null);
  const model3Ref = useRef<HTMLDivElement>(null);
  const model4Ref = useRef<HTMLDivElement>(null);
  const model5Ref = useRef<HTMLDivElement>(null);
  const model6Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex size-full items-center justify-center p-10 overflow-hidden" ref={containerRef}>
      <div className="flex size-full flex-col items-center justify-center gap-10 max-w-2xl">
        <div className="flex flex-row items-center justify-between w-full px-4">
          <div ref={fromRef} className="z-10 flex size-14 items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <UserIcon size={24} className="text-slate-700" />
          </div>

          <div ref={toRef} className="z-10 flex size-20 items-center justify-center rounded-2xl bg-black border border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
            <img src="/logo-withoutbg.png" alt="Frenix" className="size-14" />
          </div>

          <div className="flex flex-col gap-4">
            {[model1Ref, model2Ref, model3Ref, model4Ref, model5Ref, model6Ref].map((ref, i) => (
              <div key={i} ref={ref} className="z-10 flex size-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                {i === 0 && <OpenAI size={22} color="#334155" />}
                {i === 1 && <Claude size={18} color="#334155" />}
                {i === 2 && <Google size={22} color="#334155" />}
                {i === 3 && <Meta size={22} color="#334155" />}
                {i === 4 && <Grok size={22} color="#334155" />}
                {i === 5 && <DeepSeek size={22} color="#334155" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} duration={3} gradientStartColor="#3b82f6" gradientStopColor="#2dd4bf" pathWidth={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={toRef} toRef={model1Ref} duration={3} delay={0.5} gradientStartColor="#3b82f6" gradientStopColor="#2dd4bf" pathWidth={2} />
      <AnimatedBeam containerRef={containerRef} fromRef={toRef} toRef={model2Ref} duration={3} delay={0.8} gradientStartColor="#3b82f6" gradientStopColor="#2dd4bf" pathWidth={2} />
      <AnimatedBeam containerRef={containerRef} fromRef={toRef} toRef={model3Ref} duration={3} delay={1.1} gradientStartColor="#3b82f6" gradientStopColor="#2dd4bf" pathWidth={2} />
      <AnimatedBeam containerRef={containerRef} fromRef={toRef} toRef={model4Ref} duration={3} delay={1.4} gradientStartColor="#3b82f6" gradientStopColor="#2dd4bf" pathWidth={2} />
      <AnimatedBeam containerRef={containerRef} fromRef={toRef} toRef={model5Ref} duration={3} delay={1.7} gradientStartColor="#3b82f6" gradientStopColor="#2dd4bf" pathWidth={2} />
      <AnimatedBeam containerRef={containerRef} fromRef={toRef} toRef={model6Ref} duration={3} delay={2.0} gradientStartColor="#3b82f6" gradientStopColor="#2dd4bf" pathWidth={2} />
    </div>
  );
};

const featuredModels = [
  {
    name: 'Gemini 3.1 Pro',
    provider: 'Google DeepMind',
    Icon: Google,
    tokensWk: '142.2B',
    latency: '842ms',
    change: '+12.4%',
    positive: true,
    isNew: true,
  },
  {
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    Icon: Claude,
    tokensWk: '28.5B',
    latency: '1.2s',
    change: '+8.2%',
    positive: true,
    isNew: true,
  },
  {
    name: 'Gpt 5.3 Codex',
    provider: 'OpenAI',
    Icon: OpenAI,
    tokensWk: '842.1B',
    latency: '2.1s',
    change: '+15.4%',
    positive: true,
    isNew: true,
  }
];

const testimonials = [
  {
    name: "Raj Patel",
    role: "Founder & CEO",
    content: "As a startup, we needed an API that could scale. <span class='text-sky-400 font-extrabold'>Frenix delivered exactly that.</span> Production record time.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Linda Wu",
    role: "VP Engineering",
    content: "Frenix's reliability is unmatched. <span class='text-sky-400 font-extrabold'>99.99% uptime</span> with sub-100ms latency. Perfect for production workloads.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Emily Chen",
    role: "Product Manager",
    content: "The multilingual capabilities are incredible. <span class='text-sky-400 font-extrabold'>12 languages, one API.</span> A global must-have.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Alex Rivera",
    role: "CTO @ Innovate",
    content: "Frenix changed our development. <span class='text-sky-400 font-extrabold'>Shipped 10x faster</span> than expected. Intuitive API.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Michael Brown",
    role: "Data Scientist",
    content: "Accuracy is remarkable. <span class='text-sky-400 font-extrabold'>Tools are 95% accurate.</span> Transformative for finance.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Samantha Lee",
    role: "Lead Developer",
    content: "Seamless integration. <span class='text-sky-400 font-extrabold'>80% faster response times.</span> Satisfaction soared!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Jake Morrison",
    role: "CTO @ SecureNet",
    content: "Enterprise-grade features. <span class='text-sky-400 font-extrabold'>Key rotation & audit logs.</span> Absolute trust.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Nadia Ali",
    role: "Product Lead",
    content: "Top-notch DevX. <span class='text-sky-400 font-extrabold'>Excellent SDKs & support.</span> A joy for any team.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Sofia Patel",
    role: "CEO @ EduTech",
    content: "Powers our learning platform. <span class='text-sky-400 font-extrabold'>300% engagement boost.</span> One API call at a time.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Marcus Thorne",
    role: "Infrastructure Lead",
    content: "<span class='text-sky-400 font-extrabold'>Zero-retention policy</span> is a game changer for our compliance teams. Elite security.",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Elena Rossi",
    role: "AI Architect",
    content: "The <span class='text-sky-400 font-extrabold'>Unified Gateway</span> simplifies everything. No more SDK spaghetti.",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Jordan Smith",
    role: "Fullstack Dev",
    content: "Switched in 5 minutes. <span class='text-sky-400 font-extrabold'>Infrastructure that just works.</span> Highly recommend.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Sarah Jenkins",
    role: "Growth Eng",
    content: "Scalability at its peak. <span class='text-sky-400 font-extrabold'>Handled 50M requests</span> without breaking a sweat.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "David Kim",
    role: "Backend Wizard",
    content: "Frenix is the <span class='text-sky-400 font-extrabold'>gold standard</span> for AI orchestration. Pure technical excellence.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    name: "Lisa Wong",
    role: "SRE @ FutureScale",
    content: "Our failover logic is now redundant. <span class='text-sky-400 font-extrabold'>Frenix handles everything natively.</span>",
    avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=150&h=150&auto=format&fit=crop"
  }
];

const TestimonialCard = ({ name, role, content, avatar, index }: typeof testimonials[0] & { index: number }) => (
  <div className={cn(
    "relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/5 p-5 bg-white/[0.02] flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300 group",
    index % 2 === 0 ? "min-h-[160px]" : "min-h-[200px]"
  )}>
    <blockquote
      className="text-white/80 text-[13px] leading-snug mb-4 font-medium"
      dangerouslySetInnerHTML={{ __html: content }}
    />
    <div className="flex items-center gap-2">
      <img src={avatar} className="size-7 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-300" alt={name} />
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-white tracking-tight leading-none mb-0.5">{name}</span>
        <span className="text-[9px] font-medium text-white/30 truncate max-w-[120px] leading-none">{role}</span>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const col1 = testimonials.slice(0, 5);
  const col2 = testimonials.slice(5, 10);
  const col3 = testimonials.slice(10, 15);

  return (
    <section className="py-24 w-full relative">
      <div className="text-center mb-16 px-6 max-w-3xl mx-auto relative z-20">
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 leading-none italic">
          Wall of Love
        </h2>
        <p className="text-white/30 text-base md:text-lg font-medium tracking-tight max-w-xl mx-auto">
          World-class infrastructure trusted by the next generation of AI pioneers.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 h-[700px] overflow-hidden relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full">
          <Marquee vertical className="[--duration:25s] [--gap:1rem]" pauseOnHover>
            {col1.map((t, i) => <TestimonialCard key={i} {...t} index={i} />)}
          </Marquee>
          <Marquee vertical reverse className="[--duration:30s] [--gap:1rem]" pauseOnHover>
            {col2.map((t, i) => <TestimonialCard key={i} {...t} index={i + 5} />)}
          </Marquee>
          <Marquee vertical className="hidden md:flex [--duration:20s] [--gap:1rem]" pauseOnHover>
            {col3.map((t, i) => <TestimonialCard key={i} {...t} index={i + 10} />)}
          </Marquee>
        </div>

        {/* Improved Edge Fades matching site background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />
      </div>
    </section>
  );
};

const FAQSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
          Common Questions
        </h2>
        <p className="text-white/40 text-lg">Everything you need to know about the Frenix orchestration layer.</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What exactly is a Unified Endpoint?</AccordionTrigger>
          <AccordionContent>
            A Unified Endpoint allows you to access models from OpenAI, Anthropic, Google, and more through a single API key and a standardized REST interface. You no longer need to manage multiple SDKs or complex authentication flows for each provider.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How does Frenix handle latency?</AccordionTrigger>
          <AccordionContent>
            Frenix is built on a global edge network that minimizes regional hop-latency. Our routing logic is optimized to deliver the fastest possible time-to-first-token by selecting the most responsive provider cluster for your specific geographic location.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Is my data used for model training?</AccordionTrigger>
          <AccordionContent>
            Absolutely not. Frenix acts as a zero-retention gateway. We do not store your prompts or completions, and we only work with enterprise-tier provider accounts that explicitly opt-out of data training by default.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>How difficult is it to switch providers?</AccordionTrigger>
          <AccordionContent>
            It takes exactly one line of code change. Because our interface is standardized, you simply update the 'provider' parameter in your request body, and Frenix handles the mapping, payload conversion, and execution seamlessly.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>What happens if a provider goes down?</AccordionTrigger>
          <AccordionContent>
            Frenix offers built-in automatic failover groups. You can define a "Fallback Model" in your configuration, and if your primary provider experiences an outage or rate-limit, Frenix will automatically reroute the request to ensure your application remains operational.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

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

const HorizontalScrollSection = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pathsData, setPathsData] = useState<string[]>(["", ""]);

  useGSAP(() => {
    if (!sectionRef.current || !triggerRef.current) return;

    const timeoutId = setTimeout(() => {
      const section = sectionRef.current;
      const trigger = triggerRef.current;
      if (!section || !trigger) return;

      const totalWidth = section.scrollWidth;
      const scrollDistance = totalWidth - window.innerWidth;

      if (scrollDistance <= 0) return;

      // Setup blob points
      const numPoints = 8;
      const numPaths = 2;
      const allPoints: number[][] = [];
      for (let i = 0; i < numPaths; i++) {
        allPoints.push(new Array(numPoints).fill(110)); // Start just below the screen instead of miles away
      }

      const renderBlobs = () => {
        const newPaths: string[] = [];
        for (let i = 0; i < numPaths; i++) {
          const points = allPoints[i];
          let d = `M 0 ${points[0]} C`;
          for (let j = 0; j < numPoints - 1; j++) {
            const p = ((j + 1) / (numPoints - 1)) * 100;
            const cp = p - (1 / (numPoints - 1) * 100) / 2;
            d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
          }
          d += ` V 500 H 0 Z`;
          newPaths.push(d);
        }
        setPathsData(newPaths);
      };

      // Add 3 extra viewports of scroll distance exclusively for the background transition
      const extraScroll = window.innerHeight * 3;
      const totalScrollDistance = totalWidth + extraScroll;

      ScrollTrigger.create({
        trigger: trigger,
        pin: true,
        start: "top top",
        end: () => `+=${totalScrollDistance}`,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        pinType: "transform",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${totalScrollDistance}`,
          scrub: 1,
          immediateRender: false,
        },
        onUpdate: renderBlobs,
      });

      const horizontalRatio = totalWidth / totalScrollDistance;
      const blobRatio = extraScroll / totalScrollDistance;

      // 1. Horizontal Scroll (occupies the first part of the scroll distance)
      tl.to(section, {
        x: -scrollDistance,
        ease: "none",
        duration: horizontalRatio,
      }, 0);

      // 2. Blob transition (occupies the extra 3 viewports of scroll distance)
      for (let i = 0; i < numPaths; i++) {
        const points = allPoints[i];
        for (let j = 0; j < numPoints; j++) {
          tl.to(points, {
            [j]: -10, // End just above the screen
            duration: blobRatio * 0.8, // reserve 20% for staggering
            ease: "sine.inOut",
          }, horizontalRatio + (Math.random() * blobRatio * 0.2));
        }
      }

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === triggerRef.current) st.kill();
      });
    };
  }, { scope: triggerRef });

  return (
    <div ref={triggerRef} className="relative min-h-screen overflow-hidden">
      {/* Locked Header Container */}
      <div className="absolute inset-0 w-full h-full flex items-center overflow-hidden pointer-events-none z-0">
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <SplitText
            text={title}
            tag="h2"
            className="text-5xl md:text-8xl lg:text-[10rem] font-black text-rose-500/5 uppercase leading-none opacity-50 tracking-wider"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            splitType="lines"
            duration={0.6}
            ease="expo.out"
            from={{ y: 100, opacity: 0 }}
            to={{ y: 0, opacity: 1 }}
            textAlign="left"
          />
        </div>
      </div>

      {/* Scrolling Content */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center z-10">
        <div ref={sectionRef} className="flex flex-nowrap pl-[20vw]">
          {children}
        </div>
      </div>

      {/* Synchronized Blob Transition */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[300vh] pointer-events-none z-50 overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d={pathsData[0]} fill="#f3f4f6" opacity="0.6" />
        <path d={pathsData[1]} fill="#ffffff" />
      </svg>
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
              <h1 className="text-[1.3rem] sm:text-[2.2rem] md:text-[3.6rem] lg:text-[4.4rem] text-white tracking-tight leading-tight font-semibold mb-6 md:mb-8 uppercase text-center whitespace-nowrap">
                <DiaTextReveal
                  text="Your Unified AI Gateway"
                  duration={2}
                  textColor="#ffffff"
                  startOnView={true}
                />
              </h1>

              <p className="text-[13px] md:text-[17px] text-muted-foreground/60 leading-relaxed max-w-xl mx-auto mb-10 font-medium tracking-wide px-2">
                Access 150+ LLMs through a single endpoint. Route across OpenAI, Anthropic, Google, and more — no client changes needed.
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

        {/* ── Why AI Gateway (Sticky Scroll) ─────────────────── */}
        <RevealSection>
          <section className="max-w-[1200px] mx-auto pt-40 px-6">
            <div className="flex flex-col lg:flex-row gap-20">
              {/* Left: Sticky Headline */}
              <div className="lg:w-[35%] lg:sticky lg:top-[50%] lg:-translate-y-[50%] h-fit pr-10 overflow-visible">
                <SplitText
                  text="Why AI Gateway?"
                  tag="h1"
                  className="text-5xl md:text-7xl font-black text-white uppercase leading-[0.85] tracking-wider"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  splitType="lines"
                  duration={0.6}
                  delay={100}
                  ease="expo.out"
                  from={{ y: 100, opacity: 0 }}
                  to={{ y: 0, opacity: 1 }}
                  textAlign="left"
                />
                <div className="mt-8 w-12 h-1 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
              </div>

              {/* Right: Scrolling Content */}
              <div className="lg:w-[65%] space-y-40 mb-20">
                <div className="min-h-[70vh] flex flex-col justify-center text-left">
                  <SplitText
                    text="We've heard all the reasons to not use an AI Gateway."
                    tag="p"
                    className="text-xl md:text-3xl text-white font-black leading-tight tracking-tight uppercase max-w-lg mb-8"
                    splitType="lines"
                    duration={0.6}
                    ease="expo.out"
                    from={{ y: 100, opacity: 0 }}
                    to={{ y: 0, opacity: 1 }}
                    textAlign="left"
                  />
                  <div className="text-muted-foreground/60">
                    <SplitText
                      text="It feels hacky. It's inaccessible. It's not performant. It's over-engineered. And historically, those were all true. But we like to imagine things as they could be, then build them. So, why should you use an AI gateway?"
                      className="!text-lg md:!text-xl leading-relaxed font-medium !text-muted-foreground/60"
                      delay={10}
                      duration={0.6}
                      splitType="lines"
                      ease="expo.out"
                      from={{ opacity: 0, y: 50 }}
                      to={{ opacity: 1, y: 0 }}
                      textAlign="left"
                    />
                  </div>
                </div>

                {[
                  {
                    title: "Unified Provider Access",
                    desc: "Stop juggling 20+ different SDKs and authentication patterns. Frenix provides a single, standardized REST interface to every major LLM provider—OpenAI, Anthropic, Google, and beyond."
                  },
                  {
                    title: "Instant Model Switching",
                    desc: "Swap between models and providers with a single line of code. No more re-engineering your backend just to test the latest Claude or GPT release—just update the 'provider' parameter and go."
                  },
                  {
                    title: "Resilient Failover Groups",
                    desc: "Eliminate downtime caused by provider outages or rate limits. Define automatic fallback groups so that if your primary model fails, Frenix reroutes your request to a secondary provider instantly."
                  }
                ].map((item, i) => (
                  <div key={i} className="min-h-[70vh] flex flex-col justify-center group border-l-2 border-white/5 pl-8 hover:border-white/20 transition-all duration-500">
                    <SplitText
                      text={item.title}
                      tag="h3"
                      className="text-xl md:text-3xl font-black text-blue-500 mb-6 group-hover:text-blue-400 transition-colors uppercase leading-tight tracking-wider"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      splitType="lines"
                      duration={0.6}
                      ease="expo.out"
                      from={{ y: 100, opacity: 0 }}
                      to={{ y: 0, opacity: 1 }}
                      textAlign="left"
                    />
                    <div className="text-muted-foreground/60 max-w-xl">
                      <SplitText
                        text={item.desc}
                        className="!text-lg md:!text-xl leading-relaxed font-medium !text-muted-foreground/60"
                        delay={10}
                        duration={0.6}
                        splitType="lines"
                        ease="expo.out"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        textAlign="left"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle Blue Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
          </section>
        </RevealSection>

        {/* ── Section 3: Disadvantages of Others (Horizontal Scroll) ────────────────── */}
        <div className="relative overflow-visible">
          <HorizontalScrollSection title="Legacy Issues">
            {[
              {
                id: "01",
                title: "Performance Budget Loss",
                desc: "Significant loss of performance budget due to using CSS transforms and unoptimized layout calculations in legacy gateways."
              },
              {
                id: "02",
                title: "Inaccessibility",
                desc: "Inaccessibility from no page search support and native scrollbar behaviors that users rely on for platform navigation."
              },
              {
                id: "03",
                title: "Import Bloat",
                desc: "Non-negligible import costs (12.1kb - 24.34kb gzipped), adding unnecessary weight to your application bundle early on."
              },
              {
                id: "04",
                title: "Limited Animations",
                desc: "Limited animation systems for complex, scroll-based interactions and high-density performance visualizations."
              },
              {
                id: "05",
                title: "Erasing Native APIs",
                desc: "Erasing native APIs like Intersection-Observer, CSS Sticky, etc. during horizontal or complex scroll transitions."
              }
            ].map((item, i) => (
              <div key={i} className="flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[40vw] h-[60vh] flex flex-col justify-center border-l border-white/10 pl-12 pr-12 group hover:bg-white/[0.01] transition-all duration-500 rounded-2xl mx-10">
                <div className={cn(
                  "text-sm font-black mb-6 tracking-[0.5em] uppercase",
                  item.id === "04" ? "text-teal-400" : "text-blue-500"
                )}>
                  {item.id}
                </div>
                <SplitText
                  text={item.title}
                  tag="h3"
                  className="text-2xl md:text-4xl font-black text-white/50 mb-8 group-hover:text-white transition-colors tracking-tight uppercase leading-none"
                  splitType="lines"
                  duration={0.6}
                  ease="expo.out"
                  from={{ y: 100, opacity: 0 }}
                  to={{ y: 0, opacity: 1 }}
                  textAlign="left"
                />
                <div className="text-muted-foreground/40 max-w-lg">
                  <SplitText
                    text={item.desc}
                    className="!text-lg md:!text-xl leading-relaxed font-medium !text-muted-foreground/40"
                    delay={10}
                    duration={0.6}
                    splitType="lines"
                    ease="expo.out"
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                  />
                </div>
              </div>
            ))}
          </HorizontalScrollSection>

          {/* Final Blue Transition Glow */}
          <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-blue-900/20 to-transparent blur-[100px] pointer-events-none z-0" />
        </div>

        {/* ── End Dark Sections Wrapper ── */}
      </div>

      {/* ── Transition Target (White Mode) ── */}
      <div className="bg-white min-h-[90vh] relative z-[100] flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <h2
          className="text-7xl md:text-9xl lg:text-[11rem] font-black text-black uppercase tracking-wider leading-[0.85] text-center"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          <span className="block mb-6 opacity-30 text-slate-400">That's Why We Built</span>
          <span className="block">
            Frenix AI Gateway
          </span>
        </h2>
      </div>

      <div className="bg-white relative z-[100] pb-20">
        {/* ── Bento Grid (White Mode) ── */}
        <section className="max-w-[1200px] mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Built for Scale</h2>
            <p className="text-slate-500 text-lg font-medium mt-4 max-w-xl mx-auto">Everything you need to route, monitor, and scale AI workloads—from a single pane of glass.</p>
          </div>
          <BentoGrid className="lg:grid-cols-2 lg:grid-rows-2">
            {[
              {
                name: "Unified Endpoint",
                description: "One request, total control. Query every major model provider through a single REST interface without changing your workflow.",
                background: (
                  <UnifiedEndpointBeam />
                ),
                className: "lg:col-span-1 lg:row-span-1 bg-slate-50 border-slate-200 text-slate-900",
              },
              {
                name: "All Models Support",
                description: "Access text, image, and video generation models. GPT-4, Claude, Gemini, DALL-E, Stable Diffusion, and more—all through one unified API.",
                background: (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-100 mix-blend-multiply">
                    <div className="relative size-full flex items-center justify-center -translate-y-6">
                      {/* Logo in the center (Static) */}
                      <div className="absolute size-24 rounded-full bg-black flex items-center justify-center z-20 shadow-2xl shadow-slate-300 border border-slate-800">
                        <img src="/logo-withoutbg.png" alt="Frenix" className="size-14" />
                      </div>

                      {/* Inner Orbit */}
                      <OrbitingCircles radius={120} duration={40} iconSize={28} className="border-slate-300">
                        <OpenAI size={28} color="#000" />
                        <Meta size={28} color="#000" />
                        <Google size={28} color="#000" />
                      </OrbitingCircles>
                      {/* Outer Orbit */}
                      <OrbitingCircles radius={200} duration={40} reverse iconSize={32} angleOffset={45} className="border-slate-300">
                        <Claude size={32} color="#000" />
                        <Mistral size={32} color="#000" />
                        <Grok size={32} color="#000" />
                        <DeepSeek size={32} color="#000" />
                      </OrbitingCircles>
                    </div>
                  </div>
                ),
                className: "lg:col-span-1 lg:row-span-2 bg-slate-50 border-slate-200 text-slate-900",
              },
              {
                name: "Blazing Fast Latency",
                description: "Sub-millisecond routing overhead with our global edge network. Your AI applications respond at the speed of thought.",
                background: (
                  <div className="absolute inset-0 opacity-[0.85] group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none mix-blend-multiply">
                    <GlobePulse className="w-[280px] h-[280px] invert" />
                  </div>
                ),
                className: "lg:col-span-1 lg:row-span-1 bg-slate-50 border-slate-200 text-slate-900",
              },
            ].map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </section>

        {/* ── FAQ (White Mode) ── */}
        <section className="max-w-3xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Frequently Asked</h2>
            <p className="text-slate-500 text-lg font-medium mt-4 max-w-xl mx-auto">Everything you need to know about the Frenix orchestration layer.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 data-[state=open]:bg-slate-50">
              <AccordionTrigger className="text-slate-900 font-bold text-base hover:no-underline py-5">What exactly is a Unified Endpoint?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                A Unified Endpoint allows you to access models from OpenAI, Anthropic, Google, and more through a single API key and a standardized REST interface. You no longer need to manage multiple SDKs or complex authentication flows for each provider.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 data-[state=open]:bg-slate-50">
              <AccordionTrigger className="text-slate-900 font-bold text-base hover:no-underline py-5">How does Frenix handle latency?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Frenix is built on a global edge network that minimizes regional hop-latency. Our routing logic is optimized to deliver the fastest possible time-to-first-token by selecting the most responsive provider cluster for your specific geographic location.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 data-[state=open]:bg-slate-50">
              <AccordionTrigger className="text-slate-900 font-bold text-base hover:no-underline py-5">Is my data used for model training?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Absolutely not. Frenix acts as a zero-retention gateway. We do not store your prompts or completions, and we only work with enterprise-tier provider accounts that explicitly opt-out of data training by default.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 data-[state=open]:bg-slate-50">
              <AccordionTrigger className="text-slate-900 font-bold text-base hover:no-underline py-5">How difficult is it to switch providers?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                It takes exactly one line of code change. Because our interface is standardized, you simply update the &apos;provider&apos; parameter in your request body, and Frenix handles the mapping, payload conversion, and execution seamlessly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 data-[state=open]:bg-slate-50">
              <AccordionTrigger className="text-slate-900 font-bold text-base hover:no-underline py-5">What happens if a provider goes down?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Frenix offers built-in automatic failover groups. You can define a &quot;Fallback Model&quot; in your configuration, and if your primary provider experiences an outage or rate-limit, Frenix will automatically reroute the request to ensure your application remains operational.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-slate-200 rounded-2xl px-6 bg-slate-50/50 data-[state=open]:bg-slate-50">
              <AccordionTrigger className="text-slate-900 font-bold text-base hover:no-underline py-5">Is there a free tier available?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Yes! Frenix offers a generous free tier that includes access to all supported models with reasonable rate limits. You can upgrade to a paid plan anytime for higher throughput, priority routing, and advanced analytics.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ── CTA (White Mode) ── */}
        <section className="max-w-[1200px] mx-auto pb-32 px-4 sm:px-6">
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
      </div>
    </div>

  );
}