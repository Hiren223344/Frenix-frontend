'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetchUsers, adminUpdateUserStatus } from '@/lib/gateway';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
    LayoutGrid, 
    List, 
    Settings2, 
    Eye, 
    EyeOff, 
    RefreshCw, 
    LogOut, 
    Shield, 
    Search,
    ChevronRight,
    Ban
} from 'lucide-react';

export default function TeamDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [updating, setUpdating] = useState(false);
    const [creds, setCreds] = useState<any>(null);

    // Customization Settings
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [showStats, setShowStats] = useState(true);
    const [canvasSize, setCanvasSize] = useState<'max-w-7xl' | 'max-w-full'>('max-w-7xl');
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('team_config');
        if (saved) {
            const p = JSON.parse(saved);
            if (p.viewMode) setViewMode(p.viewMode);
            if (p.showStats !== undefined) setShowStats(p.showStats);
            if (p.canvasSize) setCanvasSize(p.canvasSize);
        }

        const team_session = localStorage.getItem('team_session');
        if (!team_session) {
            router.push('/team');
            return;
        }
        const parsedCreds = JSON.parse(team_session);
        setCreds(parsedCreds);
        loadUsers(parsedCreds);
    }, []);

    const saveConfig = (u: any) => {
        const c = JSON.parse(localStorage.getItem('team_config') || '{}');
        localStorage.setItem('team_config', JSON.stringify({...c, ...u}));
    };

    const loadUsers = async (pCreds: any) => {
        try {
            setLoading(true);
            const data = await adminFetchUsers(pCreds);
            setUsers(data || []);
        } catch (error: any) {
            toast.error(`Team Sync Error: ${error.message}`);
            localStorage.removeItem('team_session');
            router.push('/team');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (userId: string, newStatus: string) => {
        if (!creds) return;
        try {
            setUpdating(true);
            await adminUpdateUserStatus(creds, userId, newStatus);
            await loadUsers(creds);
            setSelectedUser(null);
            toast.success(`Identity Moderated: ${newStatus.toUpperCase()}`);
        } catch (error: any) {
            toast.error('Moderation failed: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    const filteredUsers = users.filter(u => 
        (u.email?.toLowerCase().includes(search.toLowerCase())) ||
        (u.username?.toLowerCase().includes(search.toLowerCase())) ||
        (u.id?.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading && users.length === 0) {
        return <div className="min-h-screen bg-background flex items-center justify-center"><div className="loader"></div></div>;
    }

    return (
        <div className="min-h-screen bg-background text-text-main flex flex-col">
            
            {/* --- TOP HUD --- */}
            <nav className="border-b border-border bg-background/50 backdrop-blur-xl px-6 py-4 sticky top-0 z-50">
                <div className={`${canvasSize} mx-auto flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Team <span className="text-emerald-500">Patrol</span></h1>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted opacity-50">Moderation Layer V2</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex bg-bg-soft rounded-xl p-1 border border-border">
                            <button onClick={() => { setViewMode('list'); saveConfig({viewMode: 'list'}); }} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-bg-card shadow-sm text-emerald-500' : 'text-text-muted hover:text-text-main'}`}><List className="w-4 h-4" /></button>
                            <button onClick={() => { setViewMode('grid'); saveConfig({viewMode: 'grid'}); }} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-bg-card shadow-sm text-emerald-500' : 'text-text-muted hover:text-text-main'}`}><LayoutGrid className="w-4 h-4" /></button>
                        </div>

                        <button onClick={() => setIsConfigOpen(!isConfigOpen)} className={`p-2 rounded-xl transition-all ${isConfigOpen ? 'bg-emerald-500 text-white' : 'bg-bg-soft border border-border text-text-muted hover:text-emerald-500'}`}><Settings2 className="w-4 h-4" /></button>
                        
                        <div className="w-px h-6 bg-border mx-1" />
                        
                        <button onClick={() => { localStorage.removeItem('team_session'); router.push('/team'); }} className="p-2 aspect-square md:aspect-auto md:px-4 md:py-2 bg-error-bg border border-error-border text-error-text rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Exit</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex-grow flex relative">
                
                {/* --- CONFIG DRAWER --- */}
                <AnimatePresence>
                    {isConfigOpen && (
                        <motion.aside 
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="fixed right-6 top-24 bottom-6 w-72 bg-bg-card border border-border rounded-[2.5rem] shadow-3xl z-[60] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 space-y-8">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Display Tuning</h2>
                                
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 block">Canvas Scaling</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => { setCanvasSize('max-w-7xl'); saveConfig({canvasSize: 'max-w-7xl'}); }} className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${canvasSize === 'max-w-7xl' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'bg-bg-soft border-border text-text-muted'}`}>
                                            <div className="w-6 h-4 border border-current rounded-sm opacity-50" />
                                            <span className="text-[10px] font-black">BOXED</span>
                                        </button>
                                        <button onClick={() => { setCanvasSize('max-w-full'); saveConfig({canvasSize: 'max-w-full'}); }} className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${canvasSize === 'max-w-full' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'bg-bg-soft border-border text-text-muted'}`}>
                                            <div className="w-10 h-4 border border-current rounded-sm opacity-50" />
                                            <span className="text-[10px] font-black">ULTRA</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 block">Visibility</label>
                                    <button 
                                        onClick={() => { setShowStats(!showStats); saveConfig({showStats: !showStats}); }}
                                        className="w-full p-4 bg-bg-soft border border-border rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all"
                                    >
                                        <span className="text-xs font-bold text-text-main">Metrics Layer</span>
                                        {showStats ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-text-muted" />}
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* --- MAIN STAGE --- */}
                <main className="flex-grow p-6 md:p-12 overflow-y-auto">
                    <div className={`${canvasSize} mx-auto transition-all duration-500 px-4`}>
                        
                        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h1 className="text-4xl font-black text-text-main mb-2">Target <span className="text-text-muted opacity-30 italic">Fleet</span></h1>
                                <p className="text-text-muted font-medium text-sm">Managing operational status for {users.length} unique identifiers.</p>
                            </div>
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-emerald-500 transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Filter by ID, Email, Username..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-bg-soft border border-border rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {viewMode === 'list' ? (
                            <div className="bg-bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-bg-soft/50 text-text-muted font-black uppercase tracking-[0.3em] text-[10px]">
                                                <th className="px-8 py-6">Subject</th>
                                                <th className="px-8 py-6">Identity Group</th>
                                                {showStats && <th className="px-8 py-6">Live Metric</th>}
                                                {showStats && <th className="px-8 py-6">Quota Util</th>}
                                                <th className="px-8 py-6 text-right">Moderation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs border transition-all ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                                                                {(user.email || user.username || 'A')[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <span className="block font-black text-text-main text-sm">{user.email || 'Anonymous System User'}</span>
                                                                <span className="block text-[10px] font-mono text-text-muted opacity-60 uppercase tracking-tighter">HEX: {user.id.slice(0, 16)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                                                            user.tier === 'pro' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                                                            user.tier === 'enterprise' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                                                            'bg-bg-soft text-text-muted border-border'
                                                        }`}>
                                                            {user.tier}
                                                        </span>
                                                    </td>
                                                    {showStats && (
                                                        <td className="px-8 py-6 text-sm font-black tabular-nums text-text-main">
                                                            {user.totalRequests.toLocaleString()} <span className="text-[9px] text-text-muted font-black ml-1">CALLS</span>
                                                        </td>
                                                    )}
                                                    {showStats && (
                                                        <td className="px-8 py-6 text-sm font-black tabular-nums text-emerald-600">
                                                            ${user.totalCostUsd.toFixed(3)}
                                                        </td>
                                                    )}
                                                    <td className="px-8 py-6 text-right">
                                                        <button 
                                                            onClick={() => setSelectedUser(user)}
                                                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                                                                user.status === 'active' 
                                                                ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/10 hover:bg-red-600' 
                                                                : 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/10 hover:bg-emerald-600'
                                                            }`}
                                                        >
                                                            {user.status === 'active' ? 'Ban' : 'Revoke'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredUsers.map((user) => (
                                    <motion.div 
                                        key={user.id}
                                        layout
                                        className="bg-bg-card border border-border rounded-[2rem] p-6 hover:border-emerald-500/30 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                                {(user.email || 'A')[0].toUpperCase()}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                                                {user.status}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-black text-sm text-text-main truncate mb-1">{user.email || 'Anonymous'}</h3>
                                        <p className="text-[10px] font-mono text-text-muted opacity-50 mb-6 uppercase">ID:{user.id.slice(0, 8)}</p>

                                        {showStats && (
                                            <div className="bg-bg-soft rounded-2xl p-4 mb-6 border border-border flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase text-text-muted opacity-60">Revenue</span>
                                                    <span className="text-xs font-black text-emerald-600">${user.totalCostUsd.toFixed(3)}</span>
                                                </div>
                                                <div className="w-px h-6 bg-border" />
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[8px] font-black uppercase text-text-muted opacity-60">Reqs</span>
                                                    <span className="text-xs font-black text-text-main">{user.totalRequests}</span>
                                                </div>
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => setSelectedUser(user)}
                                            className={`w-full py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                                user.status === 'active' ? 'bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                            }`}
                                        >
                                            {user.status === 'active' ? <Ban className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            {user.status === 'active' ? 'Ban Subject' : 'Revoke Ban'}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- MODAL --- */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
                        <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative w-full max-w-sm bg-bg-card border border-border rounded-[3rem] p-12 shadow-4xl text-center">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-4 transition-all ${selectedUser.status === 'active' ? 'bg-red-500/10 border-red-500/10 text-red-500' : 'bg-emerald-500/10 border-emerald-500/10 text-emerald-500'}`}>
                                {selectedUser.status === 'active' ? <Ban className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                            </div>
                            <h2 className="text-2xl font-black mb-2 tracking-tight">Confirm Action</h2>
                            <p className="text-text-muted text-xs mb-10 font-medium">Executing security directive for: <br/><span className="text-text-main font-bold lowercase">{selectedUser.email || selectedUser.id}</span></p>
                            
                            <div className="space-y-3">
                                <button 
                                    disabled={updating}
                                    onClick={() => handleUpdateStatus(selectedUser.id, selectedUser.status === 'active' ? 'banned' : 'active')}
                                    className={`w-full py-5 rounded-[1.8rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                                        selectedUser.status === 'active' ? 'bg-red-600 text-white shadow-red-500/20 hover:bg-red-700' : 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
                                    }`}
                                >
                                    {selectedUser.status === 'active' ? 'Confirm Restriction' : 'Confirm Restoration'}
                                </button>
                                <button onClick={() => setSelectedUser(null)} className="w-full py-4 text-text-muted hover:text-text-main font-black text-[10px] uppercase tracking-widest">Abort Directive</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
