'use client'

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, CheckCircle2 } from 'lucide-react';

export default function WhyFrenixPost() {
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
              Product
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-8 text-foreground leading-[1.1]">
            Why Choose Frenix for Your LLM Orchestration?
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Infrastructure Group</span>
                <span className="text-[11px] font-medium text-muted-foreground">Published on March 12, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                <Clock size={14} /> 7 min read
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
            src="/blog/why-frenix.png" 
            alt="Frenix Advantages" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Choosing the right infrastructure for your AI applications is one of the most critical decisions you'll make. Here's why Frenix is the preferred choice for engineering-led organizations.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-foreground mt-12">1. Performance That Matters</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Adding a proxy layer usually means adding latency. Frenix is built with a custom Rust-based routing engine that ensures overhead is kept below 40ms. By using latency-aware load balancing, we often deliver responses <i>faster</i> than direct provider calls by routing around regional congestion.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-foreground mt-12">2. Reliability as a Standard</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Even the biggest AI providers experience downtime. With Frenix, your app won't. Our automatic failover system can switch models or providers in milliseconds if an upstream error is detected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
            {[
              "Global Edge Network",
              "99.9% Availability SLA",
              "Zero-Retention Privacy",
              "Advanced Analytics",
              "Granular Rate Limiting",
              "Multi-Org Management"
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6 text-foreground mt-12">3. Cost Optimization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Frenix provides deep visibility into your token consumption across all providers. Identify wasteful prompts, optimize model selection for specific tasks, and take advantage of our pass-through pricing with no markups on raw tokens.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-foreground mt-12">4. Security First Architecture</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Your data is your most valuable asset. Frenix implements a zero-retention policy and uses XOR-based payload security for sensitive workflows. We are designed to meet the most stringent compliance requirements.
          </p>

          <blockquote className="my-12 p-8 bg-white/[0.02] border-l-4 border-primary rounded-r-2xl">
            <p className="text-lg text-foreground font-medium italic mb-4">
              "Frenix reduced our integration complexity by 80% and gave us the confidence to scale our AI features without worrying about provider stability."
            </p>
            <cite className="text-sm text-muted-foreground">— Sarah Chen, CTO at NeoScale</cite>
          </blockquote>

          <h2 className="text-2xl font-bold mb-6 text-foreground mt-12">Final Thoughts</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The question isn't whether you need an AI gateway, but which one. Frenix offers the most robust, performant, and dev-friendly solution on the market.
          </p>
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 p-12 bg-white text-black rounded-[40px] text-center">
          <h2 className="text-3xl font-extrabold tracking-tighter mb-4 !text-black">Scale your AI today.</h2>
          <p className="text-sm font-medium mb-8 !text-black/60">Join 10,000+ developers building on Frenix.</p>
          <Link href="/dashboard" className="inline-flex h-14 px-10 bg-black text-white rounded-2xl items-center justify-center font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
            Start Building
          </Link>
        </footer>
      </div>
    </article>
  );
}
