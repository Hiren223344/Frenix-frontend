'use client'

import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Header } from '@/components/ui/header-2';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoaded, isSignedIn } = useUser();
    const { signOut } = useClerk();

    const isLanding = pathname === '/';
    const isAuth = pathname.startsWith('/api/auth') || pathname === '/signin' || pathname === '/oauth/consent';
    const isRestrictedPath = pathname.startsWith('/admin') || pathname.startsWith('/team');

    const status = !isLoaded ? 'loading' : isSignedIn ? 'authenticated' : 'unauthenticated';

    const handleSignOut = async () => {
        await signOut();
        router.refresh();
        router.push('/');
    };

    if (isAuth || isRestrictedPath) return <>{children}</>;

    const navLinks = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Models', href: '/models' },
        { label: 'Status', href: 'https://status.frenix.sh' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Blog', href: '/blog' },
    ];

    const isFullWidth = isLanding || pathname === '/models' || pathname === '/playground' || pathname === '/oauth/consent';

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <Header
                links={navLinks}
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
                <footer className="px-6 py-16 md:px-12 lg:px-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start gap-12 text-[13px] text-slate-500 bg-white relative z-10">
                    <div className="flex flex-col gap-6 max-w-sm">
                        <div className="flex items-center gap-3 text-slate-900 font-black text-2xl tracking-tighter uppercase mb-2">
                            <div className="size-14 rounded-[1.25rem] bg-black flex items-center justify-center shadow-lg shadow-slate-200">
                                <img src="/logo-withoutbg.png" alt="Frenix" className="w-9 h-9" />
                            </div>
                            <span>Frenix</span>
                        </div>
                        <p className="leading-relaxed text-slate-600 font-medium">The unified AI gateway for developers. Route, monitor, and scale your applications from a single endpoint.</p>
                        <div className="flex gap-3">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                            </a>
                        </div>
                        <div className="flex flex-col gap-1.5 opacity-80">
                            <span className="text-xs font-semibold text-slate-400">© 2026 Frenix Inc. · Standard of Intelligence</span>
                            <span className="text-[11px] font-medium text-slate-500 italic">Built with performance by <strong className="font-bold text-slate-900 not-italic">Hiren Ahlawat</strong></span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-12 lg:gap-24 uppercase tracking-[0.15em] text-[11px] font-black">
                        <div className="flex flex-col gap-4">
                            <span className="text-slate-900 mb-2">Product</span>
                            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
                            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                            <Link href="/api-keys" className="hover:text-blue-600 transition-colors">API Keys</Link>
                            <Link href="/docs" className="hover:text-blue-600 transition-colors">Documentation</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-slate-900 mb-2">Support</span>
                            <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                            <Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link>
                            <Link href="/community" className="hover:text-blue-600 transition-colors">Community</Link>
                            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
                            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
                            <Link href="/refund" className="hover:text-blue-600 transition-colors">Refund</Link>
                            <a href="https://status.frenix.sh" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Status</a>
                        </div>
                    </div>
                </footer>
            ) || null}
        </div>
    );
}
