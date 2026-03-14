import Link from 'next/link';

export default function AboutUs() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '840px', margin: '0 auto', padding: '80px 24px' }}>
                <Link href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontWeight: '600' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '-2px', color: 'var(--text-main)' }}>About Us</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', color: 'var(--text-main)', lineHeight: '1.8' }}>
                    
                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>The Vision</h2>
                        <p>Frenix was born out of a simple realization: the AI landscape is becoming too fragmented. For developers and enterprises, switching between OpenAI, Anthropic, Google, and open-source models meant managing dozens of different API structures, billing cycles, and security protocols.</p>
                        <p style={{ marginTop: '16px' }}>Our mission is to provide a <strong>Unified Intelligence Architecture</strong>—a single, high-performance orchestration layer that gives you instant access to the world's most powerful AI models through a single, secure endpoint.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>What We Build</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>Unified API</h3>
                                <p style={{ fontSize: '14px', opacity: 0.8 }}>One integration. Access to GPT-4o, Claude 3.5, Llama 3.1, and beyond. Never update your core integration again.</p>
                            </div>
                            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>Security Layer</h3>
                                <p style={{ fontSize: '14px', opacity: 0.8 }}>Enterprise-grade encryption, XOR payload security, and Cloudflare-protected edge nodes ensure your data stays yours.</p>
                            </div>
                            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>Global Edge</h3>
                                <p style={{ fontSize: '14px', opacity: 0.8 }}>Distributed infrastructure across the US, EU, and Asia ensures minimal latency and maximum availability for your users.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>The Core Values</h2>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li><strong>Freedom of Choice:</strong> We believe you shouldn't be locked into a single provider. Switch models mid-chat or fall back to alternatives seamlessly.</li>
                            <li><strong>Transparent Performance:</strong> Real-time usage graphs, detailed billing, and open latency metrics. No hidden costs or "magic" numbers.</li>
                            <li><strong>Privacy by Default:</strong> We orchestrate traffic, we don't harvest it. Your prompts are relayed, not stored in terminal logs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Our Infrastructure</h2>
                        <p>Built with Next.js, Supabase, and Cloudflare, Frenix occupies the delicate intersection of high-availability networking and cutting-edge machine learning. Our stack is optimized for developers who need to ship today and scale tomorrow.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Join the Frontier</h2>
                        <p>Whether you're a solo developer building the next viral app or an enterprise optimizing internal workflows, Frenix provides the foundation you need. Join thousands of developers who are standardizing their intelligence layer on Frenix.</p>
                        <div style={{ marginTop: '32px' }}>
                            <Link href="/auth/signup" style={{ 
                                padding: '16px 32px', 
                                background: 'var(--primary)', 
                                color: 'black', 
                                borderRadius: '16px', 
                                fontWeight: '800', 
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontSize: '14px',
                                display: 'inline-block'
                            }}>
                                Start Building Now
                            </Link>
                        </div>
                    </section>

                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '32px', textAlign: 'center' }}>
                        © 2026 Frenix Infrastructure Group. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
