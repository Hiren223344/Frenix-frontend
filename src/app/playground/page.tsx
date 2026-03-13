'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Loader2,
    MessageSquare,
    Settings2,
    Trash2,
    StopCircle,
    Paperclip,
    Plus,
    Globe,
    Brain,
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    MoreHorizontal,
    Maximize2,
    History,
    Zap,
    Cpu,
    Sparkles,
    Shield,
    PanelRight,
    Copy,
    Check,
    Terminal
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3000';

type Message = { role: 'user' | 'assistant' | 'system', content: string };

const SYSTEM_PROMPT_DEFAULT = 'You are Frenix AI, a powerful large language model. You provide clear, accurate, and professional responses.';

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
                body: JSON.stringify({
                    model,
                    messages: apiMessages,
                    temperature,
                    stream: true
                }),
                signal: abortControllerRef.current.signal
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
        <div className="flex h-screen bg-[#050609] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden">
            {/* --- Background Ambient Glows --- */}
            <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[150px]" />
            </div>

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
                            className="flex items-center gap-3"
                        >
                            <div className="size-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Zap className="size-5 text-white fill-current" />
                            </div>
                            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Frenix</span>
                        </motion.div>
                    )}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors ml-auto"
                    >
                        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <div className="px-3 mt-4">
                    <button 
                        onClick={() => setMessages([])}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all group shadow-lg shadow-indigo-500/20",
                            !sidebarOpen && "justify-center px-0"
                        )}
                    >
                        <Plus size={20} />
                        {sidebarOpen && <span>New Session</span>}
                    </button>
                </div>

                <div className="flex-1 mt-8 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {sidebarOpen && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Recent chats</p>}
                    {[1, 2, 3].map(i => (
                        <button key={i} className={cn("w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group", !sidebarOpen && "justify-center px-0")}>
                            <MessageSquare size={18} className="shrink-0" />
                            {sidebarOpen && <span className="truncate text-sm">Experimental Project {i}...</span>}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
                        <div className="size-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-400">H</div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-white">Hiren Ahalawat</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Pro Tier</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* --- Main Workspace --- */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/20 backdrop-blur-md shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Terminal size={16} />
                           <span className="text-xs font-mono opacity-50">/playground/sessions/main</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-px bg-white/5 mx-2" />
                        <button 
                            onClick={() => setConfigOpen(!configOpen)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                                configOpen ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-white/5 text-slate-400"
                            )}
                        >
                            <Settings2 size={18} />
                            <span>Configuration</span>
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
                                    className="size-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 relative"
                                >
                                    <Sparkles className="size-10 text-indigo-400 animate-pulse" />
                                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-white tracking-tight">Welcome to Playground</h1>
                                    <p className="text-slate-400 max-w-sm text-lg leading-relaxed">Experience the full power of Frenix AI with ultra-low latency and multimodal capabilities.</p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3 pt-4">
                                    {['Develop a React component', 'Explain quantum computing', 'Write a marketing email'].map(prompt => (
                                        <button 
                                            key={prompt}
                                            onClick={() => setInput(prompt)}
                                            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium transition-all"
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
                                            ? "bg-slate-800 border-white/10 text-indigo-400" 
                                            : "bg-indigo-600 border-indigo-400/50 text-white"
                                    )}>
                                        {m.role === 'user' ? <User size={20} /> : <Cpu size={20} />}
                                    </div>
                                    <div className={cn(
                                        "flex-1 min-w-0 pt-2",
                                        m.role === 'user' ? "text-right" : "text-left"
                                    )}>
                                        <div className={cn(
                                            "inline-block max-w-full text-lg leading-relaxed",
                                            m.role === 'user' ? "text-white font-medium" : "text-slate-200"
                                        )}>
                                            {m.content}
                                            {isGenerating && i === messages.length - 1 && m.role === 'assistant' && (
                                                <span className="inline-block w-1 h-6 bg-indigo-500 ml-1 translate-y-1 animate-pulse" />
                                            )}
                                        </div>
                                        {m.role === 'assistant' && m.content && (
                                            <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => copyToClipboard(m.content)}
                                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-indigo-400"
                                                >
                                                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-blue-400"><History size={16} /></button>
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
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 rounded-[32px] opacity-20 blur-md group-focus-within:opacity-50 transition-opacity duration-500" />
                            
                            <div className="relative bg-[#16181d]/90 backdrop-blur-2xl border border-white/10 rounded-[30px] p-2 pr-4 shadow-2xl flex flex-col gap-2 transition-all group-focus-within:bg-[#1c1f26] group-focus-within:border-white/20">
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
                                    placeholder="Message Frenix AI..."
                                    className="w-full bg-transparent border-none outline-none resize-none pt-3 pb-1 px-4 text-white text-lg placeholder:text-slate-500 custom-scrollbar max-h-[200px]"
                                    rows={1}
                                />
                                
                                <div className="flex items-center justify-between px-2 pb-1 pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors" title="Attach Files">
                                            <Paperclip size={20} />
                                        </button>
                                        <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors" title="Web Search">
                                            <Globe size={20} />
                                        </button>
                                        <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors" title="Visual Model">
                                            <Search size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] uppercase font-black tracking-widest text-indigo-400 flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            Active: {model.split('/').pop()}
                                        </div>
                                        {isGenerating ? (
                                            <button 
                                                onClick={handleStop}
                                                className="size-11 rounded-[22px] bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-rose-900/20"
                                            >
                                                <StopCircle size={22} fill="white" />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleSend}
                                                className="size-11 rounded-[22px] bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
                                                disabled={!input.trim()}
                                            >
                                                <Send size={22} className="-rotate-45 -mt-0.5 ml-0.5" />
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
                        className="w-[340px] h-full bg-[#0d0f14] border-l border-white/5 flex flex-col z-50 overflow-y-auto custom-scrollbar relative"
                    >
                        <div className="p-6 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Settings2 size={22} className="text-indigo-400" />
                                    Parameters
                                </h2>
                                <button 
                                    onClick={() => setConfigOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* API Key Section */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60 block">Authentication</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500">
                                            <Shield size={16} />
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
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Model Selector */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60 block">Model Engine</label>
                                    <div className="relative">
                                        <select 
                                            value={model}
                                            onChange={e => setModel(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:border-indigo-500/50 outline-none cursor-pointer"
                                        >
                                            {models.length > 0 ? (
                                                models.map(m => (
                                                    <option key={m.id} value={m.id}>{m.id}</option>
                                                ))
                                            ) : (
                                                <option value={model}>{model}</option>
                                            )}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/20">
                                            <Plus size={14} className="rotate-45" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Provider capability determines tokens per second and cost efficiency.</p>
                                </div>

                                {/* Temperature Slider */}
                                <div className="space-y-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-slate-300">Creativity / Temp</label>
                                            <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">{temperature}</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="2" step="0.1"
                                            value={temperature}
                                            onChange={e => setTemperature(parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                            <span>Precise</span>
                                            <span>Adventurous</span>
                                        </div>
                                    </div>
                                </div>

                                {/* System Prompt */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60 block">Identity Instructions</label>
                                    <textarea 
                                        value={systemPrompt}
                                        onChange={e => setSystemPrompt(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all resize-none custom-scrollbar h-[180px] leading-relaxed"
                                        placeholder="Customize how the AI behaves..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto p-6 space-y-4 bg-slate-900/40 border-t border-white/5">
                            <button 
                                onClick={() => {
                                    setMessages([]);
                                    toast.info('Session cleared');
                                }}
                                className="w-full py-3 rounded-xl border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 font-bold text-sm transition-all flex items-center justify-center gap-2"
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
                    width: 6px;
                    height: 6px;
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
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
