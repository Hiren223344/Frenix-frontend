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
    History
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3000';

type Message = { role: 'user' | 'assistant' | 'system', content: string };
type ChatHistory = { id: string, title: string, date: string, messages: Message[] };

export default function PlaygroundPage() {
    // Core State
    const [apiKey, setApiKey] = useState('');
    const [apiUrl, setApiUrl] = useState(GATEWAY);
    const [model, setModel] = useState('provider-1/llama-3.1-8b-instruct');
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
    const [temperature, setTemperature] = useState(0.7);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [models, setModels] = useState<{ id: string }[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deepThink, setDeepThink] = useState(false);
    const [smartSearch, setSmartSearch] = useState(false);
    const [history, setHistory] = useState<ChatHistory[]>([
        { id: '1', title: 'Precision Camera Controls In B...', date: '2025-10', messages: [] },
        { id: '2', title: 'create a ai chatting app with t...', date: '2025-08', messages: [] },
        { id: '3', title: 'Consequences of Privacy Polic...', date: '2025-05', messages: [] },
    ]);

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

    const handleSaveKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setApiKey(val);
        localStorage.setItem('frenix_playground_key', val);
    };

    const handleSaveUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setApiUrl(val);
        localStorage.setItem('frenix_playground_url', val);
    };

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

    // Fetch models
    useEffect(() => {
        if (!apiKey || apiKey.length < 15 || !apiUrl) return;

        const fetchModels = async () => {
            setIsLoadingModels(true);
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
                        if (!model || model === 'provider-1/llama-3.1-8b-instruct') {
                            if (data.data.length > 0) setModel(data.data[0].id);
                        }
                    }
                }
            } catch (error) { } finally {
                setIsLoadingModels(false);
            }
        };
        fetchModels();
    }, [apiKey, apiUrl]);

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
    };

    const handleSend = async () => {
        if (!input.trim() || !apiKey) {
            if (!apiKey) toast.error('API Key required', { description: 'Please enter your Frenix API key in settings.' });
            return;
        }

        const userMsg = input.trim();
        setInput('');

        const currentMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
        setMessages(currentMessages);
        setIsGenerating(true);

        abortControllerRef.current = new AbortController();

        try {
            const apiMessages = [];
            if (systemPrompt.trim()) apiMessages.push({ role: 'system', content: systemPrompt.trim() });
            apiMessages.push(...currentMessages);

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
                    temperature: deepThink ? 0.3 : temperature, // DeepThink mode lowers temp for precision
                    stream: true
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                throw new Error(errBody.error?.message || errBody.message || `HTTP ${response.status}`);
            }

            if (!response.body) throw new Error('No response stream');

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let assistantMsg = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.choices && data.choices[0]?.delta?.content) {
                                assistantMsg += data.choices[0].delta.content;
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    newMsgs[newMsgs.length - 1].content = assistantMsg;
                                    return newMsgs;
                                });
                            }
                        } catch (e) { }
                    }
                }
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                toast.error('Chat Error', { description: error.message });
                setMessages(prev => [...prev, { role: 'system', content: `Error: ${error.message}` }]);
            }
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="flex h-screen bg-[#000103] text-[#cfd1d5] font-sans selection:bg-blue-500/30 overflow-hidden">

            {/* ── Left Sidebar ── */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
                className="h-full bg-[#0d0f14] border-r border-white/5 flex flex-col overflow-hidden relative"
            >
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 px-1">
                        <div className="size-6 bg-blue-500 rounded-md flex items-center justify-center font-black text-white text-[10px]">
                            FX
                        </div>
                        <span className="font-bold text-sm tracking-tight text-white/90">frenix</span>
                    </div>
                    <button className="p-1.5 hover:bg-white/5 rounded-md text-white/40 transition-colors">
                        <Maximize2 size={16} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="px-3 mb-2">
                    <button
                        onClick={() => setMessages([])}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 font-semibold text-sm transition-all group"
                    >
                        <Plus size={18} className="text-white/60 group-hover:text-blue-400" />
                        New chat
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-6 pt-4 scrollbar-hide">
                    <div className="space-y-1">
                        <h3 className="px-3 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">History</h3>
                        {history.map(item => (
                            <button
                                key={item.id}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 truncate transition-all"
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-white/5">
                    <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-white/80 transition-all">
                        <div className="size-8 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-xs">
                            H
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-bold truncate">Hiren Ahalawat</p>
                        </div>
                        <MoreHorizontal size={14} className="text-white/40" />
                    </button>
                </div>
            </motion.aside>

            {/* ── Main Content Area ── */}
            <main className="flex-1 flex flex-col relative h-full">

                {/* Toggle Sidebar Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={cn(
                        "absolute top-4 left-4 z-20 p-2 rounded-lg bg-transparent hover:bg-white/5 text-white/40 transition-all",
                        sidebarOpen && "left-2"
                    )}
                >
                    {sidebarOpen ? <ChevronLeft size={20} /> : <History size={20} />}
                </button>

                {/* Top Actions */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-all"
                    >
                        <Settings2 size={20} />
                    </button>
                </div>

                {/* Chat Container */}
                <div className={cn(
                    "flex-1 overflow-y-auto flex flex-col items-center",
                    messages.length === 0 ? "justify-center" : "pt-20 pb-40"
                )}>

                    {messages.length === 0 ? (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-6 mb-12"
                        >
                            <div className="flex items-center gap-4 text-white">
                                <div className="size-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                    <Brain className="size-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">How can I assist you?</h2>
                            </div>
                        </motion.div>
                    ) : (
                        /* Message Stream */
                        <div className="w-full max-w-3xl px-4 space-y-8">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={cn(
                                        "flex gap-6",
                                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "shrink-0 size-8 rounded-full flex items-center justify-center flex-none",
                                        msg.role === 'user' ? "bg-white/10 text-white/50" : "bg-blue-500/20 text-blue-400"
                                    )}>
                                        {msg.role === 'user' ? <User size={14} /> : <Brain size={14} />}
                                    </div>
                                    <div className={cn(
                                        "flex-1 text-[16px] leading-[1.8] whitespace-pre-wrap pt-0.5",
                                        msg.role === 'user' ? "text-white/90 text-right" : "text-[#cfd1d5]"
                                    )}>
                                        {msg.content || (isGenerating && i === messages.length - 1 && <span className="inline-block size-1.5 bg-blue-400 rounded-full animate-pulse ml-1" />)}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Fixed Centered Input Container */}
                    <div className={cn(
                        "fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[760px] px-4 transition-all duration-300 z-30",
                        messages.length > 0 ? "translate-y-0" : "static translate-x-0 mx-auto"
                    )}>
                        <div className="relative group">
                            {/* Input Background */}
                            <div className="absolute inset-0 bg-white/[0.03] rounded-[28px] blur-sm transition-all group-focus-within:bg-white/[0.05]" />

                            <div className="relative bg-[#1b1e26] border border-white/5 rounded-[28px] shadow-2xl overflow-hidden px-4 py-3 transition-all group-focus-within:border-white/10 group-focus-within:bg-[#21252f]">

                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Message Frenix..."
                                    className="w-full bg-transparent border-none outline-none resize-none text-[16px] text-white/90 placeholder:text-white/20 min-h-[24px] max-h-[200px] overflow-y-auto px-2 pt-1 pb-1 scrollbar-hide"
                                />

                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setDeepThink(!deepThink)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border",
                                                deepThink
                                                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                                    : "bg-white/5 border-transparent text-white/40 hover:text-white/60"
                                            )}
                                        >
                                            <Brain size={12} strokeWidth={3} />
                                            DeepThink
                                        </button>
                                        <button
                                            onClick={() => setSmartSearch(!smartSearch)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border",
                                                smartSearch
                                                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                                    : "bg-white/5 border-transparent text-white/40 hover:text-white/60"
                                            )}
                                        >
                                            <Globe size={12} strokeWidth={3} />
                                            Smart Search
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-white/30 hover:text-white/60 transition-colors">
                                            <Paperclip size={18} />
                                        </button>
                                        {isGenerating ? (
                                            <button
                                                onClick={handleStop}
                                                className="size-10 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg"
                                            >
                                                <StopCircle size={18} fill="currentColor" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSend}
                                                disabled={!input.trim() || !apiKey}
                                                className="size-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 disabled:bg-white/5 disabled:text-white/10 transition-all shadow-lg shadow-blue-500/10"
                                            >
                                                <Send size={18} className="-rotate-45 -mt-0.5 ml-0.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-center text-[10px] text-white/10 font-medium">
                            Frenix can make mistakes. Always check important info.
                        </p>
                    </div>
                </div>

                {/* ── Settings Overlay ── */}
                <AnimatePresence>
                    {showSettings && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowSettings(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#1b1e26] border border-white/5 rounded-3xl p-8 z-[101] shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Settings2 size={20} className="text-blue-400" />
                                        Configuration
                                    </h3>
                                    <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">
                                        <Plus size={24} className="rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">API Key</label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={handleSaveKey}
                                            placeholder="sk-frenix..."
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2 text-white/30">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Gateway URL</label>
                                        <input
                                            type="text"
                                            value={apiUrl}
                                            onChange={handleSaveUrl}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Model</label>
                                            <select
                                                value={model}
                                                onChange={e => setModel(e.target.value)}
                                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none"
                                            >
                                                {models.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Temperature</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range" min="0" max="2" step="0.1"
                                                    value={temperature}
                                                    onChange={e => setTemperature(parseFloat(e.target.value))}
                                                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-blue-500"
                                                />
                                                <span className="text-xs font-bold text-blue-400 w-8">{temperature}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">System Prompt</label>
                                        <textarea
                                            value={systemPrompt}
                                            onChange={e => setSystemPrompt(e.target.value)}
                                            rows={2}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setMessages([]); setShowSettings(false); }}
                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-sm hover:bg-rose-500/20 transition-all border border-rose-500/20"
                                    >
                                        <Trash2 size={16} />
                                        Clear Chat
                                    </button>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        Close Settings
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
