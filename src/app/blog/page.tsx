'use client'

import Link from 'next/link';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';

const blogPosts = [
  {
    title: "Top 5 AI Gateways for Developers in 2026: Ranked & Reviewed",
    excerpt: "We analyzed the market and ranked the top 5 AI gateways based on performance, latency, and security. See why Frenix takes the #1 spot.",
    date: "March 17, 2026",
    readTime: "8 min read",
    author: "Frenix Engineering",
    image: "/blog/top-5-gateways.png",
    slug: "top-5-ai-gateways-2026",
    category: "Analysis"
  },
  {
    title: "What is Frenix? The Future of AI Infrastructure",
    excerpt: "Discover how Frenix is revolutionizing the way developers interact with large language models through a unified, high-performance gateway.",
    date: "March 15, 2026",
    readTime: "5 min read",
    author: "Frenix Team",
    image: "/blog/whats-frenix.png",
    slug: "whats-frenix",
    category: "Architecture"
  },
  {
    title: "Why Choose Frenix for Your LLM Orchestration?",
    excerpt: "From latency-aware routing to zero-config failover, learn why leading engineering teams are switching to Frenix for their AI stack.",
    date: "March 12, 2026",
    readTime: "7 min read",
    author: "Infrastructure Group",
    image: "/blog/why-frenix.png",
    slug: "why-frenix",
    category: "Product"
  },
  {
    title: "The Future of LLM Orchestration: Beyond Simple Proxying",
    excerpt: "How the next generation of AI gateways will handle multi-modal payloads, XOR security, and edge-native model execution.",
    date: "March 10, 2026",
    readTime: "6 min read",
    author: "Engineering Lead",
    image: "/blog/future-llm.png",
    slug: "future-of-llm",
    category: "Insights"
  },
  {
    title: "How to Build a Multi-Model AI Agent with Frenix",
    excerpt: "Learn how to orchestrate reasoning and fast models to build autonomous agents that scale efficiently with Frenix.",
    date: "March 8, 2026",
    readTime: "10 min read",
    author: "Alex Rivera",
    image: "/blog/ai-agents.png",
    slug: "building-ai-agents",
    category: "Tutorial"
  }
];

export default function BlogListing() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-foreground leading-tight">
            Insights & <span className="text-muted-foreground">Engineering</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Exploring the intersection of high-performance infrastructure and machine intelligence. 
            Deep dives from the Frenix engineering team.
          </p>
        </div>

        {/* Featured Post (Optional, but let's just do a grid first) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <Link 
              key={idx} 
              href={`/blog/${post.slug}`}
              className="group glass-card overflow-hidden hover:scale-[1.02] transition-all duration-300"
            >
              <div className="aspect-video w-full overflow-hidden bg-white/5 relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</div>
                  <div className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <User size={12} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground/80">{post.author}</span>
                  </div>
                  <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
