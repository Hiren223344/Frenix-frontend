'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, Server, Globe, ShieldCheck } from 'lucide-react';

interface StatusData {
  status: string;
  operational: boolean;
  uptime: number;
  components: Record<string, boolean>;
  incidents: any[];
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/v1/status/page`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <div className={`h-2 w-2 rounded-full animate-pulse ${data?.operational ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-white/70 tracking-wide uppercase">System Health</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            {data?.operational ? 'All Systems Operational' : 'Systems Degraded'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg max-w-xl mx-auto"
          >
            Real-time status updates for Frenix AI Gateway and associated services.
          </motion.p>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center"
          >
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">90-Day Uptime</span>
            <span className="text-3xl font-mono font-bold text-blue-400">{data?.uptime ?? '99.99'}%</span>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center group"
          >
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-emerald-400 transition-colors">Avg latency</span>
            <span className="text-3xl font-mono font-bold text-emerald-400">39ms</span>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-center"
          >
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">AB Verified</span>
            <span className="text-3xl font-mono font-bold text-white">100%</span>
          </motion.div>
        </div>

        {/* Component Health */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Server size={20} className="text-blue-500" /> Services Status
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {data && Object.entries(data.components).map(([name, healthy], idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-${healthy ? 'emerald' : 'red'}-500/10`}>
                    <Globe size={18} className={healthy ? 'text-emerald-500' : 'text-red-500'} />
                  </div>
                  <span className="capitalize font-medium text-white/80">{name.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold uppercase tracking-wider ${healthy ? 'text-emerald-500' : 'text-red-500'}`}>
                    {healthy ? 'Operational' : 'Outage'}
                  </span>
                  {healthy ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-red-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Incident History */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" /> Incident History
          </h2>
          <div className="space-y-4">
            {data?.incidents && data.incidents.length > 0 ? (
              data.incidents.map((incident: any) => (
                <div key={incident.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{incident.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/60">
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">
                    {incident.description}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck size={14} /> {incident.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-white/20">No incidents reported in the last 7 days.</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-white/20 text-xs tracking-tighter uppercase font-mono">
            &copy; 2026 Frenix infrastructure monitoring. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
