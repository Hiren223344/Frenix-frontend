'use client'

import { ArrowRight, Briefcase, Globe, Heart, Rocket, Users } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  const openings = [
    { title: "Staff Rust Engineer", team: "Infrastructure", Type: "Full-time", location: "Remote / London" },
    { title: "Senior Frontend Engineer", team: "Product", Type: "Full-time", location: "Remote / NYC" },
    { title: "AI Research Engineer", team: "Core Intelligence", Type: "Full-time", location: "Remote" },
    { title: "DevRel Lead", team: "Community", Type: "Full-time", location: "Remote" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Hero */}
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-foreground">
            Build the future of <span className="text-muted-foreground">AI Infrastructure.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We're a small, distributed team of engineers and designers building the orchestration layer for the machine intelligence era.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: <Rocket size={24} />, title: "Velocity", text: "We ship daily. Our users move fast, and so do we. We prefer action over perfect consensus." },
            { icon: <Heart size={24} />, title: "Autonomy", text: "We hire experts and trust them. You own your projects from conception to production." },
            { icon: <Globe size={24} />, title: "Remote-First", text: "Talent is everywhere. We work across time zones and cultures to build the best product." }
          ].map((v, i) => (
            <div key={i} className="glass-card p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <section className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Competitive Salary", "Equity Options", "Home Office Stipend", "Health Insurance",
              "Unlimited PTO", "Learning Budget", "Annual Retreats", "Modern Tech Stack"
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-foreground/80">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Open Roles */}
        <section id="openings">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Open Roles</h2>
            <Link href="mailto:careers@frenix.sh" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              Don't see a role? Reach out anyway →
            </Link>
          </div>
          
          <div className="space-y-4">
            {openings.map((job, i) => (
              <div key={i} className="group glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.03] transition-colors cursor-pointer">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.team}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} /> {job.Type}</span>
                    <span className="flex items-center gap-1.5"><Globe size={14} /> {job.location}</span>
                  </div>
                </div>
                <button className="h-12 px-8 rounded-xl bg-white text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
