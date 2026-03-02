'use client'

import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StaggeredMenu from './ui/StaggeredMenu';
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, LayoutDashboard, Key, FileText, Settings, LogOut, LogIn, User } from 'lucide-react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLanding = pathname === '/';
    const isAuth = pathname.startsWith('/api/auth') || pathname === '/signin';

    const { data: session, status } = useSession();

    if (isAuth) return <>{children}</>;

    const navItems = [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Pricing', url: '/#pricing', icon: FileText },
        { name: 'Docs', url: '/docs', icon: FileText },
        { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { name: 'API Keys', url: '/api-keys', icon: Key }
    ];

    if (status === 'authenticated') {
        navItems.push({ name: 'Sign Out', url: '#logout', icon: LogOut });
    } else if (status === 'unauthenticated') {
        navItems.push({ name: 'Sign In', url: '/signin', icon: LogIn });
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar items={navItems} />

            {/* Height spacer to avoid content going under the fixed top navbar */}
            <div style={{ height: '80px' }} aria-hidden="true" />

            <main style={{
                flex: 1,
                position: 'relative',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: isLanding ? '0' : '0 24px'
            }}>
                {children}
            </main>

            {/* Landing footer */}
            {isLanding && (
                <footer style={{
                    padding: '64px 80px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    background: 'var(--bg)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px' }}>
                            <img src="/Logo-withoutbg.png" style={{ width: '32px', height: '32px' }} />
                            <span>Frenix</span>
                        </div>
                        <p style={{ lineHeight: '1.6' }}>The universal AI gateway for developers. Route, monitor, and scale your AI applications with ease.</p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                            <a href="https://github.com" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>𝕏</a>
                            <a href="https://github.com" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}></a>
                            <a href="https://github.com" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}></a>
                        </div>
                        <span style={{ fontSize: '12px', marginTop: '12px' }}>© 2026 Frenix Inc. All rights reserved.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '80px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</span>
                            <Link href="/#pricing" className="hover-text-primary">Pricing</Link>
                            <Link href="/dashboard" className="hover-text-primary">Dashboard</Link>
                            <Link href="/api-keys" className="hover-text-primary">API Keys</Link>
                            <Link href="/docs" className="hover-text-primary">Documentation</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Support</span>
                            <Link href="/terms" className="hover-text-primary">Terms of Service</Link>
                            <Link href="/privacy" className="hover-text-primary">Privacy Policy</Link>
                            <Link href="/refund" className="hover-text-primary">Refund Policy</Link>
                            <Link href="/status" className="hover-text-primary">Status</Link>
                            <a href="mailto:support@frenix.io" className="hover-text-primary">Contact Support</a>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
