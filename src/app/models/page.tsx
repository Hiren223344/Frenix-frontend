'use client'

import { useState, useEffect, useMemo } from 'react';
import {
    Search, Activity, RefreshCw, Zap, CheckCircle2, AlertTriangle,
    CircleDashed, Clock, type LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ModelStatus = 'operational' | 'degraded' | 'no_data';

interface ModelStat {
    model: string;
    successful: number;
    unsuccessful: number;
    successRate: number;
    avgLatencyMs: number;
    status: ModelStatus;
}

const STATUS_LABEL: Record<ModelStatus, string> = {
    operational: 'Operational',
    degraded: 'Degraded',
    no_data: 'No data',
};

export default function ModelsPage() {
    const [models, setModels] = useState<ModelStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<ModelStatus | 'all'>('all');
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch('/api/gateway/models');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const list: ModelStat[] = Array.isArray(data?.models) ? data.models : [];
            setModels(list);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Fetch error:", error);
            if (!silent) toast.error("Couldn't load model stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        const interval = setInterval(() => fetchData(true), 30000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const counts = useMemo(() => {
        const operational = models.filter(m => m.status === 'operational').length;
        const degraded = models.filter(m => m.status === 'degraded').length;
        const total = models.length;
        return { operational, degraded, total };
    }, [models]);

    const filteredModels = useMemo(() => {
        const q = search.toLowerCase().trim();
        return models
            .filter(m => filter === 'all' || m.status === filter)
            .filter(m => !q || m.model.toLowerCase().includes(q))
            .sort((a, b) => {
                // operational first, then degraded, then no_data; within, by success count desc
                const order = { operational: 0, degraded: 1, no_data: 2 } as const;
                if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
                return b.successful - a.successful;
            });
    }, [models, search, filter]);

    return (
        <div className="min-h-[calc(100vh-56px)] bg-black text-white font-sans">
            <div className="w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                                    Live model telemetry
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Models</h1>
                            <p className="text-sm text-zinc-500 mt-2 max-w-xl">
                                Real-time availability and performance for every model on the Frenix gateway.
                                {lastUpdated && (
                                    <span className="text-zinc-600"> · Updated {lastUpdated}</span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={() => fetchData()}
                            className="self-start sm:self-auto flex items-center gap-2 px-4 h-10 bg-[#080808] border border-[#151515] rounded text-sm text-zinc-400 hover:text-white hover:border-[#222] transition-colors"
                        >
                            <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                            Refresh
                        </button>
                    </div>

                    {/* Summary tiles */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        <SummaryTile
                            label="Total models"
                            value={counts.total}
                            icon={Activity}
                            tone="default"
                        />
                        <SummaryTile
                            label="Operational"
                            value={counts.operational}
                            icon={CheckCircle2}
                            tone="operational"
                        />
                        <SummaryTile
                            label="Degraded"
                            value={counts.degraded}
                            icon={AlertTriangle}
                            tone={counts.degraded > 0 ? 'degraded' : 'default'}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                            <input
                                type="text"
                                placeholder="Search models..."
                                className="w-full bg-[#080808] border border-[#151515] h-10 pl-10 pr-4 rounded text-sm outline-none focus:border-[#333] transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {(['all', 'operational', 'degraded', 'no_data'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-4 h-10 rounded text-sm font-medium whitespace-nowrap border transition-colors",
                                        filter === f
                                            ? "bg-[#151515] border-[#222] text-white"
                                            : "bg-[#080808] border-[#151515] text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {f === 'all' ? 'All' : f === 'no_data' ? 'No data' : STATUS_LABEL[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-zinc-500 font-medium">
                        {filteredModels.length} model{filteredModels.length === 1 ? '' : 's'}
                    </div>
                </div>

                {/* Grid */}
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="p-5 rounded-xl border border-[#151515] bg-[#080808]">
                                    <Skeleton className="h-5 w-40 bg-[#151515] mb-4" />
                                    <Skeleton className="h-4 w-full bg-[#151515] mb-2" />
                                    <Skeleton className="h-4 w-3/4 bg-[#151515]" />
                                </div>
                            ))}
                        </div>
                    ) : filteredModels.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-zinc-500">No models found</p>
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredModels.map((m) => (
                                <ModelCard key={m.model} stat={m} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

function SummaryTile({
    label, value, icon: Icon, tone,
}: {
    label: string; value: number; icon: LucideIcon;
    tone: 'default' | 'operational' | 'degraded';
}) {
    return (
        <div className="p-4 sm:p-5 rounded-xl border border-[#151515] bg-[#080808] flex items-center gap-4">
            <div className={cn(
                "size-10 rounded-lg flex items-center justify-center shrink-0",
                tone === 'operational' && "bg-emerald-500/10 text-emerald-400",
                tone === 'degraded' && "bg-amber-500/10 text-amber-400",
                tone === 'default' && "bg-white/5 text-zinc-400",
            )}>
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <div className="text-2xl font-bold tabular-nums leading-none">{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-1">{label}</div>
            </div>
        </div>
    );
}

function ModelCard({ stat }: { stat: ModelStat }) {
    const isOperational = stat.status === 'operational';
    const isDegraded = stat.status === 'degraded';
    const noData = stat.status === 'no_data';
    const totalRequests = stat.successful + stat.unsuccessful;
    const rate = stat.successRate;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
                "group relative p-5 rounded-xl border bg-[#080808] transition-colors flex flex-col gap-5",
                isOperational && "border-[#151515] hover:border-emerald-500/30",
                isDegraded && "border-amber-500/20 hover:border-amber-500/40",
                noData && "border-[#151515] opacity-70",
            )}
        >
            {/* Status pill */}
            <div className="flex items-center justify-between">
                <StatusBadge status={stat.status} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                    {noData ? '—' : `${totalRequests} req`}
                </span>
            </div>

            {/* Model name */}
            <div className="min-w-0">
                <h3 className="text-[15px] font-bold text-white truncate">{stat.model}</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 mt-1">
                    <Activity size={11} />
                    <span className="font-medium uppercase tracking-wider">
                        {totalRequests > 0 ? `${stat.successful} ok · ${stat.unsuccessful} fail` : 'Awaiting traffic'}
                    </span>
                </div>
            </div>

            {/* Success rate bar */}
            <div>
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Success rate</span>
                    <span className="text-lg font-bold tabular-nums text-white">
                        {noData ? '—' : `${rate}%`}
                    </span>
                </div>
            </div>

            {/* Latency */}
            <div className="flex items-center justify-between pt-4 border-t border-[#111]">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                    <Zap size={12} /> Avg latency
                </span>
                <span className="flex items-center gap-1 text-sm font-mono font-medium text-zinc-300 tabular-nums">
                    <Clock size={12} className="text-zinc-600" />
                    {noData ? '—' : formatLatency(stat.avgLatencyMs)}
                </span>
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: ModelStatus }) {
    const map = {
        operational: { label: STATUS_LABEL.operational, icon: CheckCircle2, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        degraded: { label: STATUS_LABEL.degraded, icon: AlertTriangle, cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        no_data: { label: STATUS_LABEL.no_data, icon: CircleDashed, cls: 'text-zinc-500 bg-white/5 border-[#222]' },
    } as const;
    const { label, icon: Icon, cls } = map[status];
    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border",
            cls
        )}>
            <Icon size={11} />
            {label}
        </div>
    );
}

function formatLatency(ms: number): string {
    if (!ms || ms <= 0) return '—';
    if (ms < 1000) return `${Math.round(ms)} ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}
