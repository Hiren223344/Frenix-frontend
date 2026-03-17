'use client'

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from 'lucide-react';

export default function FutureLLMPost() {
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
              Insights
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-8 text-foreground leading-[1.1]">
            The Future of LLM Orchestration: Beyond Simple Proxying
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Engineering Lead</span>
                <span className="text-[11px] font-medium text-muted-foreground">Published on March 10, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                <Clock size={14} /> 6 min read
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
            src="/blog/future-llm.png" 
            alt="Future of AI" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            As we move into 2026, the role of an AI gateway is shifting. It's no longer just about routing traffic; it's about intelligent orchestration, edge execution, and deep payload understanding.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Autonomous Routing</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The next generation of orchestration will use AI to route AI. Gateways will analyze incoming prompts to determine the most cost-effective yet capable model for that specific task in real-time. A simple "hello" shouldn't route to GPT-5; it should go to a lightning-fast edge model.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Multi-Modal Convergence</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Voice, image, and video models are becoming standard. Future gateways must handle these large binary payloads with the same efficiency as text, providing unified streaming and transformation capabilities at the edge.
          </p>

          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl my-12 border-dashed">
            <h3 className="text-lg font-bold mb-2 text-foreground">What we're building at Frenix:</h3>
            <p className="text-sm text-muted-foreground">We're currently experimenting with WASM-based edge filters that allow developers to run custom validation and cleaning logic on prompts before they ever leave our gateway.</p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">The Shift to the Edge</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Privacy and latency concerns are driving more model execution to the edge. The gateway of the future will be a hybrid entity, orchestrating both cloud-based behemoths and smaller, specialized local models running on-device or in edge points of presence.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Security as Code</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            With AI agents acting on behalf of users, security becomes paramount. We see a future where gateways automatically implement PII stripping, prompt injection detection, and budget enforcement at a granular level.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            The journey is just beginning. At Frenix, we're not just watching the future happen; we're building the pipes that make it possible.
          </p>
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 p-12 bg-white text-black rounded-[40px] text-center">
          <h2 className="text-3xl font-extrabold tracking-tighter mb-4 !text-black">Join the revolution.</h2>
          <p className="text-sm font-medium mb-8 !text-black/60">Contribute to the future of AI infrastructure.</p>
          <Link href="/dashboard" className="inline-flex h-14 px-10 bg-black text-white rounded-2xl items-center justify-center font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
            Join Frenix
          </Link>
        </footer>
      </div>
    </article>
  );
}
