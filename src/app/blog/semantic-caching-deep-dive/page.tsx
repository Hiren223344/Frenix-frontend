'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Database, ArrowLeft, Calendar, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Hero Section */}
        <header className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest border border-teal-500/20">Optimization</span>
            <div className="flex items-center gap-2 text-white/30 text-sm"><Calendar size={14} /><span>March 11, 2026</span></div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            Semantic Caching: Deep Dive into Cost Optimization
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="aspect-video rounded-[3rem] bg-gradient-to-br from-teal-600/20 to-blue-900/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
             <Database size={120} className="text-teal-500/30" />
             <Zap className="absolute top-10 right-10 text-white/10" size={150} />
          </motion.div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-white/60 leading-relaxed mb-8 font-medium">Why pay $0.01 for the same answer over and over? Semantic caching uses vector embeddings to recognize identical queries, even if the phrasing is different.</p>
          
          <h2 className="text-3xl font-bold mt-16 mb-6">Beyond Exact Matches</h2>
          <p className="text-white/50 leading-relaxed mb-8">Traditional caches use MD5 hashes of the request body. If a user changes "Hi" to "Hello", the cache misses. Semantic caching instead maps the *meaning* of the text into a 1536-dimensional vector space. If the cosine similarity is > 0.98, we serve the cached response instantly.</p>

          <div className="my-12 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="text-teal-500" size={20} /> Performance Impact
            </h3>
            <div className="space-y-4 text-white/50">
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                <span>Standard Request</span>
                <span className="font-mono text-white">~1,500ms</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <span>Semantically Cached</span>
                <span className="font-mono text-teal-400">~15ms</span>
              </div>
            </div>
          </div>

          <p className="text-white/50 leading-relaxed mb-8 font-medium italic">"Implementing semantic caching at Frenix reduced our top-tier customer billing by 72% in the first week." - David Chen, Full Stack Lead.</p>
        </article>
      </div>
    </div>
  );
}
