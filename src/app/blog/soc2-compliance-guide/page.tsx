'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ClipboardCheck, History, ArrowLeft, Calendar, Share2, Bookmark, CheckCircle } from 'lucide-react';
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
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">Compliance</span>
            <div className="flex items-center gap-2 text-white/30 text-sm"><Calendar size={14} /><span>March 16, 2026</span></div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            The Enterprise Guide to SOC 2 Compliance in AI
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="aspect-video rounded-[3rem] bg-gradient-to-br from-emerald-600/20 to-teal-900/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
             <ClipboardCheck size={120} className="text-emerald-500/30" />
             <FileText className="absolute bottom-10 right-10 text-white/10" size={200} />
          </motion.div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-white/60 leading-relaxed mb-8">Implementing AI safely means being auditable. For large organizations, SOC 2 isn't just a certificate—it's a promise of trust.</p>
          
          <h2 className="text-3xl font-bold mt-16 mb-6">Why AI Gateways Matter for SOC 2</h2>
          <p className="text-white/50 leading-relaxed mb-8">The core requirement of SOC 2 Type II is documenting every single action taken within your infrastructure. In the world of LLMs, this means logging every request, every prompt, and every system configuration change.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
            {[
              "Immutability of Logs",
              "Access Transparency",
              "Encryption at Rest",
              "Continuous Monitoring"
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                <CheckCircle className="text-emerald-500" size={20} />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6">Automating Audits</h2>
          <p className="text-white/50 leading-relaxed mb-8">Frenix automates this by asynchronously streaming every request event to secure, encrypted Vercel Blob storage. This ensures a zero-latency impact on your users while providing a tamper-proof audit trail for your auditors.</p>
        </article>
      </div>
    </div>
  );
}
