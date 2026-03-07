'use client'

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    CreditCard,
    CheckCircle2,
    Zap,
    Crown,
    History,
    Download,
    Plus,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    Building2,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function BillingPage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user: u } } = await supabase.auth.getUser();
            if (!u) {
                router.push('/signin');
                return;
            }
            setUser(u);

            // Try to load basic stats/tier
            try {
                const res = await fetch('/api/gateway/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Stats load error:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [router, supabase.auth]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="loader w-10 h-10 border-primary border-t-transparent animate-spin rounded-full border-4" />
        </div>
    );

    const invoices = [
        { id: 'INV-001', date: 'Mar 1, 2024', status: 'Paid', amount: '$0.00', method: 'Visa •••• 4242' },
        { id: 'INV-002', date: 'Feb 1, 2024', status: 'Paid', amount: '$0.00', method: 'Visa •••• 4242' },
    ];

    const currentTier = (stats?.tier || 'free').toLowerCase();

    return (
        <div className="max-w-6xl mx-auto py-8 lg:py-16 px-6">
            {/* Header Section */}
            <div className="mb-10 lg:mb-16 animate-fade">
                <div className="flex flex-col gap-3">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] text-primary/80 bg-primary/5 w-fit px-4 py-1.5 rounded-lg border border-primary/10">
                        SUBSCRIPTION MANAGEMENT
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter text-foreground">Current Tier</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed font-medium">
                        Manage your subscription tier, billing methods, and usage expansion at the speed of thought.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Plan Card */}
                    <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[48px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-125 group-hover:scale-150 transition-transform duration-1000 pointer-events-none text-foreground">
                            {currentTier === 'pro' ? <Crown size={200} /> : <Zap size={200} />}
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Active now</span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-foreground flex items-baseline gap-2">
                                        {currentTier === 'pro' ? 'Pro Excellence' : 'Free Starter'}
                                        <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">/ Monthly</span>
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        'Unlimited API Keys Generation',
                                        'Single Unified AI Endpoint Cluster',
                                        'Real-time Performance Metrics'
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold text-foreground opacity-70">
                                            <CheckCircle2 size={16} className="text-primary" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">
                                        Next Cycle: <span className="text-foreground">April 01, 2024</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 min-w-[220px]">
                                {currentTier === 'free' && (
                                    <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-widest uppercase hover:opacity-95 transition-opacity">
                                        UPGRADE TO PRO <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                )}
                                <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground font-bold text-xs uppercase tracking-widest transition-all">
                                    MANAGE SUBSCRIPTION
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] group hover:bg-white/[0.04] transition-all">
                            <div className="flex justify-between items-start mb-10">
                                <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <Sparkles size={24} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-2xl font-black text-foreground">$10</span>
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">per month</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">Pro Developer</h3>
                            <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-8">
                                For individuals scaling their AI products with guaranteed quality.
                            </p>
                            <ul className="space-y-3 mb-10">
                                {['Advanced Analytics', 'Priority Routing', 'Extended Quotas'].map(f => (
                                    <li key={f} className="text-[10px] font-black uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary/40" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-foreground font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">Select Pro</Button>
                        </div>

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] group hover:bg-white/[0.04] transition-all">
                            <div className="flex justify-between items-start mb-10">
                                <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                    <Building2 size={24} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-2xl font-black text-foreground">Usage</span>
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">Custom scale</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">Enterprise</h3>
                            <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-8">
                                Purpose-built infrastructure for teams with high-security needs.
                            </p>
                            <ul className="space-y-3 mb-10">
                                {['Custom Regions', 'SSO Integration', 'SLA Guarantees'].map(f => (
                                    <li key={f} className="text-[10px] font-black uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-blue-500/40" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-foreground font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">Talk to Sales</Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[24px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                <CreditCard size={14} /> PAYMENT METHODS
                            </h3>
                            <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
                                Add
                            </button>
                        </div>

                        <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.03] transition-colors group">
                            <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/40 group-hover:scale-110 transition-transform">
                                <Plus size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Add Provider</span>
                        </div>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[24px]">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 inline-flex items-center gap-2 mb-6">
                            <History size={14} /> INVOICE HISTORY
                        </h3>

                        <div className="space-y-3">
                            {invoices.map((inv, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity">
                                            <History size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-foreground leading-tight uppercase tracking-tighter">{inv.id}</p>
                                            <p className="text-[9px] text-muted-foreground/60 font-medium">March 2024</p>
                                        </div>
                                    </div>
                                    <button className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                        <Download size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[24px] flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/80">Verified Gateway</h4>
                            <p className="text-[10px] text-muted-foreground/60 leading-tight mt-1 truncate">
                                256-bit AES Encryption Protocol Active
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-16 gap-6">
                <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 group">
                    <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Terminal
                </Link>
                <div className="flex items-center gap-6 opacity-20 filter grayscale">
                    {/* Placeholder for small security icons */}
                    <Lock size={14} />
                    <Sparkles size={14} />
                    <Building2 size={14} />
                </div>
            </div>
        </div>
    );
}
