'use client'

import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Providers } from "@/components/Providers";

const navItems = [
    { name: 'Home', path: '/', icon: '⌂' },
    { name: 'Dashboard', path: '/dashboard', icon: '◈' },
    { name: 'API Keys', path: '/api-keys', icon: '⌗' },
    { name: 'Settings', path: '/settings', icon: '⚙' },
];

function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="sidebar">
            {/* Brand */}
            <div className="logo" style={{ marginBottom: '36px', padding: '0 8px' }}>
                <img src="/Logo-withoutbg.png" alt="Frenix" style={{ width: '40px', height: '40px' }} />
                <span>Frenix</span>
            </div>

            {/* Nav */}
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '12px', padding: '0 12px', textTransform: 'uppercase' }}>Navigation</p>
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path} className={`sidebar-item ${pathname === item.path ? 'active' : ''}`}>
                        <span className="sidebar-icon">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* User footer */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px', marginBottom: '12px' }}>
                    {session?.user?.image
                        ? <img src={session.user.image} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid var(--border)' }} />
                        : <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>👤</div>
                    }
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session?.user?.name || 'User'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{session?.user?.email || ''}</div>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="sidebar-item"
                    style={{ width: '100%', marginBottom: 0, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left', color: 'var(--text-muted)' }}
                >
                    <span className="sidebar-icon">↩</span>
                    Sign Out
                </button>
            </div>
        </nav>
    );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLanding = pathname === '/';
    const isAuth = pathname.startsWith('/api/auth') || pathname === '/signin';

    if (isAuth) return <>{children}</>;

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar only on inner pages */}
            {!isLanding && <Sidebar />}

            <div style={{ flex: 1, marginLeft: isLanding ? 0 : '260px', minHeight: '100vh' }}>
                {/* Landing Navbar */}
                {isLanding && (
                    <header className="navbar">
                        <div className="logo">
                            <img src="/Logo-withoutbg.png" alt="Frenix" style={{ width: '44px', height: '44px' }} />
                            <span>Frenix</span>
                        </div>
                        <nav style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
                            <Link href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}>Dashboard</Link>
                            <Link href="/api-keys" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}>API Keys</Link>
                            <Link href="/signin" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                                Sign In with GitHub
                            </Link>
                        </nav>
                    </header>
                )}

                {/* Page content */}
                {children}

                {/* Landing footer */}
                {isLanding && (
                    <footer style={{
                        padding: '32px 80px',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src="/Logo-withoutbg.png" style={{ width: '24px', height: '24px' }} />
                            <span>© 2026 Frenix Inc.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms</a>
                            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
                            <a href="#" style={{ color: 'var(--text-muted)' }}>GitHub</a>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
}
