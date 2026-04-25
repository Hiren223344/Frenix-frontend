'use client'

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, ExternalLink } from 'lucide-react';

export default function ExaSponsorshipPost() {
  return (
    <article className="min-h-screen pt-24 pb-20 px-6 font-['Ranade'] font-light">
      <div className="max-w-[800px] mx-auto">
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-normal text-muted-foreground hover:text-foreground transition-colors mb-12 tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-normal uppercase tracking-[0.3em] text-emerald-600">
              Partnership
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-normal uppercase tracking-[0.3em] text-blue-600">
              Sponsored
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter mb-8 text-foreground leading-[1.1]">
            Frenix x Exa: The Future of Real-Time AI Research
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-normal text-foreground">Frenix Engineering</span>
                <span className="text-[11px] font-normal text-muted-foreground opacity-60">April 25, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-normal uppercase tracking-[0.2em]">
                <Clock size={14} /> 4 min read
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <button className="hover:text-foreground transition-colors"><Share2 size={18} /></button>
              <button className="hover:text-foreground transition-colors"><Bookmark size={18} /></button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden glass-card mb-16 relative border border-white/10">
          <img 
            src="/exa_frenix_sponsorship_1777121356825.png" 
            alt="Frenix x Exa Sponsorship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 italic border-l-2 border-emerald-500/50 pl-6 font-normal">
            "By integrating Exa’s neural search capabilities directly into the Frenix gateway, we're giving LLMs something they’ve always lacked: a real-time, high-fidelity memory of the entire web."
          </p>

          <h2 className="text-2xl font-normal mb-6 text-foreground mt-12 tracking-tight">Bridging the Knowledge Gap</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We are thrilled to announce that <strong>Exa.ai</strong> (formerly Metaphor) is officially sponsoring Frenix. This partnership isn't just about financial support; it's a deep technical integration aimed at solving one of the biggest problems in AI today: <strong>hallucination due to stale data.</strong>
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            While LLMs are incredibly powerful, their training data is static. To build truly intelligent agents, developers need to feed them real-time information from the web. Traditional search engines are built for humans, returning SEO-bloated pages. Exa is built for AI, returning clean, structured data that models can actually understand.
          </p>

          <h2 className="text-2xl font-normal mb-6 text-foreground mt-12 tracking-tight">What This Means for Frenix Developers</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Starting today, Frenix developers will have easier access to Exa's neural search through our unified interface. Whether you're building a market research bot or a real-time news aggregator, you can now combine 150+ models with the world's most advanced AI search engine.
          </p>

          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl my-12 backdrop-blur-sm">
            <h3 className="text-lg font-normal mb-6 text-emerald-500 uppercase tracking-[0.2em]">The Exa Advantage:</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong className="text-foreground font-normal">Neural Search:</strong> Search by meaning, not just keywords. Find the exact research papers or blog posts your agent needs.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong className="text-foreground font-normal">Clean Content:</strong> Exa strips away the HTML noise, providing models with pure text content, saving you thousands in token costs.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong className="text-foreground font-normal">Seamless Integration:</strong> One request to Frenix can now trigger a research cycle via Exa, augmenting the prompt before it ever hits the LLM.</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-normal mb-6 text-foreground mt-12 tracking-tight">Looking Ahead</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            This sponsorship is the first of many steps Frenix is taking to build the ultimate orchestration layer for the agentic age. With Exa’s support, we are accelerating our roadmap for <strong>Dynamic RAG</strong> and <strong>Autonomous Search Agents</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 my-10">
            <a href="https://exa.ai" target="_blank" rel="noopener noreferrer" className="flex-1 p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all group">
              <span className="text-xs font-normal uppercase tracking-[0.2em] text-emerald-500 block mb-2">Visit Partner</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-normal text-foreground">Exa.ai Neural Search</span>
                <ExternalLink size={18} className="text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
            </a>
            <Link href="/docs" className="flex-1 p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all group">
              <span className="text-xs font-normal uppercase tracking-[0.2em] text-blue-500 block mb-2">Documentation</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-normal text-foreground">Integration Guide</span>
                <ExternalLink size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 p-12 bg-white text-black rounded-[40px] text-center shadow-2xl">
          <h2 className="text-3xl font-normal tracking-tighter mb-4 !text-black">Build with Frenix x Exa</h2>
          <p className="text-sm font-normal mb-8 !text-black/60 tracking-wide">Join the thousands of developers building agentic workflows today.</p>
          <Link href="/signin" className="inline-flex h-14 px-10 bg-black text-white rounded-2xl items-center justify-center font-normal text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity">
            Get started for free
          </Link>
        </footer>
      </div>
    </article>
  );
}
