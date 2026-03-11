'use client'

import { useState, useEffect, useMemo } from 'react';
import {
    Search, Cpu, Image as ImageIcon, Music, Video as VideoIcon,
    Binary, Info, ChevronRight, Zap, Copy, Check, Filter,
    Globe, Shield, Activity, ChevronDown,
    MessageSquare, FileText, Code2, LayoutGrid, List as ListIcon,
    ArrowUpDown, Clock, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Model {
    id: string;
    object: string;
    created: number;
    owned_by: string;
    is_pro?: boolean;
}

interface Pricing {
    chat: Record<string, { prompt: number; completion: number }>;
    images: Record<string, { per_image: number }>;
    audio: Record<string, { per_character?: number; per_minute?: number }>;
    embeddings: Record<string, { per_token: number }>;
    videos: Record<string, { per_video: number }>;
}

export default function ModelsPage() {
    const [models, setModels] = useState<Model[]>([]);
    const [pricing, setPricing] = useState<Pricing | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(30);
    const [sortBy, setSortBy] = useState<'newest' | 'name' | 'provider'>('newest');

    const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3000';

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let normalizedUrl = gatewayUrl.replace(/\/$/, '');
                if (!normalizedUrl.startsWith('http')) {
                    normalizedUrl = `http://${normalizedUrl}`;
                }

                const [modelsRes, pricingRes] = await Promise.allSettled([
                    fetch(`${normalizedUrl}/v1/models`),
                    fetch(`${normalizedUrl}/v1/pricing`)
                ]);

                if (modelsRes.status === 'fulfilled' && modelsRes.value.ok) {
                    const modelsData = await modelsRes.value.json();
                    const rawModels = modelsData.data || [];
                    const uniqueModels: Model[] = [];
                    const seenIds = new Set();

                    for (const m of rawModels) {
                        if (!seenIds.has(m.id)) {
                            seenIds.add(m.id);
                            uniqueModels.push(m);
                        }
                    }
                    setModels(uniqueModels);
                }

                if (pricingRes.status === 'fulfilled' && pricingRes.value.ok) {
                    const pricingData = await pricingRes.value.json();
                    setPricing(pricingData);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [gatewayUrl]);

    const getCategory = (model: Model) => {
        const id = model.id.toLowerCase();
        if (pricing?.images[id] || model.object === 'image') return 'images';
        if (pricing?.audio[id] || id.includes('whisper') || id.includes('tts')) return 'audio';
        if (pricing?.videos[id] || model.object === 'video') return 'videos';
        if (pricing?.embeddings[id] || id.includes('embedding')) return 'embeddings';
        return 'chat';
    };

    const getPriceInfo = (model: Model) => {
        const id = model.id;
        const category = getCategory(model);

        if (category === 'chat') {
            const p = pricing?.chat[id] || pricing?.chat.default;
            if (!p) return null;
            return {
                type: 'tokens',
                input: (p.prompt * 1000000).toFixed(2),
                output: (p.completion * 1000000).toFixed(2)
            };
        }
        if (category === 'images') {
            const p = pricing?.images[id];
            if (!p) return null;
            return { type: 'image', price: p.per_image.toFixed(3) };
        }
        if (category === 'videos') {
            const p = pricing?.videos[id] || pricing?.videos.default;
            if (!p) return null;
            return { type: 'video', price: p.per_video.toFixed(2) };
        }
        if (category === 'audio') {
            const p = pricing?.audio[id];
            if (!p) return null;
            if (p.per_character) return { type: 'audio-char', price: (p.per_character * 1000).toFixed(3) };
            if (p.per_minute) return { type: 'audio-min', price: p.per_minute.toFixed(3) };
        }
        if (category === 'embeddings') {
            const p = pricing?.embeddings[id] || pricing?.embeddings.default;
            if (!p) return null;
            return { type: 'embed', price: (p.per_token * 1000000).toFixed(4) };
        }
        return null;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredModels = useMemo(() => {
        let res = models.filter(model => {
            const matchesSearch = model.id.toLowerCase().includes(search.toLowerCase()) ||
                model.owned_by.toLowerCase().includes(search.toLowerCase());
            const category = getCategory(model);
            const matchesTab = activeTab === 'all' || activeTab === category;
            return matchesSearch && matchesTab;
        });

        if (sortBy === 'newest') res.sort((a, b) => b.created - a.created);
        else if (sortBy === 'name') res.sort((a, b) => a.id.localeCompare(b.id));
        else if (sortBy === 'provider') res.sort((a, b) => a.owned_by.localeCompare(b.owned_by));

        return res;
    }, [models, search, activeTab, sortBy]);

    const displayedModels = filteredModels.slice(0, visibleCount);

    return (
        <div className="flex h-[calc(100vh-56px)] bg-black text-white font-sans overflow-hidden">
            {/* Left Sidebar */}
            <aside className="w-[240px] border-r border-[#151515] flex flex-col pt-4 px-2 shrink-0 overflow-y-auto">
                <div className="py-4 space-y-6">
                    <section className="space-y-1">
                        <header className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 flex items-center justify-between">
                            Input Modalities
                            <ChevronDown size={10} />
                        </header>
                        {[
                            { id: 'chat', label: 'Text', icon: MessageSquare },
                            { id: 'images', label: 'Image', icon: ImageIcon },
                            { id: 'audio', label: 'Audio', icon: Music },
                            { id: 'videos', label: 'Video', icon: VideoIcon, badge: 'New' }
                        ].map(item => (
                            <button
                                key={item.label}
                                onClick={() => setActiveTab(activeTab === item.id ? 'all' : item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${activeTab === item.id ? 'bg-[#111] text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#080808]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={16} />
                                    {item.label}
                                </div>
                                {item.badge && <span className="text-[10px] bg-primary/20 text-primary px-1 rounded italic font-bold">{item.badge}</span>}
                            </button>
                        ))}
                    </section>

                    <section className="space-y-1">
                        <header className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Output Modalities</header>
                        {[
                            { id: 'chat', label: 'Text', icon: MessageSquare },
                            { id: 'images', label: 'Image', icon: ImageIcon },
                            { id: 'audio', label: 'Audio', icon: Music, badge: 'New' },
                            { id: 'embeddings', label: 'Embeddings', icon: Binary }
                        ].map(item => (
                            <button
                                key={item.label}
                                className="w-full flex items-center justify-between px-3 py-2 rounded text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={16} />
                                    {item.label}
                                </div>
                            </button>
                        ))}
                    </section>

                    <section className="space-y-1 pt-4 border-t border-[#151515]">
                        <div className="px-3 text-[12px] text-zinc-600 font-medium">
                            <h4 className="flex items-center gap-2 mb-2"><Shield size={14} /> Enterprise</h4>
                            <p className="text-[11px] leading-relaxed">Contact us for custom routing and private deployments.</p>
                        </div>
                    </section>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col pt-4 overflow-y-auto no-scrollbar">
                <div className="w-full px-12 py-4">
                    {/* Top Header */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Models</h1>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-zinc-500 hover:text-white transition-colors bg-[#0a0a0a] border border-[#151515] rounded">
                                    <LayoutGrid size={18} />
                                </button>
                                <button className="p-2 text-white bg-[#151515] border border-[#222] rounded">
                                    <ListIcon size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search models..."
                                    className="w-full bg-[#080808] border border-[#151515] h-10 pl-10 pr-4 rounded text-sm outline-none focus:border-[#333] transition-colors"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-700 bg-[#0a0a0a] border border-[#151515] px-1.5 rounded">/</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 h-10 bg-[#080808] border border-[#151515] rounded text-sm text-zinc-400 hover:text-white transition-colors">
                                    <ArrowUpDown size={14} /> Compare
                                </button>
                                <div className="relative">
                                    <select
                                        className="appearance-none h-10 pl-4 pr-10 bg-[#080808] border border-[#151515] rounded text-sm text-zinc-400 outline-none cursor-pointer hover:text-white transition-colors"
                                        value={sortBy}
                                        onChange={(e: any) => setSortBy(e.target.value)}
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="name">Name</option>
                                        <option value="provider">Provider</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                            <span>{filteredModels.length} models</span>
                            <div className="flex items-center gap-4">
                                <button className="hover:text-zinc-300">By OpenRouter</button>
                                <span className="opacity-20">|</span>
                                <button className="hover:text-zinc-300" onClick={() => { setSearch(''); setActiveTab('all'); }}>Reset</button>
                            </div>
                        </div>
                    </div>

                    {/* Model List Table-like Items */}
                    <div className="flex flex-col border-t border-[#151515]">
                        <AnimatePresence mode='popLayout'>
                            {loading ? (
                                Array.from({ length: 15 }).map((_, i) => (
                                    <div key={i} className="py-6 border-b border-[#151515]">
                                        <Skeleton className="h-5 w-48 bg-[#0a0a0a] mb-2" />
                                        <Skeleton className="h-4 w-full bg-[#0a0a0a]" />
                                    </div>
                                ))
                            ) : displayedModels.length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-zinc-500">No models found for "{search}"</p>
                                </div>
                            ) : (
                                displayedModels.map((model) => {
                                    const price = getPriceInfo(model);
                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            key={model.id}
                                            className={cn(
                                                "group py-4 border-b border-[#111] hover:bg-[#050505] transition-colors cursor-pointer relative",
                                                model.is_pro && "border-l-2 border-l-primary/40 pl-5 -ml-[2px] bg-primary/[0.01]"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <h3 className="flex items-center gap-2 text-[15px] font-bold text-white group-hover:text-primary transition-colors truncate">
                                                        <span>{model.owned_by}: {model.id.split('/').pop()}</span>
                                                        {model.is_pro && (
                                                            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 uppercase tracking-widest font-black shrink-0">
                                                                PRO
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="w-4 h-4 rounded-full bg-[#111] border border-[#222] flex items-center justify-center">
                                                        <Info size={10} className="text-zinc-600" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-zinc-600 text-[11px] font-medium shrink-0">
                                                    <span className="flex items-center gap-1"><Activity size={12} /> 1.8B tokens</span>
                                                </div>
                                            </div>

                                            <div
                                                onClick={(e) => { e.stopPropagation(); copyToClipboard(model.id); }}
                                                className="flex items-center gap-2 text-zinc-500 text-sm mb-4 line-clamp-1 hover:text-white transition-colors cursor-pointer group/id"
                                            >
                                                {model.id}
                                                <Copy size={12} className="opacity-0 group-hover/id:opacity-100 transition-opacity" />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <span>By {model.owned_by.toLowerCase()}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); copyToClipboard(model.id); }}>
                                                        {copiedId === model.id ? <Check size={10} className="text-green-500" /> : <Copy size={10} className="hover:text-white" />}
                                                    </button>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <span>{new Date(model.created * 1000).toLocaleDateString()}</span>
                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <span>1M context</span>
                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                {price ? (
                                                    <>
                                                        {price.type === 'tokens' ? (
                                                            <>
                                                                <span className="text-zinc-500">${price.input}/M <span className="text-zinc-800 italic">tokens</span></span>
                                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                                <span className="text-zinc-500">${price.output}/M <span className="text-zinc-800 italic">tokens</span></span>
                                                            </>
                                                        ) : (
                                                            <span className="text-zinc-500">${price.price} / {price.type}</span>
                                                        )}
                                                    </>
                                                ) : <span className="text-primary italic">Inquiry for rates</span>}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>

                        {!loading && visibleCount < filteredModels.length && (
                            <div className="py-12 flex justify-center">
                                <button
                                    onClick={() => setVisibleCount(p => p + 30)}
                                    className="px-6 py-2 bg-[#0a0a0a] border border-[#151515] text-xs font-bold text-zinc-500 hover:text-white rounded transition-colors"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="mt-auto border-t border-[#111] py-12 px-8 bg-black">
                    <div className="flex flex-col md:flex-row justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
                        <div className="space-y-4">
                            <div className="text-white text-lg font-bold">Frenix</div>
                            <p className="text-xs text-zinc-500 max-w-xs">High-performance AI gateway. One API, every model.</p>
                        </div>
                        <div className="flex gap-16 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                            <div className="flex flex-col gap-2">
                                <a href="#">Status</a>
                                <a href="#">Pricing</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <a href="#">Privacy</a>
                                <a href="#">Terms</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

const styleTag = `
<style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
`;
