'use client'

import { Github, MessageSquare, Twitter, Youtube, ExternalLink, Users, Code, Library } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const communityCards = [
    {
      icon: <MessageSquare size={24} />,
      title: "Discord",
      description: "Join our active community of developers, sharing prompts and building together.",
      link: "https://discord.gg/frenix",
      label: "Join Discord",
      color: "text-[#5865F2]"
    },
    {
      icon: <Github size={24} />,
      title: "GitHub",
      description: "Contribute to our open-source SDKs, examples, and documentation.",
      link: "https://github.com/frenix",
      label: "Star on GitHub",
      color: "text-foreground"
    },
    {
      icon: <Twitter size={24} />,
      title: "Twitter / X",
      description: "Get the latest updates, feature releases, and industry insights.",
      link: "https://twitter.com/frenix_sh",
      label: "Follow Us",
      color: "text-foreground"
    },
    {
      icon: <Youtube size={24} />,
      title: "YouTube",
      description: "Watch our deep-dive tutorials, engineering talks, and product demos.",
      link: "https://youtube.com/frenix",
      label: "Subscribe",
      color: "text-[#FF0000]"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Hero */}
        <div className="mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            Join the <span className="text-muted-foreground">Frenix Community.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Connect with 50,000+ developers building the next generation of AI-native applications. 
            Share knowledge, get support, and help shape the future of machine intelligence.
          </p>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {communityCards.map((card, i) => (
            <a 
              key={i} 
              href={card.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group glass-card p-8 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
            >
              <div>
                <div className={`mb-6 ${card.color}`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">{card.description}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                {card.label} <ExternalLink size={14} />
              </div>
            </a>
          ))}
        </div>

        {/* Contributors Section */}
        <div className="glass-card p-12 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Users size={120} />
          </div>
          
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl font-bold mb-6">Built by developers, for developers.</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Frenix thrives on community contributions. From reporting bugs to suggesting new model providers, 
              your input directly influences our roadmap.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/docs" className="h-12 px-8 rounded-xl bg-white text-black font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Code size={18} /> View Docs
              </Link>
              <Link href="https://github.com/frenix" className="h-12 px-8 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 font-bold text-sm hover:bg-white/10 transition-colors">
                <Library size={18} /> Contribution Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Community Spotlights */}
        <section>
          <h2 className="text-2xl font-bold mb-12 flex items-center gap-3">
            <Users className="text-primary" /> Community Spotlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Showcase</span>
              <h3 className="text-xl font-bold mb-4">PromptAlchemy: A prompt engineering IDE built on Frenix</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "Using the Frenix unified API allowed us to support 15 providers on day one. It shifted our focus from API integration to user experience."
              </p>
              <span className="text-xs font-bold text-foreground">@alex_dev_ai</span>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Tutorial</span>
              <h3 className="text-xl font-bold mb-4">Building a multi-model failover system in 5 minutes</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                A deep dive into using the Frenix dashboard to configure dynamic routing for enterprise applications.
              </p>
              <span className="text-xs font-bold text-foreground">@infra_wizard</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
