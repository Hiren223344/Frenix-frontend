'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetchUsers, adminUpgradeUser } from '@/lib/gateway';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
    LayoutGrid, 
    List, 
    Settings2, 
    Columns, 
    Maximize2, 
    Minimize2, 
    Activity, 
    Users as UsersIcon,
    Search,
    RefreshCw,
    LogOut,
    ExternalLink,
    ShieldAlert
} from 'lucide-react';

// Configuration for customizeable columns
const ALL_COLUMNS = [
    { id: 'id', label: 'Identity ID', default: false },
    { id: 'email', label: 'Email / Username', default: true },
    { id: 'status', label: 'Live Status', default: true },
    { id: 'tier', label: 'Plan Tier', default: true },
    { id: 'stats', label: 'Usage Stats', default: true },
    { id: 'date', label: 'Joined Date', default: true },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [upgrading, setUpgrading] = useState(false);
    const [creds, setCreds] = useState<any>(null);
    
    // Customization Settings
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [visibleColumns, setVisibleColumns] = useState<string[]>(ALL_COLUMNS.filter(c => c.default).map(c => c.id));
    const [density, setDensity] = useState<'compact' | 'normal' | 'spacious'>('normal');
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(320); // Resizable setting (stored in local)
    const [dashboardWidth, setDashboardWidth] = useState('max-w-7xl'); // Custom resonance

    useEffect(() => {
        // Load settings from local storage
        const savedConfig = localStorage.getItem('admin_config');
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            if (parsed.viewMode) setViewMode(parsed.viewMode);
            if (parsed.visibleColumns) setVisibleColumns(parsed.visibleColumns);
            if (parsed.density) setDensity(parsed.density);
            if (parsed.dashboardWidth) setDashboardWidth(parsed.dashboardWidth);
        }

        const admin_session = localStorage.getItem('admin_session');
        if (!admin_session) {
            router.push('/admin');
            return;
        }
        const parsedCreds = JSON.parse(admin_session);
        setCreds(parsedCreds);
        loadUsers(parsedCreds);
    }, []);

    const saveConfig = (updates: any) => {
        const current = JSON.parse(localStorage.getItem('admin_config') || '{}');
        const next = { ...current, ...updates };
        localStorage.setItem('admin_config', JSON.stringify(next));
    };

    const loadUsers = async (pCreds: any) => {
        try {
            setLoading(true);
            const data = await adminFetchUsers(pCreds);
            setUsers(data || []);
        } catch (error: any) {
            console.error('Failed to fetch users', error);
            toast.error(`Access Denied: ${error.message}`);
            localStorage.removeItem('admin_session');
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (userId: string, tier: string) => {
        if (!creds) return;
        try {
            setUpgrading(true);
            await adminUpgradeUser(creds, userId, tier);
            await loadUsers(creds);
            setSelectedUser(null);
            toast.success(`Identity modified: ${tier} (30 Days)`);
        } catch (error: any) {
            toast.error('Modification failed: ' + error.message);
        } finally {
            setUpgrading(false);
        }
    };

    const toggleColumn = (id: string) => {
        const next = visibleColumns.includes(id) 
            ? visibleColumns.filter(c => c !== id)
            : [...visibleColumns, id];
        setVisibleColumns(next);
        saveConfig({ visibleColumns: next });
    };

    const filteredUsers = users.filter(u => 
        (u.email?.toLowerCase().includes(search.toLowerCase())) ||
        (u.username?.toLowerCase().includes(search.toLowerCase())) ||
        (u.id?.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading && users.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text-main flex flex-col">
            
            {/* --- TOP CUSTOMIZABLE BAR --- */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
                <div className={`${dashboardWidth} mx-auto flex items-center justify-between gap-4`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-xl">
                            <ShieldAlert className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Admin <span className="text-text-muted font-medium">Gateway</span></h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-success-text animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">System Online — {users.length} Nodes</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View Switcher */}
                        <div className="flex items-center bg-bg-soft border border-border rounded-xl p-1">
                            <button 
                                onClick={() => { setViewMode('table'); saveConfig({ viewMode: 'table' }); }}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-bg-card shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                                title="List View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => { setViewMode('grid'); saveConfig({ viewMode: 'grid' }); }}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-bg-card shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search Bar (Minimized unless focused) */}
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-bg-soft border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-ring w-40 focus:w-64 transition-all"
                            />
                        </div>

                        <button 
                            onClick={() => setIsConfigOpen(!isConfigOpen)}
                            className={`p-2 rounded-xl border transition-all ${isConfigOpen ? 'bg-primary text-primary-foreground border-primary' : 'bg-bg-soft border-border text-text-muted hover:text-text-main'}`}
                            title="Customize Dashboard"
                        >
                            <Settings2 className="w-4 h-4" />
                        </button>

                        <button 
                            onClick={() => loadUsers(creds)}
                            className="p-2 bg-bg-soft border border-border text-text-muted hover:text-text-main rounded-xl transition-all"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        <div className="w-px h-6 bg-border mx-2" />

                        <button 
                            onClick={() => { localStorage.removeItem('admin_session'); router.push('/admin'); }}
                            className="p-2 md:px-4 md:py-2 bg-error-bg border border-error-border text-error-text rounded-xl hover:opacity-80 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Exit</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT & SIDEBAR --- */}
            <div className="flex-grow flex relative">
                
                {/* --- CUSTOMIZATION SIDEBAR (Collapsible) --- */}
                <AnimatePresence>
                    {isConfigOpen && (
                        <motion.aside 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: sidebarWidth, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-bg-card border-r border-border overflow-hidden flex flex-col sticky top-[73px] h-[calc(100vh-73px)] shadow-2xl z-30"
                        >
                            <div className="p-6 space-y-8 w-full">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted">Preferences</h2>
                                    <button onClick={() => setIsConfigOpen(false)} className="text-text-muted hover:text-text-main"><Minimize2 className="w-4 h-4" /></button>
                                </div>

                                {/* Dashboard Width */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <Maximize2 className="w-3 h-3" /> Canvas Size
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'max-w-4xl', label: 'Narrow' },
                                            { id: 'max-w-7xl', label: 'Max' },
                                            { id: 'max-w-[100%]', label: 'Full' },
                                            { id: 'max-w-screen-2xl', label: 'Wide' },
                                        ].map(size => (
                                            <button 
                                                key={size.id}
                                                onClick={() => { setDashboardWidth(size.id); saveConfig({ dashboardWidth: size.id }); }}
                                                className={`px-3 py-2 text-[10px] font-bold rounded-lg border transition-all ${dashboardWidth === size.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-bg-soft border-border text-text-muted hover:border-ring'}`}
                                            >
                                                {size.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Density */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <Activity className="w-3 h-3" /> Content Density
                                    </label>
                                    <div className="flex gap-1 p-1 bg-bg-soft border border-border rounded-xl">
                                        {['compact', 'normal', 'spacious'].map(d => (
                                            <button 
                                                key={d}
                                                onClick={() => { setDensity(d as any); saveConfig({ density: d }); }}
                                                className={`flex-grow py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${density === d ? 'bg-bg-card shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Columns Visibility */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <Columns className="w-3 h-3" /> Visible Columns
                                    </label>
                                    <div className="space-y-2">
                                        {ALL_COLUMNS.map(col => (
                                            <button 
                                                key={col.id}
                                                onClick={() => toggleColumn(col.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${visibleColumns.includes(col.id) ? 'bg-primary/5 border-primary/20 text-text-main' : 'bg-transparent border-transparent text-text-muted'}`}
                                            >
                                                <span className="text-xs font-bold">{col.label}</span>
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${visibleColumns.includes(col.id) ? 'bg-primary border-primary' : 'border-border'}`}>
                                                    {visibleColumns.includes(col.id) && <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* --- MAIN CANVAS --- */}
                <main className="flex-grow p-6 md:p-12 overflow-y-auto">
                    <div className={`${dashboardWidth} mx-auto transition-all duration-300`}>
                        
                        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <h1 className="text-3xl font-black text-text-main">
                                    Identity <span className="text-text-muted opacity-40">Matrix</span>
                                </h1>
                                <p className="text-text-muted font-medium mt-1">Real-time oversight of your unified API ecosystem.</p>
                            </motion.div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Filtered Results</span>
                                    <span className="text-xl font-black tabular-nums">{filteredUsers.length}</span>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {viewMode === 'table' ? (
                                <motion.div 
                                    key="table"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="bg-bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm"
                                >
                                    <div className="overflow-x-auto">
                                        <table className={`w-full text-left border-collapse ${density === 'compact' ? 'text-xs' : density === 'spacious' ? 'text-base' : 'text-sm'}`}>
                                            <thead>
                                                <tr className="bg-bg-soft/70 text-text-muted font-black uppercase tracking-[0.2em] text-[10px]">
                                                    {visibleColumns.includes('id') && <th className="px-6 py-4">ID</th>}
                                                    {visibleColumns.includes('email') && <th className="px-6 py-4">Identity Profile</th>}
                                                    {visibleColumns.includes('status') && <th className="px-6 py-4">Status</th>}
                                                    {visibleColumns.includes('tier') && <th className="px-6 py-4">Tier Group</th>}
                                                    {visibleColumns.includes('stats') && <th className="px-6 py-4 text-center">Engagement</th>}
                                                    {visibleColumns.includes('date') && <th className="px-6 py-4">Registry</th>}
                                                    <th className="px-6 py-4 text-right">Ops</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-bg-soft/30 transition-colors group">
                                                        {visibleColumns.includes('id') && <td className="px-6 py-5 font-mono text-[9px] text-text-muted opacity-50 uppercase tracking-tighter">{user.id.slice(0, 8)}...</td>}
                                                        
                                                        {visibleColumns.includes('email') && (
                                                            <td className="px-6 py-5">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-text-main">{user.email || user.username || 'Anonymous'}</span>
                                                                    <span className="text-[10px] text-text-muted font-medium lowercase opacity-60">@{user.username || 'frenix_user'}</span>
                                                                </div>
                                                            </td>
                                                        )}

                                                        {visibleColumns.includes('status') && (
                                                            <td className="px-6 py-5">
                                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                                                                    user.status === 'active' ? 'bg-success-bg text-success-text border-success-border' : 'bg-error-bg text-error-text border-error-border'
                                                                }`}>
                                                                    {user.status}
                                                                </span>
                                                            </td>
                                                        )}

                                                        {visibleColumns.includes('tier') && (
                                                            <td className="px-6 py-5">
                                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                                                                    user.tier === 'pro' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                                                                    user.tier === 'enterprise' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                                                                    'bg-bg-soft text-text-muted border-border'
                                                                }`}>
                                                                    {user.tier}
                                                                </span>
                                                            </td>
                                                        )}

                                                        {visibleColumns.includes('stats') && (
                                                            <td className="px-6 py-5">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="text-[13px] font-black tabular-nums">${user.totalCostUsd.toFixed(3)}</span>
                                                                    <div className="flex gap-2 text-[10px] text-text-muted font-bold uppercase tracking-tight opacity-50">
                                                                        <span>{user.totalRequests} REQ</span>
                                                                        <span>{(user.totalTokens / 1000).toFixed(1)}K TK</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}

                                                        {visibleColumns.includes('date') && <td className="px-6 py-5 text-text-muted font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>}

                                                        <td className="px-6 py-5 text-right">
                                                            <button 
                                                                onClick={() => setSelectedUser(user)}
                                                                className="p-2 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all text-text-muted group-hover:text-primary active:scale-95"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="grid"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredUsers.map((user) => (
                                        <motion.div 
                                            key={user.id}
                                            layoutId={user.id}
                                            className="bg-bg-card border border-border rounded-3xl p-6 hover:border-ring transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center font-bold text-primary border border-border uppercase">
                                                        {(user.email || user.username || 'A')[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-text-main truncate w-32">{user.email || user.username || 'Anonymous'}</h3>
                                                        <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest opacity-50">{user.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                                    user.status === 'active' ? 'bg-success-bg text-success-text border-success-border' : 'bg-error-bg text-error-text border-error-border'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-bg-soft rounded-2xl p-3 border border-border">
                                                    <span className="block text-[9px] font-black uppercase tracking-widest text-text-muted opacity-50 mb-1">Expenses</span>
                                                    <span className="text-sm font-black text-primary">${user.totalCostUsd.toFixed(3)}</span>
                                                </div>
                                                <div className="bg-bg-soft rounded-2xl p-3 border border-border">
                                                    <span className="block text-[9px] font-black uppercase tracking-widest text-text-muted opacity-50 mb-1">Volume</span>
                                                    <span className="text-sm font-black text-text-main">{user.totalRequests.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                        user.tier === 'pro' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                                                        user.tier === 'enterprise' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                                                        'bg-bg-soft text-text-muted border-border'
                                                    }`}>
                                                        {user.tier}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => setSelectedUser(user)}
                                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
                                                >
                                                    Modify
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* --- MODAL FOR UPGRADE --- */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-sm bg-bg-card border border-border rounded-[2.5rem] p-10 shadow-3xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                            
                            <h2 className="text-2xl font-black mb-1">System Override</h2>
                            <p className="text-text-muted text-xs mb-8 font-medium">Reconfiguring node: {selectedUser.email || selectedUser.id.slice(0, 10)}</p>
                            
                            <div className="space-y-2 mb-8">
                                {['free', 'pro', 'enterprise', 'evolvex'].map((t) => (
                                    <button
                                        key={t}
                                        disabled={upgrading || selectedUser.tier === t}
                                        onClick={() => handleUpgrade(selectedUser.id, t)}
                                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                                            selectedUser.tier === t 
                                            ? 'bg-bg-soft border-border text-text-muted cursor-not-allowed opacity-50'
                                            : 'bg-bg-soft/70 border-border hover:border-primary hover:bg-primary/5 text-text-main active:scale-[0.98]'
                                        }`}
                                    >
                                        <span className="capitalize font-black text-sm tracking-wide">{t}</span>
                                        {selectedUser.tier === t && <span className="text-[9px] uppercase font-black opacity-30">Active</span>}
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="w-full py-2 text-text-muted hover:text-text-main transition-colors text-xs font-bold uppercase tracking-widest"
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
