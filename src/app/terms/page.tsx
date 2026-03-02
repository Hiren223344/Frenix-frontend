import Link from 'next/link';

export default function Terms() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
                <Link href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontWeight: '600' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '-2px', color: 'var(--text-main)' }}>Terms and Conditions</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-main)', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>1. Acceptance of Terms</h2>
                        <p>By accessing or using the Frenix AI Gateway ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use our Service. These terms apply to all visitors, users, and others who access the Service.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>2. User Accounts and API Keys</h2>
                        <p>To use our Service, you must sign in via GitHub. You are responsible for maintaining the confidentiality of your API keys and for all activities that occur under your keys. You agree not to share your API keys with unauthorized third parties. Frenix reserves the right to revoke keys at any time if we detect suspicious activity.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>3. Acceptable Use Policy</h2>
                        <p>You agree NOT to use the Service to:</p>
                        <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
                            <li>Generate, promote, or distribute illegal content, malware, or spam.</li>
                            <li>Attempt to reverse-engineer, bypass authentication, or disrupt the Service's infrastructure.</li>
                            <li>Collect or harvest any personally identifiable information from other users.</li>
                            <li>Violate the terms of service of the underlying AI model providers (e.g., OpenAI, Anthropic, etc.).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>4. Subscription and Payments</h2>
                        <p>Frenix offers both Free and Pro tiers of service. By subscribing to the Pro tier ($10/month), you are granted a higher rate limit of 20 Requests Per Minute (RPM). All payments are handled securely, and subscriptions are billed on a recurring monthly basis until cancelled.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>5. Rate Limiting and Fair Use</h2>
                        <p>To ensure stability for all users, we enforce strict rate limits. Free tier users are subject to dynamic limits based on server load. Pro tier users are guaranteed up to 20 RPM. Excessive usage or automated "botting" of our dashboard or API endpoints may result in temporary or permanent suspension of your account.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>6. Disclaimer of Warranties</h2>
                        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Frenix makes no representations or warranties of any kind, express or implied, as to the operation of the Service, the accuracy of AI-generated responses, or the continuous availability of specific models.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>7. Limitation of Liability</h2>
                        <p>In no event shall Frenix be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                    </section>

                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                        Last updated: March 2, 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
