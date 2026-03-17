'use client'

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, Terminal, Play } from 'lucide-react';

export default function BuildingAIAgentsPost() {
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
              Tutorial
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-8 text-foreground leading-[1.1]">
            How to Build a Multi-Model AI Agent with Frenix
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Alex Rivera</span>
                <span className="text-[11px] font-medium text-muted-foreground">Published on March 8, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                <Clock size={14} /> 10 min read
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
            src="/blog/ai-agents.png" 
            alt="AI Agent Building" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Building autonomous agents that can reason, plan, and execute tasks requires more than just a single LLM. It requires an orchestration layer that can swap between "reasoning" models and "fast" models in a single workflow.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Step 1: The Reasoning Loop</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            For complex planning, you'll want to use a high-order model like <span className="text-primary font-bold">Claude 3.5 Sonnet</span> or <span className="text-primary font-bold">GPT-4o</span>. In your Frenix configuration, you can set these as your primary reasoning endpoints.
          </p>

          <div className="bg-[#18181b] p-6 rounded-2xl border border-white/5 font-mono text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2 mb-4 text-[#a1a1aa]">
              <Terminal size={16} /> <span className="text-xs uppercase font-bold tracking-widest">agent.js</span>
            </div>
            <pre className="overflow-x-auto">
              <code>{`const response = await fetch('https://api.frenix.sh/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.FRENIX_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o', // Frenix routes this to the best provider
    messages: [{ role: 'user', content: 'Plan a research task...' }]
  })
});`}</code>
            </pre>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Step 2: Switching for Speed</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Once the plan is generated, the agent might need to perform 10-20 smaller sub-tasks (like summarizing search results). For this, routing to a faster, cheaper model like <span className="text-primary font-bold">Gemma 2 9B</span> or <span className="text-primary font-bold">Claude Haiku</span> via Frenix saves both time and cost.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Step 3: Handling Errors Gracefully</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Frenix handles the retry logic and failovers automatically. If your reasoning model hits a rate limit, Frenix can instantly fallback to an equivalent tier model to keep your agent running.
          </p>

          <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl my-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">
                <Play size={16} fill="black" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Live Demo</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Check out our playground to see multi-model agents in action.
            </p>
            <Link href="/playground" className="text-primary font-bold text-sm hover:underline">
              Go to Playground →
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-foreground mt-12">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            By offloading the infrastructure management to Frenix, you can build more complex, reliable agents with less code. Focus on the agent's logic; we'll handle the intelligence delivery.
          </p>
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 p-12 bg-white text-black rounded-[40px] text-center">
          <h2 className="text-3xl font-extrabold tracking-tighter mb-4 !text-black">Start building agents.</h2>
          <p className="text-sm font-medium mb-8 !text-black/60">Unlock 150+ models through a single API key.</p>
          <Link href="/signin" className="inline-flex h-14 px-10 bg-black text-white rounded-2xl items-center justify-center font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </footer>
      </div>
    </article>
  );
}
