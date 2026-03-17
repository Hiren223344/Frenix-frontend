'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EyeOff, ShieldAlert, Cpu, ArrowLeft, Calendar, Share2, Bookmark, Lock } from 'lucide-react';
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
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/20">Privacy</span>
            <div className="flex items-center gap-2 text-white/30 text-sm"><Calendar size={14} /><span>March 15, 2026</span></div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            PII Redaction at the Edge
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="aspect-video rounded-[3rem] bg-gradient-to-br from-red-600/20 to-orange-900/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
             <EyeOff size={120} className="text-red-500/30" />
             <div className="absolute inset-0 border-[20px] border-black/20 m-12 rounded-2xl animate-pulse" />
          </motion.div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-white/60 leading-relaxed mb-8">Sending sensitive user data to LLM providers is one of the biggest risks in GenAI development. Doing redaction at the edge is the only way to ensure compliance.</p>
          
          <h2 className="text-3xl font-bold mt-16 mb-6">The Danger of Data Leakage</h2>
          <p className="text-white/50 leading-relaxed mb-8">Whether it's an accidental paste of a customer ID or a Support agent sharing an email address with a bot, PII (Personally Identifiable Information) leaks are costly and damage company reputation globally.</p>

          <div className="my-12 p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={20} /> Critical Guardrails
            </h3>
            <p className="text-white/60 text-sm mb-6">Frenix's Policy Engine automatically detects and blocks:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Emails", "Social Security Numbers", "Credit Card Details", "Phone Numbers", "Home Addresses", "API Keys"].map(item => (
                <div key={item} className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">{item}</div>
              ))}
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6">Real-time Policy Enforcement</h2>
          <p className="text-white/50 leading-relaxed mb-8">By running regex and intelligent pattern matching on the request stream *before* it leaves your infrastructure, Frenix acts as a secure air-lock for your enterprise data.</p>
        </article>
      </div>
    </div>
  );
}
