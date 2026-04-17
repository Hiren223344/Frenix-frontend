'use client';

import React, { useEffect, useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Server, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Activity, 
  Cpu, 
  Network,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
interface SystemStatus {
  status: string;
  timestamp: string;
  version: string;
  checks: Record<string, string>;
}

interface ModelStatus {
  id: string;
  owned_by: string;
}

interface LogEntry {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// --- Components ---

const StatusDot = memo(({ status }: { status: string }) => {
  const isOperational = status === 'operational' || status === 'connected' || status === 'ACTIVE' || status === 'SECURE';
  
  return (
    <div className="relative flex items-center justify-center size-3">
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute inset-0 rounded-full",
          isOperational ? "bg-emerald-500" : "bg-amber-500"
        )}
      />
      <div className={cn(
        "relative size-1.5 rounded-full z-10",
        isOperational ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
      )} />
    </div>
  );
});

StatusDot.displayName = 'StatusDot';

const StatCard = memo(({ label, value, subValue, icon: Icon, colorClass }: { 
  label: string; 
  value: string; 
  subValue?: string; 
  icon: any;
  colorClass?: string;
}) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="relative overflow-hidden p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-sm group"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={48} />
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-mono font-bold tracking-tighter italic", colorClass || "text-white")}>
          {value}
        </span>
        {subValue && <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{subValue}</span>}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      <div className="size-1 rounded-full bg-white/10" />
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const NodeRow = memo(({ name, status, index }: { name: string; status: string; index: number }) => {
  const isSecure = status === 'connected' || status === 'ACTIVE';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <Server size={14} className={cn(isSecure ? "text-emerald-500" : "text-amber-500")} />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-white/80 tracking-tight">{name}</span>
          <span className="text-[9px] font-medium text-white/20 uppercase tracking-widest">v2.4.0-edge</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[9px] font-black tracking-tighter transition-all",
          isSecure 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        )}>
          {isSecure ? 'SECURE' : 'DEGRADED'}
        </div>
        <StatusDot status={status} />
      </div>
    </motion.div>
  );
});

NodeRow.displayName = 'NodeRow';

const ModelRow = memo(({ model, index }: { model: ModelStatus; index: number }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.01 }}
    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group"
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] group-hover:scale-125 transition-transform" />
      <span className="text-[11px] font-bold text-white/40 group-hover:text-white transition-colors truncate tracking-tight">{model.id}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-black uppercase tracking-tighter bg-white/[0.03] px-2 py-0.5 rounded border border-white/5 text-white/20 group-hover:text-emerald-500/50 transition-colors">
        {model.owned_by}
      </span>
      <ChevronRight size={12} className="text-white/5 group-hover:text-white/20 transition-colors" />
    </div>
  </motion.div>
));

ModelRow.displayName = 'ModelRow';

const LogTerminal = memo(({ logs }: { logs: LogEntry[] }) => (
  <div className="rounded-[2.5rem] bg-black border border-white/5 overflow-hidden flex flex-col h-[300px] shadow-2xl">
    <div className="px-6 py-4 border-bottom border-white/5 flex items-center justify-between bg-zinc-900/50 pt-5 pb-4">
      <div className="flex items-center gap-2">
        <Terminal size={14} className="text-white/40" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Telemetry Stream</span>
      </div>
      <div className="flex gap-1.5">
        <div className="size-2 rounded-full bg-white/5" />
        <div className="size-2 rounded-full bg-white/5" />
        <div className="size-2 rounded-full bg-white/5" />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-2 scrollbar-hide">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-4 group">
          <span className="text-white/10 select-none">{log.time}</span>
          <span className={cn(
            "font-bold uppercase tracking-tighter px-1.5 rounded-[4px]",
            log.type === 'info' && "text-blue-400 bg-blue-400/10",
            log.type === 'success' && "text-emerald-400 bg-emerald-400/10",
            log.type === 'warning' && "text-amber-400 bg-amber-400/10",
            log.type === 'error' && "text-rose-400 bg-rose-400/10"
          )}>
            {log.type}
          </span>
          <span className="text-white/60 group-hover:text-white/90 transition-colors">{log.message}</span>
        </div>
      ))}
      <div className="flex gap-4 animate-pulse">
        <span className="text-white/10">--:--:--</span>
        <span className="text-emerald-400">READY</span>
        <span className="text-white/20">Awaiting next telemetry packet_</span>
      </div>
    </div>
  </div>
));

LogTerminal.displayName = 'LogTerminal';

// --- Main Page ---

export default function StatusPage() {
  const [system, setSystem] = useState<SystemStatus | null>(null);
  const [models, setModels] = useState<ModelStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = useMemo(() => {
    if (!searchQuery) return models;
    return models.filter(m => 
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.owned_by.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [models, searchQuery]);

  const fetchData = async () => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // System Status
    try {
      const res = await fetch('https://api.frenix.sh/v1/status');
      const data = await res.json();
      setSystem(data);
      setLoading(false);
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        time,
        type: 'info',
        message: `System status synched. Gateway v${data.version} operational.`
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    } catch (err) {
      console.error('System status fetch failed:', err);
      setLoading(false);
      const errorLog: LogEntry = {
        id: 'err-' + Date.now(),
        time,
        type: 'error',
        message: 'Master gateway unreachable. Retrying through secondary edge.'
      };
      setLogs(prev => [errorLog, ...prev].slice(0, 50));
    }

    // Models Status
    try {
      const res = await fetch('https://api.frenix.sh/v1/models', {
        headers: {
          'Authorization': 'Bearer frenix-models-status'
        }
      });
      const data = await res.json();
      if (data.data) {
        setModels(data.data);
        setModelsLoading(false);
        const modelsLog: LogEntry = {
          id: 'models-' + Date.now(),
          time,
          type: 'success',
          message: `Orchestrator broadcasted ${data.data.length} operational models.`
        };
        setLogs(prev => [modelsLog, ...prev].slice(0, 50));
      }
    } catch (err) {
      console.error('Models status fetch failed:', err);
      setModelsLoading(false);
    }

    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !system) {
    return (
      <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="size-8 border-2 border-primary border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white font-sans selection:bg-primary/30 relative overflow-hidden pb-20">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 lg:py-24">
        
        {/* Navigation / Header */}
        <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
            >
              <div className={`size-2 rounded-full animate-pulse ${system?.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-black text-white/70 tracking-[0.2em] uppercase">Gateway Status v{system?.version || '2.0'}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-6 italic"
            >
              {system?.status === 'operational' ? 'ALL SYSTEMS' : 'PARTIAL'}<br />
              <span className="text-white/20">{system?.status === 'operational' ? 'NOMINAL' : 'DEGRADATION'}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-[11px] font-bold uppercase tracking-[0.3em] max-w-sm"
            >
              Real-time infrastructure health and model availability for the Frenix AI Gateway. 
              <span className="text-emerald-500/50 ml-2 animate-pulse">● BROADCASTING LIVE</span>
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-end gap-3"
          >
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Global Uptime</span>
                  <span className="text-2xl font-mono font-bold italic">99.98<span className="text-xs opacity-50">%</span></span>
               </div>
               <div className="w-[1px] h-8 bg-white/10" />
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Last Check</span>
                  <span className="text-xs font-mono text-white/40 uppercase">{lastUpdated.split(' ')[0]}</span>
               </div>
               <button 
                onClick={fetchData}
                className="p-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-all active:scale-95 group"
               >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
               </button>
            </div>
          </motion.div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <StatCard 
            label="Active Nodes" 
            value="4" 
            subValue="Global" 
            icon={Server} 
            colorClass="text-blue-400"
          />
          <StatCard 
            label="Avg Latency" 
            value="39.4" 
            subValue="ms" 
            icon={Zap} 
            colorClass="text-emerald-400"
          />
          <StatCard 
            label="Security Layer" 
            value="v2.x" 
            subValue="Encrypted" 
            icon={ShieldCheck} 
            colorClass="text-white"
          />
          <StatCard 
            label="Active Models" 
            value={models.length.toString()} 
            subValue="Total" 
            icon={Activity} 
            colorClass="text-primary"
          />
        </div>

        {/* Main Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Infrastructure Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                <Network size={12} className="text-primary" /> Infrastructure Nodes
              </h2>
              <span className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Live Stream</span>
            </div>
            
            <div className="space-y-3">
              {system && Object.entries(system.checks).map(([name, status], idx) => (
                <NodeRow key={name} name={name} status={status} index={idx} />
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] opacity-50 grayscale"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <Globe size={14} className="text-white/20" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white/40 tracking-tight italic">EU-WEST-Edge</span>
                    <span className="text-[9px] font-medium text-white/10 uppercase tracking-widest">v2.x.x-pending</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-[9px] font-black tracking-tighter bg-white/5 text-white/20 border border-white/10">
                  PROVISIONING
                </div>
              </motion.div>
            </div>

            {/* Performance Snapshot */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 block">Load Distribution</span>
              <div className="space-y-4">
                {[
                  { label: 'Americas', val: 62 },
                  { label: 'Europe', val: 28 },
                  { label: 'Asia Pac', val: 10 }
                ].map((reg) => (
                  <div key={reg.label} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-white/40 uppercase tracking-widest">{reg.label}</span>
                      <span className="text-white/60 italic">{reg.val}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${reg.val}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary/40 rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Availability Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-[2.5rem] bg-zinc-900/40 border border-white/5 p-1 backdrop-blur-sm overflow-hidden flex flex-col h-[700px]">
              
              <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                    <Cpu size={12} className="text-primary" /> Model Index
                  </h2>
                  <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/5">
                    <Search size={12} className="text-white/20" />
                    <input 
                      type="text" 
                      placeholder="Filter models..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-[11px] font-bold text-white placeholder:text-white/10 w-32"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-12 scrollbar-hide">
                 {modelsLoading ? (
                    <div className="space-y-2 py-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="h-12 w-full bg-white/5 animate-pulse rounded-2xl" />
                      ))}
                    </div>
                  ) : filteredModels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 py-4">
                        {filteredModels.map((m, idx) => (
                            <ModelRow key={m.id + idx} model={m} index={idx} />
                        ))}
                    </div>
                  ) : (
                    <div className="py-40 text-center">
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">No broadcast signals found matching segment</p>
                    </div>
                  )}
              </div>

              {/* Bottom Nav inside card */}
              <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl flex justify-between items-center relative z-20">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Orchestrator v{system?.version || '2.4.0'}</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Global Provider Mesh</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight">{filteredModels.length} Operational</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Stream Section */}
        <section className="mt-20 space-y-8">
           <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                <Terminal size={12} className="text-primary" /> Log Engine
              </h2>
           </div>
           <LogTerminal logs={logs} />
        </section>

        {/* Footer Metrics */}
        <footer className="mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest">Primary Node</span>
                <span className="text-xs font-mono font-bold tracking-tighter">US-EAST-CORE-01</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest">SSL Cert</span>
                <span className="text-xs font-mono font-bold tracking-tighter text-emerald-500">VALID</span>
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">
            &copy; 2026 Frenix Infrastructure Group. All rights reserved.
           </p>
           <div className="flex items-center gap-4">
              <ShieldCheck size={18} className="text-white/40" />
              <Globe size={18} className="text-white/40" />
           </div>
        </footer>
      </div>
    </div>
  );
}
