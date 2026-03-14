'use client'

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { User, Mail, AtSign, BadgeCheck, ShieldCheck, Camera, Code2, Plus, Globe, Trash2, Key, ExternalLink, Copy, Check } from 'lucide-react';

export default function AccountPage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'developer'>('profile');

    // OAuth Apps state
    const [oauthApps, setOauthApps] = useState<any[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [isCreatingApp, setIsCreatingApp] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [newAppRedirects, setNewAppRedirects] = useState('');
    const [newAppLogo, setNewAppLogo] = useState('');
    const [showSecret, setShowSecret] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedSecret, setCopiedSecret] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/signin');
                return;
            }
            setUser(user);

            // Hydrate fields from user_metadata
            const meta = user.user_metadata || {};
            setFirstName(meta.first_name || meta.full_name?.split(' ')[0] || '');
            setLastName(meta.last_name || meta.full_name?.split(' ').slice(1).join(' ') || '');
            setUsername(meta.user_name || user.email?.split('@')[0] || '');
            setAvatarUrl(meta.avatar_url || '');

            setLoading(false);
        };
        checkUser();
        fetchOAuthApps();
    }, [router]);

    const fetchOAuthApps = async () => {
        setLoadingApps(true);
        try {
            const res = await fetch('/api/oauth/apps');
            if (res.ok) {
                const data = await res.json();
                setOauthApps(data);
            }
        } catch (err) {
            console.error('Failed to fetch apps:', err);
        } finally {
            setLoadingApps(false);
        }
    };

    const handleCreateApp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingApp(true);
        try {
            const res = await fetch('/api/oauth/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newAppName,
                    redirect_uris: newAppRedirects.split(',').map(s => s.trim()).filter(Boolean),
                    logo_url: newAppLogo
                })
            });

            if (res.ok) {
                const newApp = await res.json();
                toast.success('OAuth App created!');
                setOauthApps([newApp, ...oauthApps]);
                setNewAppName('');
                setNewAppRedirects('');
                setNewAppLogo('');
                setShowSecret(newApp.client_secret);
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to create app');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setIsCreatingApp(false);
        }
    };

    const handleDeleteApp = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        try {
            const res = await fetch(`/api/oauth/apps/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('App deleted');
                setOauthApps(oauthApps.filter(a => a.id !== id));
            }
        } catch (err) {
            toast.error('Failed to delete app');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: `${firstName} ${lastName}`.trim(),
                first_name: firstName,
                last_name: lastName,
                user_name: username,
                avatar_url: avatarUrl
            }
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Profile updated successfully');
            // Refresh local state
            const { data: { user: updated } } = await supabase.auth.getUser();
            setUser(updated);
        }
        setUpdating(false);
    };

    const copyToClipboard = (text: string, type: 'id' | 'secret') => {
        navigator.clipboard.writeText(text);
        if (type === 'id') {
            setCopiedId(text);
            setTimeout(() => setCopiedId(null), 2000);
        } else {
            setCopiedSecret(text);
            setTimeout(() => setCopiedSecret(null), 2000);
        }
        toast.success(`Copied ${type === 'id' ? 'Client ID' : 'Client Secret'} to clipboard`);
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="dashboard-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
            <div className="page-header animate-fade" style={{ textAlign: 'center', border: 'none', marginBottom: '48px' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '8px 20px',
                    background: 'rgba(45, 212, 191, 0.1)',
                    borderRadius: '30px',
                    color: 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '16px'
                }}>
                    User Preferences
                </div>
                <h1 style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '12px', color: 'var(--text-main)' }}>Account Portal</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
                    Manage your gateway identity, developer applications, and account metadata.
                </p>
            </div>

            <div style={{
                display: 'flex',
                gap: '8px',
                background: 'rgba(255,255,255,0.03)',
                padding: '6px',
                borderRadius: '16px',
                width: 'fit-content',
                margin: '0 auto 40px auto',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={activeTab === 'profile' ? 'tab-active' : 'tab-inactive'}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        background: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'profile' ? '#000' : 'var(--text-muted)'
                    }}
                >
                    <User size={16} />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('developer')}
                    className={activeTab === 'developer' ? 'tab-active' : 'tab-inactive'}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        background: activeTab === 'developer' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'developer' ? '#000' : 'var(--text-muted)'
                    }}
                >
                    <Code2 size={16} />
                    Developer
                </button>
            </div>

            {activeTab === 'profile' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }} className="animate-fade-2">
                {/* Left: Preview Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            height: '80px',
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            opacity: 0.1,
                            zIndex: 0
                        }} />

                        <div style={{ position: 'relative', zIndex: 1, marginBottom: '20px' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '32px',
                                margin: '0 auto',
                                overflow: 'hidden',
                                border: '4px solid var(--bg-card)',
                                boxShadow: 'var(--shadow-lg)',
                                background: 'var(--bg-soft)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="PFP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={48} color="var(--text-muted)" />
                                )}
                            </div>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                                {firstName} {lastName}
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', marginBottom: '16px' }}>
                                @{username}
                            </p>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'var(--bg-soft)',
                                padding: '10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                border: '1px solid var(--border)'
                            }}>
                                <Mail size={14} color="var(--text-muted)" />
                                <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Status</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                <BadgeCheck size={16} color="#10b981" />
                                <span style={{ color: 'var(--text-muted)' }}>Email Verified</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                <ShieldCheck size={16} color="var(--primary)" />
                                <span style={{ color: 'var(--text-muted)' }}>Free Tier Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Detailed Edit Form */}
                <div className="glass-card" style={{ padding: '40px' }}>
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="account-input"
                                    placeholder="Jane"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="account-input"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <AtSign size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="account-input"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="janedoe"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Profile Picture URL</label>
                            <div style={{ position: 'relative' }}>
                                <Camera size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="url"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="account-input"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="https://example.com/pfp.jpg"
                                />
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Paste any image link to update your avatar.</p>
                        </div>

                        <div style={{ paddingTop: '12px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={updating}
                                style={{ width: '100%', justifyContent: 'center', height: '52px' }}
                            >
                                {updating ? (
                                    <>
                                        <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px', borderBottomColor: '#fff' }}></div>
                                        <span>Saving Profile...</span>
                                    </>
                                ) : (
                                    <>Save Profile Changes</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            ) : (
                <div className="animate-fade-2" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Create App Section */}
                    <div className="glass-card" style={{ padding: '40px' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Create New OAuth App</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Build a "Sign in with Frenix" experience for your users.</p>
                        </div>

                        <form onSubmit={handleCreateApp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Application Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <Globe size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            value={newAppName}
                                            onChange={(e) => setNewAppName(e.target.value)}
                                            className="account-input"
                                            style={{ paddingLeft: '40px' }}
                                            placeholder="My Awesome App"
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Logo URL</label>
                                    <div style={{ position: 'relative' }}>
                                        <Camera size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="url"
                                            value={newAppLogo}
                                            onChange={(e) => setNewAppLogo(e.target.value)}
                                            className="account-input"
                                            style={{ paddingLeft: '40px' }}
                                            placeholder="https://example.com/logo.png"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Redirect URIs (comma separated)</label>
                                <input
                                    type="text"
                                    value={newAppRedirects}
                                    onChange={(e) => setNewAppRedirects(e.target.value)}
                                    className="account-input"
                                    placeholder="http://localhost:3000/callback, https://myapp.com/auth"
                                    required
                                />
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Exact matches only. No wildcards allowed for OAuth 2.1.</p>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isCreatingApp}
                                style={{ height: '52px', justifyContent: 'center' }}
                            >
                                {isCreatingApp ? 'Creating...' : (
                                    <>
                                        <Plus size={18} />
                                        <span>Register Application</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* App Secrets Modal (Simplified as a highlight box) */}
                    {showSecret && (
                        <div className="glass-card" style={{ padding: '32px', border: '2px solid var(--primary)', background: 'rgba(45, 212, 191, 0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ShieldCheck color="var(--primary)" />
                                    <h3 style={{ fontWeight: '800', fontSize: '18px' }}>Client Secret Created</h3>
                                </div>
                                <button onClick={() => setShowSecret(null)} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dismiss</button>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                Save this secret now. It will not be shown again for security reasons.
                            </p>
                            <div style={{ background: '#000', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '14px', position: 'relative' }}>
                                <span style={{ color: 'var(--primary)' }}>{showSecret}</span>
                            </div>
                        </div>
                    )}

                    {/* Existing Apps List */}
                    <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
                        <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)' }}>
                            <h2 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Your Applications</h2>
                        </div>
                        
                        {loadingApps ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
                        ) : oauthApps.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <Globe size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px auto', opacity: 0.3 }} />
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-muted)' }}>No OAuth apps found</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', opacity: 0.6 }}>Create your first app to get started.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                                            <th style={{ padding: '16px 40px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
                                            <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Client ID</th>
                                            <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Client Type</th>
                                            <th style={{ padding: '16px 20px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Registration</th>
                                            <th style={{ padding: '16px 40px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {oauthApps.map((app) => (
                                            <tr key={app.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover-bg-soft">
                                                <td style={{ padding: '24px 40px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                            {app.logo_url ? <img src={app.logo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Globe size={14} color="var(--text-muted)" />}
                                                        </div>
                                                        <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '14px' }}>{app.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '24px 20px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: 'fit-content' }}>
                                                            <code style={{ fontSize: '11px', color: 'var(--primary)', fontFamily: 'monospace' }}>{app.client_id.slice(0, 15)}...</code>
                                                            <button onClick={() => copyToClipboard(app.client_id, 'id')} style={{ color: 'var(--text-muted)' }}>
                                                                {copiedId === app.client_id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                                                            </button>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: 'fit-content' }}>
                                                            <code style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>••••••••••••</code>
                                                            <button onClick={() => copyToClipboard(app.client_secret, 'secret')} style={{ color: 'var(--text-muted)' }}>
                                                                {copiedSecret === app.client_secret ? <Check size={12} color="#10b981" /> : <Key size={12} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '24px 20px' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        Confidential
                                                    </span>
                                                </td>
                                                <td style={{ padding: '24px 20px' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)', background: 'rgba(45, 212, 191, 0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                                                        Programmatic
                                                    </span>
                                                </td>
                                                <td style={{ padding: '24px 40px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                                        <button 
                                                            onClick={() => {
                                                                const url = `${window.location.origin}/oauth/consent?authorization_id=test_preview_only`;
                                                                window.open(url, '_blank');
                                                            }}
                                                            className="icon-btn-gold" 
                                                            title="Preview Consent Screen"
                                                            style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', cursor: 'pointer' }}
                                                        >
                                                            <ExternalLink size={16} color="var(--primary)" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteApp(app.id)}
                                                            className="icon-btn-danger" 
                                                            title="Delete Application"
                                                            style={{ padding: '10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}
                                                        >
                                                            <Trash2 size={16} color="#ef4444" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="animate-fade-3" style={{ textAlign: 'center', marginTop: '48px' }}>
                <Link href="/dashboard" style={{
                    color: 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                }} className="hover-text-primary">
                    <span>←</span> Return to Gateway Dashboard
                </Link>
            </div>

        </div>
    );
}
