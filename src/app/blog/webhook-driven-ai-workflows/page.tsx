'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Send, Code, ArrowLeft, Calendar, Share2, Bookmark, Activity } from 'lucide-react';
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
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-500/20">DevOps</span>
            <div className="flex items-center gap-2 text-white/30 text-sm"><Calendar size={14} /><span>March 8, 2026</span></div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            Webhook-Driven AI Workflows
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="aspect-video rounded-[3rem] bg-gradient-to-br from-cyan-600/20 to-blue-900/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
             <Send size={120} className="text-cyan-500/30" />
             <Activity className="absolute bottom-10 right-10 text-white/10" size={150} />
          </motion.div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none text-white/60">
          <p className="text-xl text-white font-medium mb-8">Infrastructure should be reactive. With Frenix Webhooks, your backend can automatically trigger actions based on real-time AI gateway events.</p>
          
          <h2 className="text-3xl font-bold text-white mb-6">Automating Post-Response Tasks</h2>
          <p className="mb-8">Usually, you have to wait for an LLM to finish, then manually log data to your database or send notifications. Frenix Webhooks move this out-of-band. The moment a request completes, we POST the metadata to your endpoint.</p>

          <pre className="p-8 rounded-2xl bg-black border border-white/5 font-mono text-xs text-cyan-400">
{`{
  "event": "request.completed",
  "data": {
    "model": "gpt-4-turbo",
    "tokens": 452,
    "latency": "1240ms",
    "cost": 0.0045
  }
}`}
          </pre>

          <h2 className="text-3xl font-bold text-white mt-16 mb-6">Budget Alerts & Guards</h2>
          <p className="mb-8">Setup a webhook to ping Slack when a Project reaches 80% of its monthly budget, or kill an API key if it violates a PII policy too many times. This is the power of a programmable AI gateway.</p>
        </article>
      </div>
    </div>
  );
}
