'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GatewayStats } from '@/lib/gateway';
import Link from 'next/link';

function StatCard({ label, value, icon, sub }: { label: string; value: string | number; icon: string; sub?: string }) {
    return (
        <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="stat-label">{label}</span>
                <span style={{ fontSize: '18px' }}>{icon}</span>
            </div>
            <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
            {sub && <div className="stat-change-mute">{sub}</div>}
        </div>
    );
}

function PieBar({ data }: { data: Record<string, number> }) {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) return <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No data yet</p>;
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--warning)', '#C084FC'];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(data).slice(0, 5).map(([name, count], i) => (
                <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                        <span style={{ fontWeight: '500' }}>{name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{((count / total) * 100).toFixed(0)}% ({count.toLocaleString()})</span>
                    </div>
                    <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: colors[i % colors.length], borderRadius: '4px', transition: 'width 0.8s ease' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Dashboard() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() { redirect('/signin'); },
    });

    const [stats, setStats] = useState<GatewayStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noKey, setNoKey] = useState(false);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/gateway/stats');
            if (res.status === 404) { setNoKey(true); setLoading(false); return; }
            if (!res.ok) { const b = await res.json(); setError(b.error || 'Failed to load stats'); setLoading(false); return; }
            setStats(await res.json());
        } catch {
            setError('Cannot reach gateway. Make sure it is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (status === 'authenticated') load(); }, [status]);

    if (status === 'loading' || loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading…</div>;
    }

    // No key yet
    if (noKey) {
        return (
            <div className="dashboard-container">
                <div className="page-header animate-fade">
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Welcome, {session?.user?.name}</p>
                </div>
                <div className="glass-card animate-fade-2" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '52px', marginBottom: '20px' }}>🔑</div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Get your API Key first</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '420px', margin: '0 auto 32px', lineHeight: '1.6' }}>
                        You don&apos;t have a gateway key yet. Generate one to start using the AI gateway and unlock your dashboard.
                    </p>
                    <Link href="/api-keys" className="btn-primary" style={{ padding: '13px 36px', fontSize: '15px' }}>Generate My Free Key</Link>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="dashboard-container">
                <div className="page-header animate-fade"><h1>Dashboard</h1></div>
                <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '16px', padding: '28px', color: '#991B1B', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                    <div>
                        <strong>Gateway unreachable</strong><br />{error}
                        <button onClick={load} style={{ marginLeft: '12px', background: 'transparent', border: '1px solid #F87171', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '13px', color: '#991B1B' }}>Retry</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const successRate = stats.stats.totalRequests > 0
        ? ((stats.stats.successRequests / stats.stats.totalRequests) * 100).toFixed(1)
        : '—';

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="page-header animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>
                            Welcome back, <strong style={{ color: 'var(--text-main)' }}>{session?.user?.name}</strong>
                            <span style={{ marginLeft: '12px' }}><span className={`badge ${stats.status === 'active' ? 'badge-success' : 'badge-error'}`}>{stats.status}</span></span>
                            <span style={{ marginLeft: '8px' }}><span className="badge badge-warning">{stats.tier}</span></span>
                        </p>
                    </div>
                    <button className="btn-ghost" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={load}>↺ Refresh</button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="stat-grid animate-fade-2">
                <StatCard label="Total Requests" value={stats.stats.totalRequests} icon="🚀" sub={`${stats.stats.failedRequests} failed`} />
                <StatCard label="Success Rate" value={`${successRate}%`} icon="✅" sub={`${stats.stats.successRequests} successful`} />
                <StatCard label="Total Tokens" value={stats.stats.tokens.total} icon="🪙" sub={`${stats.stats.tokens.prompt} prompt + ${stats.stats.tokens.completion} completion`} />
                <StatCard label="Est. Cost (USD)" value={`$${stats.stats.totalCostUsd.toFixed(4)}`} icon="💰" sub="Approx. based on usage" />
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', marginBottom: '24px' }}>
                {/* Endpoints used */}
                <div className="glass-card animate-fade-3" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Endpoints Used</h2>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{Object.keys(stats.stats.endpointsUsed).length} endpoints</span>
                    </div>
                    {Object.keys(stats.stats.endpointsUsed).length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Endpoint</th>
                                    <th style={{ textAlign: 'right' }}>Requests</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(stats.stats.endpointsUsed).sort((a, b) => b[1] - a[1]).map(([ep, count]) => (
                                    <tr key={ep}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--primary)' }}>{ep}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '600' }}>{count.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '14px' }}>No requests yet</div>
                    )}
                </div>

                {/* Providers breakdown */}
                <div className="glass-card animate-fade-3" style={{ padding: '28px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Providers</h2>
                    <PieBar data={stats.stats.providersUsed} />
                </div>
            </div>

            {/* Models + Operations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-card animate-fade" style={{ padding: '28px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Models Used</h2>
                    <PieBar data={stats.stats.modelsUsed} />
                </div>

                <div className="glass-card animate-fade-2" style={{ padding: '28px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Operations</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { name: 'Image Generations', val: stats.stats.operations.imageGenerations },
                            { name: 'Embeddings', val: stats.stats.operations.embeddings },
                            { name: 'Transcriptions', val: stats.stats.operations.transcriptions },
                            { name: 'Speeches', val: stats.stats.operations.audioSpeeches },
                            { name: 'Moderations', val: stats.stats.operations.moderations },
                            { name: 'Translations', val: stats.stats.operations.translations },
                        ].map(op => (
                            <div key={op.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '13px' }}>{op.name}</span>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>{op.val.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key info bar */}
            <div className="animate-fade-3" style={{ marginTop: '24px', padding: '16px 24px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>Key prefix: <code style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{stats.keyPrefix}…</code></span>
                <span>Created: {new Date(stats.createdAt).toLocaleDateString()}</span>
                <span>Last used: {stats.lastUsedAt ? new Date(stats.lastUsedAt).toLocaleString() : 'Never'}</span>
                <Link href="/api-keys" style={{ color: 'var(--primary)', fontWeight: '600' }}>Manage Key →</Link>
            </div>
        </div>
    );
}
