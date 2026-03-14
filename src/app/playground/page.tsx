'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    MessageSquare,
    Settings2,
    Trash2,
    StopCircle,
    Paperclip,
    Plus,
    Globe,
    Cpu,
    Sparkles,
    Shield,
    Copy,
    Check,
    Terminal,
    ChevronLeft,
    ChevronRight,
    User,
    History,
    Zap,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3000';

type Message = { role: 'user' | 'assistant' | 'system', content: string };

const SYSTEM_PROMPT_DEFAULT = 'You are Frenix AI, a powerful large language model. You provide clear, accurate, and professional responses.';

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

export default function PlaygroundPage() {
    // --- Core State ---
    const [apiKey, setApiKey] = useState('');
    const [apiUrl, setApiUrl] = useState(GATEWAY);
    const [model, setModel] = useState('provider-1/llama-3.1-8b-instruct');
    const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT_DEFAULT);
    const [temperature, setTemperature] = useState(0.7);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [models, setModels] = useState<{ id: string }[]>([]);
    
    // --- UI State ---
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [configOpen, setConfigOpen] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    
    const abortControllerRef = useRef<AbortController | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Persistence
    useEffect(() => {
        const storedKey = localStorage.getItem('frenix_playground_key');
        if (storedKey) setApiKey(storedKey);
        const storedUrl = localStorage.getItem('frenix_playground_url');
        if (storedUrl) setApiUrl(storedUrl);
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isGenerating]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    // Fetch available models
    useEffect(() => {
        if (!apiKey || apiKey.length < 10) return;

        const fetchModels = async () => {
            try {
                let normalizedUrl = apiUrl.replace(/\/$/, '');
                if (!normalizedUrl.startsWith('http')) normalizedUrl = `http://${normalizedUrl}`;
                const res = await fetch(`${normalizedUrl}/v1/models`, {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.data && Array.isArray(data.data)) {
                        setModels(data.data);
                    }
                }
            } catch (error) {}
        };
        fetchModels();
    }, [apiKey, apiUrl]);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) {
            if (!apiKey) toast.error('API Key Required', { description: 'Please set your API key in the configuration panel.' });
            return;
        }

        const userMsg = input.trim();
        setInput('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsGenerating(true);

        abortControllerRef.current = new AbortController();

        try {
            const apiMessages = [{ role: 'system', content: systemPrompt }, ...newMessages];
            let normalizedUrl = apiUrl.replace(/\/$/, '');
            if (!normalizedUrl.startsWith('http')) normalizedUrl = `http://${normalizedUrl}`;

            const response = await fetch(`${normalizedUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'text/event-stream'
                },
                signal: abortControllerRef.current.signal,
                body: JSON.stringify({
                    model,
                    messages: apiMessages,
                    temperature,
                    stream: true
                })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) return;

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const parsed = JSON.parse(line.slice(6));
                            const delta = parsed.choices?.[0]?.delta?.content || '';
                            fullContent += delta;
                            setMessages(prev => {
                                const last = [...prev];
                                last[last.length - 1].content = fullContent;
                                return last;
                            });
                        } catch (e) {}
                    }
                }
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                toast.error('Generation Failed', { description: error.message });
            }
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };

    const handleStop = () => {
        abortControllerRef.current?.abort();
        setIsGenerating(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="flex h-screen bg-[#020202] text-slate-300 font-sans selection:bg-primary/30 overflow-hidden">
            <DynamicBackground />

            {/* --- Navigation Sidebar (Left) --- */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 260 : 64 }}
                className="h-full bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-all duration-300"
            >
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <span className="font-black text-xl tracking-tighter text-white">PLAYGROUND</span>
                            <div className="px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black uppercase text-primary">V2</div>
                        </motion.div>
                    )}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors ml-auto"
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                <div className="px-3 mt-4">
                    <button 
                        onClick={() => setMessages([])}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary font-black uppercase text-[10px] tracking-widest transition-all group",
                            !sidebarOpen && "justify-center px-0"
                        )}
                    >
                        <Plus size={18} />
                        {sidebarOpen && <span>New Experience</span>}
                    </button>
                </div>

                <div className="flex-1 mt-8 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {sidebarOpen && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-2 opacity-60 italic text-center">History (Local Only)</p>}
                    {[1, 2, 3].map(i => (
                        <button key={i} className={cn("w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group", !sidebarOpen && "justify-center px-0")}>
                            <MessageSquare size={16} className="shrink-0 opacity-40 group-hover:opacity-100" />
                            {sidebarOpen && <span className="truncate text-[11px] font-bold uppercase tracking-tight">Experiment {i}...</span>}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
                        <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black italic text-primary">NODE</div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black truncate text-white leading-tight uppercase tracking-tighter">Gateway Explorer</p>
                                <p className="text-[9px] text-emerald-500 uppercase font-black tracking-widest">Global Edge</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* --- Main Workspace --- */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                           <Terminal size={14} />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">/ground/node-v24/main</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setConfigOpen(!configOpen)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                configOpen ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]" : "hover:bg-white/5 text-slate-400 border-white/5"
                            )}
                        >
                            <Settings2 size={16} />
                            <span>Control Node</span>
                        </button>
                    </div>
                </header>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-32">
                    <div className="max-w-4xl mx-auto py-12 space-y-10">
                        {messages.length === 0 ? (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                                <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="size-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10 relative"
                                >
                                    <Sparkles className="size-10 text-primary animate-pulse" />
                                    <div className="absolute inset-0 bg-primary blur-3xl opacity-20" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Neural Playground</h1>
                                    <p className="text-slate-500 max-w-sm text-[11px] font-bold uppercase tracking-widest opacity-60">Unified intelligence via the Frenix orchestration layer</p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 pt-4">
                                    {['Develop a React component', 'Explain quantum computing', 'Write a marketing email'].map(prompt => (
                                        <button 
                                            key={prompt}
                                            onClick={() => setInput(prompt)}
                                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((m, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-6 group",
                                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "size-10 rounded-2xl flex-none flex items-center justify-center shadow-lg border transition-transform duration-300 group-hover:scale-110",
                                        m.role === 'user' 
                                            ? "bg-white/[0.03] border-white/10 text-primary" 
                                            : "bg-primary border-primary/50 text-black"
                                    )}>
                                        {m.role === 'user' ? <User size={20} /> : <Cpu size={20} />}
                                    </div>
                                    <div className={cn(
                                        "flex-1 min-w-0 pt-2",
                                        m.role === 'user' ? "text-right" : "text-left"
                                    )}>
                                        <div className={cn(
                                            "inline-block max-w-full text-base leading-relaxed p-4 rounded-2xl",
                                            m.role === 'user' ? "bg-white/[0.02] text-white font-medium" : "text-slate-200"
                                        )}>
                                            {m.content}
                                            {isGenerating && i === messages.length - 1 && m.role === 'assistant' && (
                                                <span className="inline-block w-1.5 h-5 bg-primary ml-1 translate-y-1 animate-pulse" />
                                            )}
                                        </div>
                                        {m.role === 'assistant' && m.content && (
                                            <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => copyToClipboard(m.content)}
                                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary"
                                                >
                                                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                                </button>
                                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary"><History size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Floating Input Bar */}
                <div className="absolute bottom-8 left-0 right-0 px-4 md:px-8 pointer-events-none">
                    <div className="max-w-4xl mx-auto w-full pointer-events-auto">
                        <div className="relative group transition-all duration-500">
                            {/* Input Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[32px] opacity-20 blur-xl group-focus-within:opacity-40 transition-opacity duration-700" />
                            
                            <div className="relative bg-[#080808]/80 backdrop-blur-2xl border border-white/10 rounded-[30px] p-2 pr-4 shadow-2xl flex flex-col gap-2 transition-all group-focus-within:bg-[#0a0a0a] group-focus-within:border-primary/20">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Execute neural prompt..."
                                    className="w-full bg-transparent border-none outline-none resize-none pt-3 pb-1 px-4 text-white text-base placeholder:text-slate-600 font-medium custom-scrollbar max-h-[200px]"
                                    rows={1}
                                />
                                
                                <div className="flex items-center justify-between px-2 pb-1 pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors" title="Attach Payload">
                                            <Paperclip size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors" title="Edge Discovery">
                                            <Globe size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-emerald-500" />
                                            {model.split('/').pop()}
                                        </div>
                                        {isGenerating ? (
                                            <button 
                                                onClick={handleStop}
                                                className="size-11 rounded-[22px] bg-white opacity-80 hover:opacity-100 text-black flex items-center justify-center transition-all active:scale-95 shadow-xl"
                                            >
                                                <StopCircle size={20} fill="black" />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleSend}
                                                className="size-11 rounded-[22px] bg-primary hover:scale-[1.05] disabled:opacity-20 text-black flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-primary/20"
                                                disabled={!input.trim()}
                                            >
                                                <Send size={20} className="-rotate-45 -mt-0.5 ml-0.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Configuration Panel (Right) --- */}
            <AnimatePresence>
                {configOpen && (
                    <motion.aside
                        initial={{ x: 340 }}
                        animate={{ x: 0 }}
                        exit={{ x: 340 }}
                        className="w-[340px] h-full bg-black/60 backdrop-blur-xl border-l border-white/5 flex flex-col z-50 overflow-y-auto custom-scrollbar relative"
                    >
                        <div className="p-8 space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
                                    <Settings2 size={22} className="text-primary" />
                                    Parameters
                                </h2>
                                <button 
                                    onClick={() => setConfigOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-xl text-slate-500"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* API Key Section */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block">Secure Token</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-600 group-focus-within:text-primary">
                                            <Lock size={16} />
                                        </div>
                                        <input 
                                            type="password"
                                            value={apiKey}
                                            onChange={e => {
                                                const v = e.target.value;
                                                setApiKey(v);
                                                localStorage.setItem('frenix_playground_key', v);
                                            }}
                                            placeholder="sk-frenix-..."
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:border-primary/40 outline-none transition-all placeholder:text-slate-800 font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Model Selector */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block">Cognitive Engine</label>
                                    <div className="relative">
                                        <select 
                                            value={model}
                                            onChange={e => setModel(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white appearance-none focus:border-primary/40 outline-none cursor-pointer font-bold tracking-tight uppercase"
                                        >
                                            {models.length > 0 ? (
                                                models.map(m => (
                                                    <option key={m.id} value={m.id} className="bg-black text-white">{m.id.split('/').pop()?.toUpperCase()}</option>
                                                ))
                                            ) : (
                                                <option value={model} className="bg-black text-white">{model.split('/').pop()?.toUpperCase()}</option>
                                            )}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/20">
                                            <Plus size={14} className="rotate-45" />
                                        </div>
                                    </div>
                                </div>

                                {/* Temperature Slider */}
                                <div className="space-y-6 flex flex-col items-center">
                                    <div className="w-full h-px bg-white/5" />
                                    <div className="w-full space-y-5">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Intelligence Variance</label>
                                            <span className="text-[11px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 leading-none">{temperature}</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="2" step="0.1"
                                            value={temperature}
                                            onChange={e => setTemperature(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer hover:bg-white/10 transition-colors"
                                        />
                                        <div className="flex justify-between text-[9px] font-black text-slate-700 uppercase tracking-widest">
                                            <span>Convergent</span>
                                            <span>Divergent</span>
                                        </div>
                                    </div>
                                </div>

                                {/* System Prompt */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block">Identity Instructions</label>
                                    <textarea 
                                        value={systemPrompt}
                                        onChange={e => setSystemPrompt(e.target.value)}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-4 text-xs text-white focus:border-primary/40 outline-none transition-all resize-none custom-scrollbar h-[180px] leading-relaxed font-medium"
                                        placeholder="Customize the behavioral matrix..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto p-6 space-y-4">
                            <button 
                                onClick={() => {
                                    setMessages([]);
                                    toast.info('Session Recycled');
                                }}
                                className="w-full py-4 rounded-2xl border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-600 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} />
                                Reset Workshop
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
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
