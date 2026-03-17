'use client'

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/ui/header-2';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLanding = pathname === '/';
    const isAuth = pathname.startsWith('/api/auth') || pathname === '/signin' || pathname === '/oauth/consent';
    const isRestrictedPath = pathname.startsWith('/admin') || pathname.startsWith('/team');

    const [user, setUser] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setStatus(user ? 'authenticated' : 'unauthenticated');
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setStatus(session?.user ? 'authenticated' : 'unauthenticated');
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/');
    };

    if (isAuth || isRestrictedPath) return <>{children}</>;

    const navLinks = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Models', href: '/models' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Blog', href: '/blog' },
    ];

    const isFullWidth = pathname === '/models' || pathname === '/playground' || pathname === '/oauth/consent';

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <Header
                links={navLinks}
                user={status === 'authenticated' ? user : null}
                onSignOut={handleSignOut}
            />

            <div style={{ height: '56px' }} aria-hidden="true" />

            <main style={{
                flex: 1,
                position: 'relative',
                width: '100%',
                maxWidth: isFullWidth ? 'none' : '1200px',
                margin: '0 auto',
                padding: isLanding || isFullWidth ? '0' : '0 24px'
            }}>
                {children}
            </main>

            {isLanding && (
                <footer style={{
                    padding: '48px 80px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    background: 'var(--bg)',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontWeight: '700', fontSize: '18px', letterSpacing: '-0.3px' }}>
                            <img src="/logo-withoutbg.png" alt="Frenix" style={{ width: '28px', height: '28px' }} />
                            <span>Frenix</span>
                        </div>
                        <p style={{ lineHeight: '1.6' }}>The unified AI gateway for developers. Route, monitor, and scale your applications from a single endpoint.</p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                            </a>
                        </div>
                        <span style={{ fontSize: '12px', marginTop: '4px', opacity: 0.6 }}>2026 Frenix Inc. All rights reserved.</span>
                        <span style={{ fontSize: '11px', marginTop: '2px', opacity: 0.5, fontStyle: 'italic' }}>Built by <strong style={{ fontWeight: 700, opacity: 1 }}>Hiren Ahlawat</strong></span>
                    </div>
                    <div style={{ display: 'flex', gap: '80px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</span>
                            <Link href="/blog" className="hover-text-primary">Blog</Link>
                            <Link href="/#pricing" className="hover-text-primary">Pricing</Link>
                            <Link href="/dashboard" className="hover-text-primary">Dashboard</Link>
                            <Link href="/api-keys" className="hover-text-primary">API Keys</Link>
                            <Link href="/docs" className="hover-text-primary">Documentation</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Support</span>
                            <Link href="/about" className="hover-text-primary">About Us</Link>
                            <Link href="/careers" className="hover-text-primary">Careers</Link>
                            <Link href="/community" className="hover-text-primary">Community</Link>
                            <Link href="/terms" className="hover-text-primary">Terms of service</Link>
                            <Link href="/privacy" className="hover-text-primary">Privacy policy</Link>
                            <Link href="/refund" className="hover-text-primary">Refund policy</Link>
                            <Link href="/status" className="hover-text-primary">Status</Link>
                            <a href="mailto:support@frenix.sh" className="hover-text-primary">Contact support</a>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
