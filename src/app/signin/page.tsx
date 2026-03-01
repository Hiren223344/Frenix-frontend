'use client'

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const [loading, setLoading] = useState(false);

    const handleGithub = async () => {
        setLoading(true);
        await signIn('github', { callbackUrl: '/oauth/github' });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            {/* Ambient blobs */}
            <div aria-hidden style={{ position: 'fixed', top: '-30%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,192,235,0.12), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div aria-hidden style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(33,181,165,0.10), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
                {/* Card */}
                <div style={{
                    background: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '24px',
                    padding: '48px 44px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 24px 60px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                }}>
                    {/* Logo */}
                    <div style={{ marginBottom: '32px' }}>
                        <img src="/Logo-withoutbg.png" alt="Frenix" style={{ width: '56px', height: '56px', marginBottom: '16px' }} />
                        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>Sign in to Frenix</h1>
                        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px', lineHeight: '1.6' }}>
                            Connect your GitHub account to access your AI gateway, API keys, and dashboard.
                        </p>
                    </div>

                    {/* GitHub Button */}
                    <button
                        onClick={handleGithub}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '13px 20px',
                            borderRadius: '12px',
                            background: '#0f172a',
                            color: '#fff',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: '600',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: 'opacity 0.2s, transform 0.2s',
                            opacity: loading ? 0.7 : 1,
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                    >
                        {/* GitHub icon SVG */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        {loading ? 'Connecting…' : 'Continue with GitHub'}
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                        <span style={{ color: '#94A3B8', fontSize: '12px' }}>More providers coming soon</span>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                    </div>

                    {/* Back */}
                    <Link href="/" style={{ color: '#64748B', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
                        ← Back to home
                    </Link>
                </div>

                {/* Footer note */}
                <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', marginTop: '20px', lineHeight: '1.6' }}>
                    By signing in you agree to our{' '}
                    <a href="#" style={{ color: '#64748B', textDecoration: 'underline' }}>Terms</a> &amp;{' '}
                    <a href="#" style={{ color: '#64748B', textDecoration: 'underline' }}>Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
