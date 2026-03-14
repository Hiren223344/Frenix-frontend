'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TeamLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Team Credentials
        if (username === 'itsshiv_exe' && password === 'HelloShiv@123') {
            localStorage.setItem('team_session', JSON.stringify({ username, password }));
            router.push('/team/dashboard');
        } else if (username === 'itsat41rv_exe' && password === 'HelloAt41rv@123') {
            localStorage.setItem('team_session', JSON.stringify({ username, password }));
            router.push('/team/dashboard');
        } else if (username === 'Hiren2012' && password === 'HelloUser@123') {
            // Also allow admin to login via team portal for convenience
            localStorage.setItem('team_session', JSON.stringify({ username, password }));
            router.push('/team/dashboard');
        } else {
            setError('Invalid Team Credentials');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-3xl bg-bg-card border border-border backdrop-blur-xl shadow-lg relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-bg-soft border border-border rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">Team Portal</h1>
                    <p className="text-text-muted mt-2 font-medium italic">Collaboration & Management</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-1.5 ml-1">Team ID</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-3.5 bg-bg-soft border border-border rounded-2xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            placeholder="username_exe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-1.5 ml-1">Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-bg-soft border border-border rounded-2xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-error-text text-sm font-medium ml-1"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
                    >
                        {loading ? 'Verifying...' : 'Enter Workspace'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black opacity-30">Team Access Layer</p>
                </div>
            </motion.div>
        </div>
    );
}
