'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, 
    Zap, 
    Crown, 
    Shield, 
    ArrowRight, 
    Globe, 
    Cpu, 
    BarChart3, 
    Infinity,
    ChevronDown,
    Lock,
    Sparkles,
    Terminal,
    Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Components ---

function DynamicBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#020202] overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );
}

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/5 py-6">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left group"
            >
                <span className="text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{question}</span>
                <ChevronDown className={cn("size-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180 text-emerald-400")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "anticipate" }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PricingCard = ({ 
    tier, 
    price, 
    description, 
    features, 
    isPopular, 
    cta, 
    icon: Icon,
    isYearly
}: { 
    tier: string, 
    price: string, 
    description: string, 
    features: string[], 
    isPopular?: boolean,
    cta: string,
    icon: any,
    isYearly: boolean
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={cn(
                "glass-card p-8 md:p-10 flex flex-col h-full relative overflow-hidden group",
                isPopular ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
            )}
        >
            {isPopular && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg shadow-emerald-500/20 z-20">
                    Most Advanced
                </div>
            )}

            <div className="relative z-10 flex-1">
                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Icon size={24} />
                </div>

                <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-black uppercase tracking-widest text-white">{tier}</h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{description}</p>
                </div>

                <div className="mb-10">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{price}</span>
                        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                            {price === 'Custom' ? '' : (isYearly ? '/ Year' : '/ Month')}
                        </span>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 group/feat">
                            <div className="mt-1 size-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover/feat:scale-110 transition-transform">
                                <Check size={10} strokeWidth={3} />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-foreground/70">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Link 
                href="/signin"
                className={cn(
                    "w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-[0.2em] transition-all relative z-10",
                    isPopular 
                        ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-xl shadow-emerald-500/10" 
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                )}
            >
                {cta} <ArrowRight size={16} />
            </Link>
            
            {/* Background Decor */}
            <div className="absolute -bottom-10 -right-10 size-40 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
        </motion.div>
    );
};

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div className="min-h-screen selection:bg-emerald-500 selection:text-black">
            <DynamicBackground />
            
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
                {/* Hero Header */}
                <div className="text-center space-y-8 mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500"
                    >
                        <Sparkles size={12} /> Flexible Intelligence
                    </motion.div>
                    
                    <div className="space-y-4">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white"
                        >
                            Orchestration, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                                Scaled for You.
                            </span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
                        >
                            Choose the plan that fits your execution volume. From independent developers to global enterprises, we provide the gateway to next-gen AI.
                        </motion.p>
                    </div>

                    {/* Billing Toggle */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4 pt-4"
                    >
                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", !isYearly ? "text-white" : "text-muted-foreground")}>Monthly</span>
                        <button 
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-14 h-7 rounded-full bg-white/5 border border-white/10 p-1 relative transition-colors hover:border-emerald-500/30"
                        >
                            <motion.div 
                                animate={{ x: isYearly ? 28 : 0 }}
                                className="size-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"
                            />
                        </button>
                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2", isYearly ? "text-white" : "text-muted-foreground")}>
                            Yearly <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[8px] border border-emerald-500/20">Save 20%</span>
                        </span>
                    </motion.div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-32">
                    <PricingCard 
                        tier="Free Starter"
                        price="$0"
                        description="For hobbyists and early-stage orchestration testing."
                        features={[
                            "100k Monthly Credits",
                            "Community Model Access",
                            "Standard Routing Priority",
                            "Public API Documentation",
                            "Dashboard Analytics"
                        ]}
                        cta="Get Started Free"
                        icon={Terminal}
                        isYearly={isYearly}
                    />
                    <PricingCard 
                        tier="Pro Excellence"
                        price={isYearly ? "$8" : "$10"}
                        description="For builders scaling production-grade AI applications."
                        features={[
                            "1M Monthly Credits",
                            "Elite Models (Claude 3.5, Gemini 1.5 Pro)",
                            "High-Priority Routing",
                            "Extended Rate Limits",
                            "Dedicated Usage Insights",
                            "Advanced Security Protocol"
                        ]}
                        isPopular
                        cta="Upgrade to Pro"
                        icon={Zap}
                        isYearly={isYearly}
                    />
                    <PricingCard 
                        tier="Enterprise"
                        price="Custom"
                        description="For organizations requiring infinite scale and SLAs."
                        features={[
                            "Unlimited Monthly Credits",
                            "Private Model Clusters",
                            "Custom Region Deployments",
                            "Full RBAC & SSO Control",
                            "24/7 Dedicated Support",
                            "Audit Logs & Compliance"
                        ]}
                        cta="Contact Sales"
                        icon={Crown}
                        isYearly={isYearly}
                    />
                </div>

                {/* Comparison Table Section */}
                <div className="space-y-16 mb-40">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase">Feature Matrix</h2>
                        <p className="text-muted-foreground text-xs md:text-sm font-bold tracking-widest uppercase opacity-40">Granular Orchestration Control</p>
                    </div>

                    <div className="overflow-x-auto pb-4 scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Feature</th>
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-white">Free</th>
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-emerald-500">Pro</th>
                                    <th className="py-8 px-6 text-[10px] font-black uppercase tracking-widest text-white">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold">
                                {[
                                    ['Token Credits', '100,000 / mo', '1,000,000 / mo', 'Unlimited'],
                                    ['Model Access', 'Standard Only', 'Full Elite Library', 'Private Clusters'],
                                    ['Routing Priority', 'Normal', 'High Priority', 'Instant Access'],
                                    ['Rate Limits', 'Basic', 'Extended (3x)', 'Uncapped'],
                                    ['Security', 'Standard AES', 'Advanced Encryption', 'Custom SSO/RBAC'],
                                    ['Support', 'Community', 'Priority Email', '24/7 Dedicated Agent'],
                                    ['Custom Regions', 'N/A', 'N/A', 'Any AWS/GCP/Azure'],
                                ].map(([feature, free, pro, enterprise], i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                                        <td className="py-6 px-6 text-white/60 group-hover:text-white transition-colors">{feature}</td>
                                        <td className="py-6 px-6 text-muted-foreground/40">{free}</td>
                                        <td className="py-6 px-6 text-emerald-500/80">{pro}</td>
                                        <td className="py-6 px-6 text-white/80">{enterprise}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto space-y-16 mb-40">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase">Common Queries</h2>
                        <p className="text-muted-foreground text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Transparency in Orchestration</p>
                    </div>
                    
                    <div className="space-y-2">
                        <FAQItem 
                            question="What are 'Credits' exactly?" 
                            answer="Credits represent the token volume you can process through the Frenix Gateway. 1 Credit typically equals 1 model token (input + output). Advanced models may have a multiplier depending on their compute intensity."
                        />
                        <FAQItem 
                            question="Can I upgrade or downgrade anytime?" 
                            answer="Yes. Upgrades are processed instantly. Downgrades take effect at the end of your current billing cycle. We pro-rate any remaining credits from your previous plan."
                        />
                        <FAQItem 
                            question="What happens if I exceed my monthly limit?" 
                            answer="Once you hit your limit, your API requests will return a 402 Payment Required error. You can manually purchase a credit top-up or wait for your cycle to reset."
                        />
                        <FAQItem 
                            question="Is my data used for training?" 
                            answer="Absolutely not. Frenix acts as a secure proxy. We do not store your prompts or responses, and we certainly do not use them to train any underlying models."
                        />
                        <FAQItem 
                            question="Do you offer student or non-profit discounts?" 
                            answer="We do! Please contact our team with proof of your status, and we'll provision a special quota for your project."
                        />
                    </div>
                </div>

                {/* Final CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-emerald-500 to-blue-600 relative overflow-hidden text-center space-y-8"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase">Ready to scale?</h2>
                        <p className="text-black/60 text-sm md:text-lg max-w-xl mx-auto font-bold uppercase tracking-widest leading-relaxed">
                            Join over 5,000 developers building the future of autonomous intelligence.
                        </p>
                        <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link 
                                href="/signin"
                                className="px-10 py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:scale-105 transition-transform"
                            >
                                Deploy Your Node
                            </Link>
                            <Link 
                                href="/contact"
                                className="px-10 py-5 bg-white/20 backdrop-blur-xl border border-white/30 text-black rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:bg-white/30 transition-all"
                            >
                                Talk to Expert
                            </Link>
                        </div>
                    </div>
                    
                    {/* Floating icons */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 left-10 text-black/10"
                    >
                        <Rocket size={100} strokeWidth={1} />
                    </motion.div>
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 right-10 text-black/10"
                    >
                        <Cpu size={120} strokeWidth={1} />
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer Sub-link */}
            <div className="text-center pb-20 opacity-20 hover:opacity-100 transition-opacity">
                <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                    Return to Terminal Infrastructure
                </Link>
            </div>
        </div>
    );
}
