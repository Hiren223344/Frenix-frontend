'use client'

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Key, AlertTriangle, Sparkles, Copy, Check } from 'lucide-react';

interface StoredKey {
    plainKey: string;   // only present right after creation
    keyPrefix: string;
    tier: string;
    email: string;
    createdNow: boolean;
}

function ApiKeysSkeleton() {
    return (
        <div className="dashboard-container">
            <div className="page-header animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Skeleton style={{ height: '32px', width: '180px', marginBottom: '8px' }} />
                        <Skeleton style={{ height: '14px', width: '320px' }} />
                    </div>
                    <Skeleton style={{ height: '40px', width: '150px', borderRadius: '10px' }} />
                </div>
            </div>

            <div className="glass-card" style={{ padding: '32px', marginBottom: '28px' }}>
                <Skeleton style={{ height: '24px', width: '200px', marginBottom: '24px' }} />
                <Skeleton style={{ height: '60px', width: '100%', borderRadius: '10px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '28px', height: '160px' }}>
                    <Skeleton style={{ height: '20px', width: '120px', marginBottom: '16px' }} />
                    <Skeleton style={{ height: '40px', width: '100%', borderRadius: '8px' }} />
                </div>
                <div className="glass-card" style={{ padding: '28px', height: '160px' }}>
                    <Skeleton style={{ height: '20px', width: '120px', marginBottom: '16px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3].map(i => <Skeleton key={i} style={{ height: '24px', width: '60px', borderRadius: '8px' }} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                toast.success('API Key copied to clipboard');
                setTimeout(() => setCopied(false), 2000);
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? '#059669' : 'var(--text-muted)', fontSize: '13px', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.2s', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}
        >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </span>
        </button>
    );
}

export default function ApiKeys() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'authenticated'>('loading');
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/signin');
                return;
            }
            setUser(user);
            setStatus('authenticated');
        };
        checkUser();
    }, []);

    const [key, setKey] = useState<StoredKey | null>(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [hasKey, setHasKey] = useState<boolean | null>(null); // null = loading

    useEffect(() => {
        if (status !== 'authenticated') return;

        const loadOrCreate = async () => {
            try {
                const r = await fetch('/api/gateway/stats');
                if (r.ok) {
                    const data = await r.json();
                    setKey({ plainKey: data.plainKey || '', keyPrefix: data.keyPrefix, tier: data.tier, email: data.email || '', createdNow: false });
                    setHasKey(true);
                    return;
                }

                if (r.status === 404) {
                    setCreating(true);
                    const createRes = await fetch('/api/gateway/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
                    const data = await createRes.json();
                    if (createRes.ok) {
                        setKey({ plainKey: data.key, keyPrefix: data.key.substring(0, 20), tier: data.tier, email: data.email || user?.email || '', createdNow: true });
                        setHasKey(true);
                        toast.success('Your API Key has been generated automatically!');
                    } else {
                        setError(data.error || 'Failed to create key');
                        setHasKey(false);
                    }
                    setCreating(false);
                    return;
                }

                setHasKey(false);
            } catch {
                setHasKey(false);
            }
        };

        loadOrCreate();
    }, [status]);

    const handleCreate = async () => {
        setCreating(true);
        setError('');
        try {
            const res = await fetch('/api/gateway/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
            const data = await res.json();
            if (!res.ok) {
                const msg = data.error || 'Failed to create key';
                setError(msg);
                toast.error(msg);
                return;
            }
            setKey({ plainKey: data.key, keyPrefix: data.key.substring(0, 20), tier: data.tier, email: data.email || user?.email || '', createdNow: true });
            setHasKey(true);
            toast.success('Your API Key has been generated successfully!');
        } catch {
            const msg = 'Could not connect to gateway. Is the gateway running?';
            setError(msg);
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    if (status === 'loading' || hasKey === null || (creating && !key)) {
        return <ApiKeysSkeleton />;
    }

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="page-header animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>API Key</h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>
                            Each account is limited to <strong style={{ color: 'var(--text-main)' }}>one key</strong>. Treat it like a password — it won&apos;t be shown again.
                        </p>
                    </div>
                    {!hasKey && !creating && (
                        <button className="btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={handleCreate} disabled={creating}>
                            Retry
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                    <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>{error}</div>
                </div>
            )}

            {/* Key Card */}
            {key ? (
                <div className="glass-card animate-fade-2" style={{ padding: '32px', marginBottom: '28px' }}>
                    {key.createdNow && (
                        <div className="alert alert-success" style={{ marginBottom: '24px' }}>
                            <Sparkles size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Key created!</strong> Copy it now — it will <strong>never be shown again</strong>.
                            </div>
                        </div>
                    )}

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Token</th>
                                <th>Tier</th>
                                <th>Account</th>
                                {key.createdNow && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: '600' }}>My Gateway Key</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <code style={{ background: 'var(--bg-soft)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-main)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.3px', border: '1px solid var(--border)', maxWidth: '340px', overflowX: 'auto', display: 'block', fontWeight: key.plainKey ? '600' : 'normal' }}>
                                            {key.plainKey ? key.plainKey : `${key.keyPrefix}••••••••••••••••••••`}
                                        </code>
                                        {key.plainKey && <CopyBtn text={key.plainKey} />}
                                    </div>
                                </td>
                                <td><span className={`badge ${key.tier === 'pro' ? 'badge-warning' : 'badge-success'}`}>{key.tier}</span></td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{key.email}</td>
                                {key.createdNow && (
                                    <td>
                                        <CopyBtn text={key.plainKey} />
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="glass-card animate-fade-2" style={{ padding: '48px', textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><Key size={40} color="var(--text-muted)" strokeWidth={1.5} /></div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                        {creating ? 'Generating your key…' : 'Something went wrong'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 28px', lineHeight: '1.6' }}>
                        {creating ? 'Hang tight — we\'re setting up your free API key.' : 'Could not create your key automatically. Click retry or check if the gateway is running.'}
                    </p>
                    {!creating && (
                        <button className="btn-primary" style={{ margin: '0 auto', padding: '12px 36px', fontSize: '15px' }} onClick={handleCreate}>
                            Retry
                        </button>
                    )}
                </div>
            )}

            {/* Integration Docs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-card animate-fade-3" style={{ padding: '28px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>REST API</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', marginBottom: '18px' }}>
                        Pass your key as a Bearer token to any endpoint.
                    </p>
                    <div className="code-block">
                        <div><span style={{ color: '#60a5fa' }}>POST</span> {process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:4000'}/v1/chat/completions</div>
                        <div style={{ color: '#475569' }}>Authorization: Bearer sk-frenix-…</div>
                    </div>
                </div>

                <div className="glass-card animate-fade-3" style={{ padding: '28px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Compatible With</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', marginBottom: '18px' }}>
                        Works with any OpenAI-compatible client — just swap the base URL.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['OpenAI SDK', 'LangChain', 'LlamaIndex', 'curl', 'Axios', 'httpx'].map(lib => (
                            <span key={lib} style={{ padding: '4px 12px', borderRadius: '8px', background: 'var(--bg-soft)', border: '1px solid var(--border)', fontSize: '12px', fontWeight: '500' }}>{lib}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
