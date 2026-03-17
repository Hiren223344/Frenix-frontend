'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Users, ArrowLeft, Calendar, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 origin-left z-50"
      />

      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Hero Section */}
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
              Security
            </span>
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <Calendar size={14} />
              <span>March 17, 2026</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent"
          >
            Mastering RBAC in AI Gateways
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield size={120} className="text-white/20 blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={80} className="text-white/80" />
              </div>
            </div>
          </motion.div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-white/60 leading-relaxed mb-8 font-medium">
            As enterprises deploy generative AI at scale, controlling who can access which models and endpoints becomes a critical security requirement. Role-Based Access Control (RBAC) is the cornerstone of this infrastructure.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">The Challenge of AI Governance</h2>
          <p className="text-white/50 leading-relaxed mb-8">
            Traditional API gateways focus on simple authentication. However, an AI Gateway must handle complex scenarios: 
            Can a developer use GPT-4 but not Claude 3 Opus? Can a data scientist view billing metrics?
            Frenix solves this with a multi-layered middleware architecture that validates roles in under 1ms.
          </p>

          <div className="my-12 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="text-blue-500" size={20} /> Security Best Practices
            </h3>
            <ul className="space-y-4 text-white/50">
              <li>• Principle of Least Privilege: Assign minimum permissions required.</li>
              <li>• Dynamic Scoping: Restrict keys to specific projects or organizations.</li>
              <li>• Auditability: Every RBAC decision should be logged for SOC 2.</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6">Implementing with Frenix</h2>
          <p className="text-white/50 leading-relaxed mb-8">
            Our RBAC implementation utilizes a high-performance Redis cache to ensure globally distributed parity without adding latency to your AI calls. By mapping user IDs to specific roles, Frenix intercepts every request before it reaches the model provider.
          </p>

          <pre className="p-6 rounded-2xl bg-black border border-white/10 font-mono text-sm overflow-x-auto text-blue-400">
{`// Example role check in Frenix Middleware
const role = await redis.get(\`user:\${userId}:role\`) || 'viewer';
if (!ROLE_PERMISSIONS[role].includes('models:invoke')) {
  throw new ForbiddenError('Insufficient permissions');
}`}
          </pre>
        </article>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div>
              <p className="font-bold text-sm">Hiren Patel</p>
              <p className="text-white/40 text-xs">Principal Engineer, Frenix</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Share2 size={18} />
            </button>
            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Bookmark size={18} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
