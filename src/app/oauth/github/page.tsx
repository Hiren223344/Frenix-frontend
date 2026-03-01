import { getServerSession } from "next-auth/next";

export default async function OAuthRedirect() {
    const session = await getServerSession();

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="glass-card" style={{ padding: '48px', maxWidth: '500px' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Welcome, {session?.user?.name || 'Explorer'}!</h2>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px', border: '2px solid var(--primary)' }}>
                    {session?.user?.image ? (
                        <img src={session.user.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            👤
                        </div>
                    )}
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                    Your GitHub account has been successfully linked with Frenix Gateway.
                    Enjoy the next generation of AI management.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <a href="/" className="btn-primary">Dashboard</a>
                    <a href="/api/auth/signout" style={{ color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '12px' }}>Logout</a>
                </div>
            </div>
        </div>
    );
}
