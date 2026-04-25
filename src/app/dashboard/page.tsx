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
    Settings,
    Copy,
    ExternalLink,
    Cpu,
    Zap,
    KeyRound,
    Lock,
    ArrowUpRight
} from 'lucide-react';
import CountUp from '@/components/ui/CountUp';
import { motion, AnimatePresence } from 'framer-motion';
import { decrypt } from '@/lib/encryption';
import dynamic from 'next/dynamic';

const DashboardTipCard = dynamic(() => import('@/components/ui/DashboardTipCard'), { ssr: false });
const FloatingAssistant = dynamic(() => import('@/components/ui/FloatingAssistant'), { ssr: false });

// --- Advanced Motion Graphics Components ---

function DynamicBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#020202] overflow-hidden pointer-events-none">
            {/* Ambient Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );
}

// --- Simplified Classy Sub-components ---

function StatCard({ label, value, icon, sub, trend }: { label: string; value: number | string; icon: React.ReactNode; sub?: string; trend?: string }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="glass-card p-5 md:p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-muted-foreground/60">{label}</span>
                <span className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors">{icon}</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-foreground flex items-baseline gap-1">
                {typeof value === 'number' ? <CountUp to={value} duration={0.8} separator="," /> : value}
                {trend && <span className="text-[10px] text-emerald-500 font-bold ml-1">{trend}</span>}
            </div>
            {sub && <div className="text-[10px] text-muted-foreground font-black uppercase tracking-wider opacity-60">{sub}</div>}
        </motion.div>
    );
}

function SectionHeader({ title, icon, action }: { title: string; icon: React.ReactNode; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground/60">{icon}</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{title}</h3>
            </div>
            {action}
        </div>
    );
}

function UsageBar({ name, count, total }: { name: string; count: number; total: number; index: number }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-2 mb-4 group/bar">
            <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground/80 group-hover/bar:text-primary transition-colors">{name}</span>
                <span className="text-muted-foreground">{count.toLocaleString()} calls</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary/40 to-primary/80 rounded-full"
                />
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="dashboard-container max-w-7xl mx-auto space-y-8 py-12 px-6">
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
                <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
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
    const [isDecrypted, setIsDecrypted] = useState(false);

    const supabase = createClient();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/gateway/stats');
            
            if (res.status === 404) { setNoKey(true); setLoading(false); return; }
            
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to load gateway data');
            }
            
            const rawData = await res.json();
            
            if (rawData.encrypted && rawData.payload) {
                const decryptedStr = decrypt(rawData.payload);
                const data = JSON.parse(decryptedStr);
                setStats(data);
                setIsDecrypted(true);
            } else {
                setStats(rawData);
            }
            
            setNoKey(false);
            setError('');
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

    if (loading && !noKey && !stats) return <DashboardSkeleton />;

    if (noKey || creatingKey) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <RefreshCw size={32} className="animate-spin text-primary/40" />
                <h2 className="text-xl font-bold font-black uppercase tracking-tighter">Initializing Node</h2>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-40">Securing your orchestration node...</p>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="dashboard-container max-w-xl mx-auto py-24 px-6 text-center">
                <div className="glass-card p-10 space-y-4 border-rose-500/20">
                    <AlertCircle size={40} className="mx-auto text-rose-500/50" />
                    <h2 className="text-xl font-bold">Connection Failed</h2>
                    <p className="text-sm text-muted-foreground mb-6 font-mono text-xs">{error}</p>
                    <button 
                        onClick={() => loadData()}
                        className="px-6 py-2 bg-primary/20 hover:bg-primary/30 rounded-xl text-primary font-bold text-xs transition-all uppercase tracking-widest"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const models = Object.entries(stats.stats.modelsUsed || {}).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 10);
    const totalModelCalls = Object.values(stats.stats.modelsUsed || {}).reduce((a: number, b: any) => a + (b as number), 0);

    return (
        <div className="min-h-screen">
            <DynamicBackground />
            
            <div className="dashboard-container max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 space-y-8 animate-fade h-full">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-8 gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                             <h1 className="text-2xl md:text-3xl font-black tracking-tighter">GATEWAY V2</h1>
                             {isDecrypted && (
                                 <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1"
                                 >
                                    <Lock size={8} /> Secure Session
                                 </motion.div>
                             )}
                        </div>
                        <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            Enterprise Orchestration & Analytics
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => loadData()}
                            className="flex-1 md:flex-none flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </motion.button>
                        <Link href="/billing" className="flex-1 md:flex-none flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground transition-colors">
                            <Settings size={18} />
                        </Link>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardTipCard totalRequests={stats.stats.totalRequests || 0} />
                    <StatCard label="Token Volume" value={stats.stats.tokens?.total || 0} icon={<Coins size={16} />} sub="Prompt + Completion" />
                    <StatCard label="Operational Cost" value={`$${(stats.stats.totalCostUsd || 0).toFixed(4)}`} icon={<DollarSign size={16} />} sub="Estimated USD Billing" />
                    <StatCard label="Success Rate" value={`${(( (stats.stats.totalRequests - stats.stats.failedRequests) / stats.stats.totalRequests ) * 100 || 100).toFixed(1)}%`} icon={<Zap size={16} />} sub="Upstream Stability" />
                </div>

                {/* Secondary Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Distribution Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 glass-card p-8 border-white/5 bg-black/40 backdrop-blur-md rounded-3xl"
                    >
                        <SectionHeader 
                            title="Intelligence Distribution" 
                            icon={<Cpu size={14} />} 
                            action={<span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-lg uppercase tracking-widest">Realtime</span>}
                        />
                        {models.length > 0 ? (
                            <div className="pt-2 space-y-6">
                                <AnimatePresence mode="popLayout">
                                    {models.map(([name, count], i) => (
                                        <UsageBar key={name} name={name} count={count as number} total={totalModelCalls} index={i} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                                <Activity size={48} strokeWidth={1} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Latency Node Inactive</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Profile & Info Section */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-8 border-white/5 bg-white/[0.01] backdrop-blur-md rounded-3xl space-y-8"
                        >
                            <SectionHeader title="Service Profile" icon={<ShieldCheck size={14} />} />
                            <div className="space-y-4">
                                <div className="group/item flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Authenticated Account</span>
                                        <span className="text-xs font-bold truncate max-w-[180px]">{user?.email}</span>
                                    </div>
                                    <Link href="/account" className="p-2 rounded-lg bg-white/5 opacity-0 group-hover/item:opacity-100 transition-opacity"><ExternalLink size={12} /></Link>
                                </div>
                                
                                <div className="relative group/key">
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Bearer Identity</span>
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Active</span>
                                    </div>
                                    <code className="block bg-black/40 p-5 rounded-2xl border border-white/5 text-[11px] font-mono text-muted-foreground/80 truncate transition-all group-hover/key:border-primary/30 group-hover/key:text-foreground">
                                        {stats.plainKey ? stats.plainKey : `${stats.keyPrefix}••••••••••••••••••••`}
                                    </code>
                                    <button
                                        onClick={() => copyKey(stats.plainKey || stats.keyPrefix, !!stats.plainKey)}
                                        className={cn(
                                            "absolute right-3 bottom-3 p-2 rounded-xl transition-all shadow-xl",
                                            copied
                                                ? "text-emerald-500 bg-emerald-500/10"
                                                : "text-muted-foreground hover:text-primary hover:bg-primary/20 bg-white/5"
                                        )}
                                    >
                                        {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <SectionHeader title="Plan Constraints" icon={<KeyRound size={12} />} />
                                <div className="mt-4 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">{stats.tier || 'Standard'} Tier</p>
                                        <p className="text-xs font-black">
                                            <CountUp to={Math.max(0, (stats.tier?.toLowerCase() === 'pro' ? 1000000 : 100000) - (stats.stats.totalRequests || 0))} duration={1.2} />
                                            <span className="text-muted-foreground/40 ml-1">Credits</span>
                                        </p>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, ((stats.stats.totalRequests || 0) / (stats.tier?.toLowerCase() === 'pro' ? 1000000 : 100000)) * 100)}%` }}
                                            transition={{ duration: 1.5, ease: "anticipate" }}
                                            className="h-full bg-primary/60 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 px-4 py-8 border-t border-white/5">
                    <span>Cluster Identity: GWS-409</span>
                    <span>Session: Encrypted</span>
                    <span>Frenix Infrastructure Group</span>
                </div>
            </div>


            <style jsx global>{`
                .glass-card {
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
