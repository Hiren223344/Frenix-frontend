'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Network, Server, ArrowLeft, Calendar, Share2, Bookmark, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Hero */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">Architecture</span>
            <span className="text-white/30 text-sm italic">March 14, 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] mb-8 uppercase italic">
            Scaling Multi-Tenant AI Architecture
          </h1>
          <div className="aspect-[21/9] rounded-[2rem] bg-indigo-600/10 border border-white/5 flex items-center justify-center">
            <Layers size={80} className="text-indigo-500/50" />
            <Network className="ml-[-20px] mb-[-40px] text-white/20" size={100} />
          </div>
        </header>

        {/* Content */}
        <article className="space-y-8 text-white/60 text-lg leading-relaxed font-light">
          <p className="text-2xl text-white font-medium">When building a SaaS product powered by AI, multi-tenancy is the most complex hurdle. How do you isolate data, manage costs, and enforce rate limits for thousands of organizations simultaneously?</p>
          
          <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">The Org-Team-Project Model</h2>
          <p>Frenix utilizes a strictly isolated hierarchical model. Each request is scoped not just to an API key, but to a specific Project, Team, and Organization. This allows for granular billing and access control that scales from a 2-person startup to a Fortune 500 company.</p>

          <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                <div>
                   <h4 className="font-bold text-white">Data Isolation</h4>
                   <p className="text-sm">Requests never leak between tenants due to strict UUID-based scoping.</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">2</div>
                <div>
                   <h4 className="font-bold text-white">Cost Allocation</h4>
                   <p className="text-sm">Track tokens and dollar spend down to the individual team member level.</p>
                </div>
             </div>
          </div>

          <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Performance at Scale</h2>
          <p>By leveraging PostgreSQL row-level security and global Redis replication, Frenix ensures that multi-tenant lookups add zero perceived latency to the AI interaction. This is the difference between a toy gateway and an enterprise-grade backbone.</p>
        </article>
      </div>
    </div>
  );
}
