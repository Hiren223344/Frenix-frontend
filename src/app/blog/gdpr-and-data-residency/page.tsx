'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, MapPin, ArrowLeft, Calendar, Share2, Bookmark } from 'lucide-react';
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
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-widest border border-rose-500/20">Legal</span>
            <div className="flex items-center gap-2 text-white/30 text-sm"><Calendar size={14} /><span>March 9, 2026</span></div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            GDPR and Data Residency in Global AI
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="aspect-video rounded-[3rem] bg-gradient-to-br from-rose-600/20 to-purple-900/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
             <Globe size={120} className="text-rose-500/30" />
             <MapPin className="absolute bottom-10 left-10 text-white/10" size={150} />
          </motion.div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-white/60 leading-relaxed mb-8">For EU-based customers, data residency isn't optional—it's a legal requirement. Moving AI workloads requires precise geographic routing.</p>
          
          <h2 className="text-3xl font-bold mt-16 mb-6">The Challenges of Localization</h2>
          <p className="text-white/50 leading-relaxed mb-8">Under GDPR, sensitive personal data must stay within the European Economic Area (EEA). When using providers like OpenAI or Anthropic, you must ensure you are using their EU-specific endpoints. Frenix manages this via Region-Aware Routing.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
             <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <h4 className="font-bold text-rose-400 underline mb-4">Direct Routing</h4>
                <p className="text-sm text-white/40">Force requests to 'eu-central-1' based on customerID metadata.</p>
             </div>
             <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <h4 className="font-bold text-rose-400 underline mb-4">Privacy Shield</h4>
                <p className="text-sm text-white/40">Automated deletion of transient data in accordance with Right to be Forgotten.</p>
             </div>
          </div>
        </article>
      </div>
    </div>
  );
}
