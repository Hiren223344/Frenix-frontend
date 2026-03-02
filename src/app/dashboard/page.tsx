'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GatewayStats } from '@/lib/gateway';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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

function PieBar({ data }: { data: Record<string, any> }) {
    const processedData = Object.entries(data).reduce((acc, [key, val]) => {
        acc[key] = typeof val === 'object' ? (val.requests || 0) : val;
        return acc;
    }, {} as Record<string, number>);

    const sortedData = Object.entries(processedData).sort((a, b) => b[1] - a[1]);
    const total = sortedData.reduce((a, b) => a + b[1], 0);

    if (total === 0) return <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No requests recorded yet</p>;
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--warning)', '#C084FC'];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedData.slice(0, 10).map(([name, count], i) => (
                <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)', opacity: 0.9 }}>{name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{count.toLocaleString()} ({((count / total) * 100).toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: colors[i % colors.length], borderRadius: '4px', transition: 'width 0.8s ease' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function UsageGraph({ data }: { data: { time: string; requests: number; tokens: number }[] }) {
    if (!data.length) return null;
    const maxReq = Math.max(...data.map(d => d.requests), 1);
    const maxTokens = Math.max(...data.map(d => d.tokens), 1);
    const height = 140;
    const width = 600;

    const pointsReq = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.requests / maxReq) * height}`).join(' ');
    const pointsTokens = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.tokens / maxTokens) * height}`).join(' ');

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '180px', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="gradReq" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 0.5, 1].map(v => (
                    <line key={v} x1="0" y1={height * v} x2={width} y2={height * v} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4" />
                ))}

                {/* Lines */}
                <polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points={pointsReq} strokeLinecap="round" strokeLinejoin="round" />
                <polyline fill="url(#gradReq)" points={`0,${height} ${pointsReq} ${width},${height}`} />
                <polyline fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeDasharray="3" points={pointsTokens} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>{new Date(data[0].time).getHours()}:00</span>
                <span>{new Date(data[Math.floor(data.length / 2)].time).getHours()}:00</span>
                <span>{new Date(data[data.length - 1].time).getHours()}:00</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <div style={{ width: '12px', height: '3px', background: 'var(--primary)', borderRadius: '2px' }} /> Requests
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <div style={{ width: '12px', height: '3px', background: 'var(--secondary)', borderBottom: '1px dashed var(--secondary)', borderRadius: '2px' }} /> Tokens
                </div>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="dashboard-container">
            <div className="page-header animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton style={{ height: '32px', width: '200px' }} />
                    <Skeleton style={{ height: '38px', width: '100px', borderRadius: '10px' }} />
                </div>
            </div>

            <div className="stat-grid">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="stat-card" style={{ height: '120px' }}>
                        <Skeleton style={{ height: '14px', width: '80px', marginBottom: '16px' }} />
                        <Skeleton style={{ height: '32px', width: '120px', marginBottom: '12px' }} />
                        <Skeleton style={{ height: '12px', width: '140px' }} />
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', marginBottom: '24px' }}>
                <div className="glass-card" style={{ padding: '28px', height: '320px' }}>
                    <Skeleton style={{ height: '20px', width: '150px', marginBottom: '24px' }} />
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} style={{ height: '32px', width: '100%', marginBottom: '12px', borderRadius: '6px' }} />
                    ))}
                </div>
                <div className="glass-card" style={{ padding: '28px' }}>
                    <Skeleton style={{ height: '20px', width: '120px', marginBottom: '24px' }} />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Skeleton style={{ height: '12px', width: '100px' }} />
                                <Skeleton style={{ height: '12px', width: '40px' }} />
                            </div>
                            <Skeleton style={{ height: '6px', width: '100%', borderRadius: '10px' }} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '20px', marginBottom: '24px' }}>
                <div className="glass-card" style={{ padding: '40px', height: '300px' }}>
                    <Skeleton style={{ height: '24px', width: '240px', marginBottom: '32px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Skeleton style={{ height: '40px', width: '280px', marginBottom: '16px' }} />
                            <Skeleton style={{ height: '20px', width: '180px' }} />
                        </div>
                        <Skeleton style={{ height: '100px', width: '160px', borderRadius: '20px' }} />
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '32px' }}>
                    <Skeleton style={{ height: '20px', width: '140px', marginBottom: '24px' }} />
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} style={{ height: '32px', width: '70px', borderRadius: '10px' }} />)}
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <Skeleton style={{ height: '12px', width: '100%', marginBottom: '6px' }} />
                            <Skeleton style={{ height: '4px', width: '100%' }} />
                        </div>
                    ))}
                </div>
            </div>

            <Skeleton style={{ height: '54px', width: '100%', borderRadius: '14px' }} />
        </div>
    );
}

export default function Dashboard() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() { redirect('/signin'); },
    });

    const [stats, setStats] = useState<GatewayStats | null>(null);
    const [graphData, setGraphData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noKey, setNoKey] = useState(false);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const [sRes, gRes] = await Promise.all([
                fetch('/api/gateway/stats'),
                fetch('/api/gateway/stats/graph')
            ]);

            if (sRes.status === 404) {
                setNoKey(true);
                setLoading(false);
                return;
            }

            if (!sRes.ok) {
                const b = await sRes.json();
                const errorMsg = b.error || 'Failed to load stats';
                setError(errorMsg);
                toast.error(errorMsg);
                setLoading(false);
                return;
            }

            const statsData = await sRes.json();
            const graphData = gRes.ok ? await gRes.json() : [];

            setStats(statsData);
            setGraphData(graphData);
        } catch {
            const msg = 'Cannot reach gateway. Make sure it is running.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (status === 'authenticated') load(); }, [status]);

    const copyPrefix = (prefix: string) => {
        navigator.clipboard.writeText(prefix);
        toast.info('API Key prefix copied');
    };

    if (status === 'loading' || loading) {
        return <DashboardSkeleton />;
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
                <div className="alert alert-error">
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                    <div>
                        <strong>Gateway unreachable</strong><br />{error}
                        <button onClick={load} style={{ marginLeft: '12px', background: 'transparent', border: '1px solid currentColor', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '13px', color: 'inherit', opacity: 0.8 }}>Retry</button>
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
                    <h1>Dashboard</h1>
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
                                {Object.entries(stats.stats.endpointsUsed).sort((a: any, b: any) => {
                                    const ac = typeof a[1] === 'object' ? (a[1] as any).requests : a[1];
                                    const bc = typeof b[1] === 'object' ? (b[1] as any).requests : b[1];
                                    return bc - ac;
                                }).map(([ep, data]: [string, any]) => (
                                    <tr key={ep}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--primary)' }}>{ep}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '600' }}>
                                            {(typeof data === 'object' ? data.requests : data).toLocaleString()}
                                        </td>
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

            {/* Services info + Operations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '20px' }}>
                <div className="glass-card animate-fade" style={{ padding: '40px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '32px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Frenix API Services</h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-1px' }}>Hello, {session?.user?.name || 'User'} 👋</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Subscription Tier:</span>
                                <span className="badge badge-warning" style={{ fontSize: '11px', textTransform: 'uppercase', padding: '4px 12px' }}>{stats.tier}</span>
                            </div>
                        </div>

                        <div style={{ padding: '24px', background: 'var(--bg-soft)', borderRadius: '20px', border: '1px solid var(--border)', textAlign: 'center', minWidth: '160px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>Account Status</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                                <div style={{
                                    width: '12px', height: '12px', borderRadius: '50%',
                                    background: stats.status === 'active' ? 'var(--primary)' : 'var(--error-text)',
                                    boxShadow: stats.status === 'active' ? '0 0 15px var(--primary)' : 'none',
                                    animation: stats.status === 'active' ? 'pulse 2s infinite' : 'none'
                                }} />
                                <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stats.status}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div style={{ padding: '16px', background: 'rgba(45, 212, 191, 0.03)', borderRadius: '12px', border: '1px solid rgba(45, 212, 191, 0.1)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>API Version</div>
                            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>v1.0.4-stable</div>
                        </div>
                        <div style={{ padding: '16px', background: 'rgba(96, 165, 250, 0.03)', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.1)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Global Latency</div>
                            <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>34ms (Fast)</div>
                        </div>
                        <div style={{ padding: '16px', background: 'rgba(167, 243, 208, 0.03)', borderRadius: '12px', border: '1px solid rgba(167, 243, 208, 0.1)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Region</div>
                            <div style={{ fontWeight: '700', color: 'var(--accent)' }}>AWS-US-EAST</div>
                        </div>
                    </div>
                </div>

                <div className="glass-card animate-fade-2" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '24px' }}>Operations</h2>

                    {/* Operations mini pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                        {[
                            { name: 'Img', val: stats.stats.operations.imageGenerations, color: 'var(--primary)' },
                            { name: 'Embed', val: stats.stats.operations.embeddings, color: 'var(--secondary)' },
                            { name: 'Audio', val: stats.stats.operations.audioSpeeches, color: 'var(--accent)' },
                            { name: 'Mod', val: stats.stats.operations.moderations, color: 'var(--warning)' },
                        ].map(op => (
                            <div key={op.name} style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px' }}>
                                <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>{op.name}:</span>
                                <strong style={{ color: 'var(--text-main)' }}>{op.val.toLocaleString()}</strong>
                            </div>
                        ))}
                    </div>

                    <PieBar data={stats.stats.modelsUsed} />
                </div>
            </div>

            {/* Key info bar */}
            <div className="animate-fade-3" style={{ marginTop: '24px', padding: '16px 24px', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>Key prefix: <code
                    onClick={() => copyPrefix(stats.keyPrefix)}
                    style={{ color: 'var(--text-main)', fontFamily: 'monospace', cursor: 'pointer' }}
                    title="Click to copy prefix"
                >
                    {stats.keyPrefix}…
                </code></span>
                <span>Created: {new Date(stats.createdAt).toLocaleDateString()}</span>
                <span>Last used: {stats.lastUsedAt ? new Date(stats.lastUsedAt).toLocaleString() : 'Never'}</span>
                <Link href="/api-keys" style={{ color: 'var(--primary)', fontWeight: '600' }}>Manage Key →</Link>
            </div>
        </div>
    );
}
