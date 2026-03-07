'use client'

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { GatewayStats } from '@/lib/gateway';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    Activity,
    CheckCircle,
    Coins,
    DollarSign,
    RefreshCw,
    AlertCircle,
    ShieldCheck,
    Database,
    Zap,
    KeyRound,
    User,
    Settings,
    Copy,
    ExternalLink,
    Cpu
} from 'lucide-react';
import CountUp from '@/components/ui/CountUp';
import { motion } from 'framer-motion';

// --- Simplified Classy Sub-components ---

function StatCard({ label, value, icon, sub }: { label: string; value: number | string; icon: React.ReactNode; sub?: string }) {
    return (
        <div className="glass-card p-5 md:p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-muted-foreground/60">{label}</span>
                <div className="text-muted-foreground opacity-30 group-hover:opacity-60 transition-opacity">{icon}</div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-foreground">
                {typeof value === 'number' ? <CountUp to={value} duration={1} separator="," /> : value}
            </div>
            {sub && <div className="text-[10px] text-muted-foreground font-black uppercase tracking-wider opacity-60">{sub}</div>}
        </div>
    );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <span className="text-muted-foreground">{icon}</span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{title}</h3>
        </div>
    );
}

function UsageBar({ name, count, total, index }: { name: string; count: number; total: number; index: number }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground/80">{name}</span>
                <span className="text-muted-foreground">{count.toLocaleString()} calls</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-primary/60 rounded-full"
                />
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="dashboard-container max-w-6xl mx-auto space-y-8 py-12 px-6">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        </div>
    );
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<GatewayStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noKey, setNoKey] = useState(false);
    const [creatingKey, setCreatingKey] = useState(false);
    const [copied, setCopied] = useState(false);

    const supabase = createClient();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/gateway/stats');
            if (res.status === 404) { setNoKey(true); setLoading(false); return; }
            if (!res.ok) throw new Error('Failed to load gateway data');
            const data = await res.json();
            setStats(data);
            setNoKey(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAutoCreateKey = async (currUser: any) => {
        if (!currUser || creatingKey) return;
        setCreatingKey(true);
        try {
            const res = await fetch('/api/gateway/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currUser.email })
            });
            if (res.ok) {
                toast.success('Gateway identity provisioned');
                loadData();
            }
        } catch {
            setError('Gateway unreachable');
        } finally {
            setCreatingKey(false);
        }
    };

    const copyKey = (text: string, isFullKey: boolean) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(isFullKey ? 'Full Key Copied' : 'Prefix Copied');
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const init = async () => {
            const { data: { user: u } } = await supabase.auth.getUser();
            if (!u) { router.push('/signin'); return; }
            setUser(u);
            await loadData();
        };
        init();
    }, [loadData, router, supabase.auth]);

    useEffect(() => {
        if (noKey && user) handleAutoCreateKey(user);
    }, [noKey, user]);

    if (loading && !noKey) return <DashboardSkeleton />;

    if (noKey || creatingKey) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <RefreshCw size={32} className="animate-spin text-primary/40" />
                <h2 className="text-xl font-bold">Initializing Workspace</h2>
                <p className="text-muted-foreground text-sm">Securing your orchestration node...</p>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="dashboard-container max-w-xl mx-auto py-24 px-6 text-center">
                <div className="glass-card p-10 space-y-4">
                    <AlertCircle size={40} className="mx-auto text-rose-500/50" />
                    <h2 className="text-xl font-bold">Node Connection Lost</h2>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <button onClick={() => loadData()} className="btn-primary w-full justify-center">Retry Connection</button>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const models = Object.entries(stats.stats.modelsUsed || {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const totalModelCalls = Object.values(stats.stats.modelsUsed || {}).reduce((a, b) => a + b, 0);

    return (
        <div className="dashboard-container max-w-6xl mx-auto py-12 px-6 space-y-10 animate-fade">
            {/* Header: Classy & Simple */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Gateway</h1>
                    <p className="text-sm text-muted-foreground">Monitoring node: <span className="text-foreground">Active</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/billing" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Settings size={18} />
                    </Link>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Traffic" value={stats.stats.totalRequests || 0} icon={<Activity size={16} />} sub={`${stats.stats.failedRequests || 0} failed`} />
                <StatCard label="Node Latency" value="34ms" icon={<Zap size={16} />} sub="Global avg" />
                <StatCard label="Token Consumption" value={stats.stats.tokens?.total || 0} icon={<Coins size={16} />} sub="Prompt + Completion" />
                <StatCard label="Computed Cost" value={`$${(stats.stats.totalCostUsd || 0).toFixed(4)}`} icon={<DollarSign size={16} />} sub="Estimated USD" />
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Traffic Distribution */}
                <div className="lg:col-span-2 glass-card p-8 border-white/5">
                    <SectionHeader title="Model Distribution" icon={<Cpu size={14} />} />
                    {models.length > 0 ? (
                        <div className="pt-2">
                            {models.map(([name, count], i) => (
                                <UsageBar key={name} name={name} count={count} total={totalModelCalls} index={i} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground py-10 text-center">No model usage recorded yet.</p>
                    )}
                </div>

                {/* Right: Identity & Tier */}
                <div className="space-y-6">
                    <div className="glass-card p-8 border-white/5 space-y-6">
                        <SectionHeader title="Service Identity" icon={<ShieldCheck size={14} />} />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                                <span className="text-xs font-medium truncate max-w-[150px]">{user?.email}</span>
                                <Link href="/account" className="text-muted-foreground hover:text-primary"><ExternalLink size={12} /></Link>
                            </div>
                            <div className="relative group/key">
                                <code className="block bg-black/20 p-4 pr-12 rounded-xl border border-white/5 text-[11px] font-mono text-muted-foreground truncate transition-colors group-hover/key:border-primary/30">
                                    {stats.plainKey ? stats.plainKey : `${stats.keyPrefix}••••••••••••••••••••`}
                                </code>
                                <button
                                    onClick={() => copyKey(stats.plainKey || stats.keyPrefix, !!stats.plainKey)}
                                    className={cn(
                                        "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                                        copied
                                            ? "text-emerald-500 bg-emerald-500/10"
                                            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    )}
                                    title={stats.plainKey ? "Copy Full Key" : "Copy Prefix"}
                                >
                                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 text-center">
                                {stats.plainKey ? "Full key is available for copying." : "Only the prefix is stored in this session."}
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle size={16} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tight">{stats.tier || 'Standard'} Tier</span>
                            </div>
                            <Link href="/billing" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Manage</Link>
                        </div>

                        <div className="pt-2 space-y-3">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Usage Remaining</p>
                                <p className="text-xs font-bold">
                                    {(Math.max(0, (stats.tier?.toLowerCase() === 'pro' ? 1000000 : 100000) - (stats.stats.totalRequests || 0))).toLocaleString()}
                                    <span className="text-muted-foreground/60 ml-1">calls</span>
                                </p>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, ((stats.stats.totalRequests || 0) / (stats.tier?.toLowerCase() === 'pro' ? 1000000 : 100000)) * 100)}%` }}
                                    className="h-full bg-primary/40 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
