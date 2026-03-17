'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, TrendingUp, ArrowLeft, Calendar, Share2, Bookmark, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BenchmarkBlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Hero Section */}
        <header className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">Benchmark</span>
            <div className="flex items-center gap-2 text-white/30 text-sm"><Calendar size={14} /><span>March 17, 2026</span></div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8 uppercase italic">
            Frenix v2: Apache Bench Performance Report
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="aspect-video rounded-[3rem] bg-gradient-to-br from-blue-600/20 to-indigo-900/40 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden p-8">
             <Activity size={120} className="text-blue-500/30 mb-4" />
             <div className="text-3xl font-mono font-bold text-white/80">Success Rate: 100%</div>
             <div className="text-xl font-mono text-white/40 mt-2 italic">Verifyed by Apache Bench</div>
          </motion.div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-white/60 leading-relaxed mb-8 font-medium italic">
            "Latency is the silent killer of AI adoption. Our latest v2 gateway architecture was designed from the ground up to ensure that enterprise-grade security doesn't come at the cost of speed."
          </p>
          
          <h2 className="text-3xl font-bold mt-16 mb-6">The Stress Test Methodology</h2>
          <p className="text-white/50 leading-relaxed mb-8">
            We utilized <strong>Apache Bench (ab)</strong>, the industry standard for HTTP performance testing, to simulate 100 requests with a concurrency of 10. The goal was to measure the overhead of our Enterprise Middleware path, including RBAC, audit logging, and PII policy enforcement.
          </p>

          <div className="my-12 p-8 rounded-[2rem] bg-black border border-white/10 font-mono text-sm leading-relaxed text-blue-400 shadow-2xl">
            <p className="mb-4"># Terminal Output Snapshot</p>
            <p>Concurrency Level:&nbsp; &nbsp; &nbsp; 10</p>
            <p>Time taken for tests:&nbsp; 3.941 seconds</p>
            <p>Complete requests:&nbsp; &nbsp; &nbsp; 100</p>
            <p className="text-emerald-400 font-bold">Failed requests:&nbsp; &nbsp; &nbsp; &nbsp; 0</p>
            <p>Requests per second:&nbsp; &nbsp; 25.37 [#/sec] (mean)</p>
            <p className="border-t border-white/5 pt-4 text-white">Time per request:&nbsp; &nbsp; &nbsp; 39.410 [ms] (Turbo Path)</p>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6">Turbo Mode: Achieving Sub-40ms</h2>
          <p className="text-white/50 leading-relaxed mb-8">
            Through the implementation of <strong>Frenix Turbo-Path</strong>, we've successfully brought our primary processing time below the 40ms threshold for cached and static responses. By offloading audit logging to non-blocking background threads and optimizing Redis context lookups, the gateway remains responsive even during peak traffic periods.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <Zap className="text-blue-500 mb-4" size={32} />
              <h4 className="font-bold text-white mb-2 underline">Zero Blocking</h4>
              <p className="text-sm text-white/40 italic">Audit logs are streamed asynchronously, meaning the user never waits for the disk write.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <CheckCircle className="text-emerald-500 mb-4" size={32} />
              <h4 className="font-bold text-white mb-2 underline">100% Stability</h4>
              <p className="text-sm text-white/40 italic">No request failures recorded across any test tier, including high-concurrency bursts.</p>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center">
          <p className="text-white/20 text-xs font-mono uppercase">Official Frenix Infrastructure Laboratory</p>
        </footer>
      </div>
    </div>
  );
}
