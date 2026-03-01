'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';

interface StoredKey {
    plainKey: string;   // only present right after creation
    keyPrefix: string;
    tier: string;
    email: string;
    createdNow: boolean;
}

function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? '#059669' : 'var(--text-muted)', fontSize: '13px', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.2s', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}
        >
            {copied ? '✓ Copied' : '⎘ Copy'}
        </button>
    );
}

export default function ApiKeys() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() { redirect('/signin'); },
    });

    const [key, setKey] = useState<StoredKey | null>(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [hasKey, setHasKey] = useState<boolean | null>(null); // null = loading

    // On mount, check if user already has a key via stats endpoint
    useEffect(() => {
        if (status !== 'authenticated') return;
        fetch('/api/gateway/stats')
            .then(r => {
                if (r.status === 404) { setHasKey(false); return null; }
                if (r.ok) { setHasKey(true); return r.json(); }
                return null;
            })
            .then(data => {
                if (data) {
                    setKey({ plainKey: '', keyPrefix: data.keyPrefix, tier: data.tier, email: data.email || '', createdNow: false });
                }
            })
            .catch(() => setHasKey(false));
    }, [status]);

    const handleCreate = async () => {
        setCreating(true);
        setError('');
        try {
            const res = await fetch('/api/gateway/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed to create key'); return; }
            setKey({ plainKey: data.key, keyPrefix: data.key.substring(0, 20), tier: data.tier, email: data.email || session?.user?.email || '', createdNow: true });
            setHasKey(true);
        } catch {
            setError('Could not connect to gateway. Is the gateway running?');
        } finally {
            setCreating(false);
        }
    };

    if (status === 'loading' || hasKey === null) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading…</div>;
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
                    {!hasKey && (
                        <button className="btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={handleCreate} disabled={creating}>
                            {creating ? '⏳ Creating…' : '+ Generate My Key'}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', color: '#991B1B', fontSize: '14px', display: 'flex', gap: '8px' }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Key Card */}
            {key ? (
                <div className="glass-card animate-fade-2" style={{ padding: '32px', marginBottom: '28px' }}>
                    {key.createdNow && (
                        <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', color: '#065F46', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '18px' }}>🎉</span>
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
                                        <code style={{ background: key.createdNow ? '#F0FDF4' : '#F8FAFC', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', color: key.createdNow ? '#065F46' : 'var(--text-muted)', letterSpacing: '0.5px', border: '1px solid ' + (key.createdNow ? '#6EE7B7' : 'var(--border)'), maxWidth: '340px', overflowX: 'auto', display: 'block' }}>
                                            {key.createdNow ? key.plainKey : `${key.keyPrefix}••••••••••••••••••••`}
                                        </code>
                                        {key.createdNow && <CopyBtn text={key.plainKey} />}
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
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No API Key Yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 28px', lineHeight: '1.6' }}>
                        Generate your free key to start calling the Frenix AI Gateway. One key per account.
                    </p>
                    <button className="btn-primary" style={{ margin: '0 auto', padding: '12px 36px', fontSize: '15px' }} onClick={handleCreate} disabled={creating}>
                        {creating ? '⏳ Creating…' : 'Generate Free Key'}
                    </button>
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
                        <div><span style={{ color: 'var(--secondary)' }}>POST</span> {process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:4000'}/v1/chat/completions</div>
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
