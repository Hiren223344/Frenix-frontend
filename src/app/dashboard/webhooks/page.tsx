'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Webhook, Plus, Trash2, Send, CheckCircle2, AlertCircle, Copy, Key } from 'lucide-react';
import { toast } from 'sonner';

interface WebhookData {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: string;
}

const AVAILABLE_EVENTS = [
  'request.completed',
  'budget.threshold_reached',
  'rate_limit.exceeded',
  'model.failed',
  'project.created'
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newEvents, setNewEvents] = useState<string[]>([]);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/v1/webhooks`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('frenix_api_key')}` }
      });
      const data = await res.json();
      setWebhooks(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newUrl || newEvents.length === 0) {
      toast.error('URL and at least one event are required');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/v1/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('frenix_api_key')}`
        },
        body: JSON.stringify({ url: newUrl, events: newEvents })
      });

      if (res.ok) {
        toast.success('Webhook created successfully');
        setShowAdd(false);
        setNewUrl('');
        setNewEvents([]);
        fetchWebhooks();
      } else {
        toast.error('Failed to create webhook');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const testWebhook = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/v1/webhooks/${id}/test`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('frenix_api_key')}` }
      });
      if (res.ok) toast.success('Test event sent');
      else toast.error('Test failed');
    } catch (err) {
      toast.error('Test failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Webhooks</h1>
            <p className="text-white/40">Receive real-time notifications for gateway events.</p>
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} /> New Webhook
          </button>
        </header>

        <section className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {webhooks.map((hook, idx) => (
              <motion.div
                key={hook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                        <Webhook size={24} />
                      </div>
                      <h3 className="text-xl font-bold truncate max-w-md">{hook.url}</h3>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                        Active
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {hook.events.map(event => (
                        <span key={event} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-white/50">
                          {event}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-white/30 border-t border-white/5 pt-6">
                      <div className="flex items-center gap-2 group/secret cursor-pointer" onClick={() => {
                        navigator.clipboard.writeText(hook.secret);
                        toast.success('Secret copied');
                      }}>
                        <Key size={14} className="text-blue-400" />
                        <span className="font-mono group-hover:text-white/60 transition-colors capitalize">••••••••••••••••</span>
                        <Copy size={12} className="opacity-0 group-hover/secret:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => testWebhook(hook.id)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-90"
                      title="Test Webhook"
                    >
                      <Send size={20} />
                    </button>
                    <button 
                      className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-500 transition-all active:scale-90"
                      title="Delete Webhook"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && webhooks.length === 0 && (
            <div className="text-center py-20 rounded-[3rem] border-2 border-dashed border-white/5">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Webhook size={32} className="text-white/20" />
              </div>
              <p className="text-white/40 max-w-xs mx-auto">No webhooks configured yet. Add your first webhook to receive event notifications.</p>
            </div>
          )}
        </section>
      </div>

      {/* Add Webhook Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
              <h2 className="text-3xl font-bold mb-2">New Webhook</h2>
              <p className="text-white/40 mb-8 text-sm lowercase tracking-tight">Configure an endpoint to receive automated event payloads.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 ml-1">Endpoint URL</label>
                  <input 
                    type="url" 
                    placeholder="https://api.yourdomain.com/webhooks/frenix"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 ml-1">Notify me of</label>
                  <div className="grid grid-cols-1 gap-2">
                    {AVAILABLE_EVENTS.map(event => (
                      <label 
                        key={event}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          newEvents.includes(event) 
                            ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span className="text-xs font-medium lowercase tracking-wide font-mono">{event}</span>
                        <input 
                          type="checkbox" 
                          hidden 
                          checked={newEvents.includes(event)}
                          onChange={() => {
                            if (newEvents.includes(event)) setNewEvents(newEvents.filter(e => e !== event));
                            else setNewEvents([...newEvents, event]);
                          }}
                        />
                        {newEvents.includes(event) ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-all text-sm active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreate}
                    className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold transition-all text-sm shadow-xl shadow-blue-600/10 active:scale-95"
                  >
                    Create Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
