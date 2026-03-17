'use client'

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from 'lucide-react';

export default function WhatsFrenixPost() {
  return (
    <article className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-[800px] mx-auto">
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
              Architecture
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-8 text-foreground leading-[1.1]">
            What is Frenix? The Future of AI Infrastructure
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Frenix Engineering Team</span>
                <span className="text-[11px] font-medium text-muted-foreground">Published on March 15, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                <Clock size={14} /> 5 min read
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <button className="hover:text-foreground transition-colors"><Share2 size={18} /></button>
              <button className="hover:text-foreground transition-colors"><Bookmark size={18} /></button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden glass-card mb-16">
          <img 
            src="/blog/whats-frenix.png" 
            alt="Frenix Architecture" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary pl-6">
            "In the rapidly evolving landscape of machine intelligence, the bottleneck is no longer the models themselves, but how we manage them. Frenix is the answer to that bottleneck."
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">The Fragmented LLM Landscape</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Today, developers are forced to juggle multiple SDKs, API keys, and error-handling logic for OpenAI, Anthropic, Google, and Meta. Each provider has different rate limits, latency profiles, and reliability standards. Managing this "orchestration debt" takes time away from building the core features of your application.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Introducing the Unified Gateway</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Frenix is a high-performance orchestration layer that sits between your application and the world's most powerful AI models. It provides a single, OpenAI-compatible endpoint that routes your requests dynamically to the best available model provider.
          </p>

          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl my-12">
            <h3 className="text-lg font-bold mb-4 text-foreground">Key Capabilities:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Unified API:</strong> One key, every model. No more swapping SDKs.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Latency-Aware Routing:</strong> We automatically pick the fastest region for your request.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span><strong>Zero-Config Failover:</strong> If OpenAI is down, Frenix can automatically route to a local Llama model or Claude.</span>
              </li>
            </ul>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            By abstracting away the infrastructure, Frenix allows you to focus on the prompt engineering and user experience. Whether you're running a small side project or a mission-critical enterprise application, Frenix scales with you, providing sub-40ms overhead and 99.9% uptime.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Frenix isn't just a proxy; it's a foundation for the next generation of AI-native applications. Join us as we build the infrastructure for machine intelligence.
          </p>
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 p-12 bg-white text-black rounded-[40px] text-center">
          <h2 className="text-3xl font-extrabold tracking-tighter mb-4 !text-black">Ready to simplify your stack?</h2>
          <p className="text-sm font-medium mb-8 !text-black/60">Get started with Frenix in less than 30 seconds.</p>
          <Link href="/signin" className="inline-flex h-14 px-10 bg-black text-white rounded-2xl items-center justify-center font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
            Get started for free
          </Link>
        </footer>
      </div>
    </article>
  );
}
