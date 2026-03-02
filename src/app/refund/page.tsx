import Link from 'next/link';

export default function RefundPolicy() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
                <Link href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontWeight: '600' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '-2px', color: 'var(--text-main)' }}>Refund Policy</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', color: 'var(--text-main)', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>1. Overview</h2>
                        <p>At Frenix, we strive to provide a robust and high-availability AI gateway. We understand that issues may arise, and we aim to be fair and transparent regarding our billing and refund processes. By subscribing to our Pro Tier or purchasing credits, you agree to the terms outlined in this Refund Policy.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>2. Subscription Refunds (Pro Tier)</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p>For our monthly Pro Tier subscription ($10/month), the following rules apply:</p>
                            <ul style={{ paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li><strong>7-Day Window:</strong> You are eligible for a full refund if you request it within 7 days of your initial subscription, provided you have not exceeded 100 requests during that period.</li>
                                <li><strong>Partial Usage:</strong> Refunds are generally not provided for mid-month cancellations. If you cancel your subscription, you will maintain Pro Tier access until the end of your current billing cycle.</li>
                                <li><strong>Renewal Charges:</strong> It is the user's responsibility to cancel their subscription before the renewal date. Refund requests for accidental renewals made more than 48 hours after the charge will not be honored.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>3. Service Disruptions</h2>
                        <p>In the event of a significant, prolonged service outage (exceeding 24 consecutive hours) caused directly by Frenix infrastructure, we may, at our discretion, provide pro-rated refunds or service credits to affected Pro Tier users. This does not apply to outages caused by upstream AI providers (e.g., OpenAI, Anthropic) or external internet infrastructure.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>4. Abuse and Termination</h2>
                        <p>Refunds will NOT be provided to users whose accounts have been terminated due to a violation of our Terms of Service. This includes, but is not limited to, unauthorized commercial resale, prompt injection attacks, or exceeding rate limits through automated exploitation.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>5. How to Request a Refund</h2>
                        <p>To request a refund, please contact our support team at <strong style={{ color: 'var(--primary)' }}>billing@frenix.ai</strong>. Please include your GitHub username, the email associated with your account, and a brief explanation of why you are requesting a refund. Most requests are processed within 3-5 business days.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>6. Chargebacks</h2>
                        <p>By initiating a chargeback or dispute with your bank before contacting us, you agree to an immediate and permanent suspension of your Frenix account and the revocation of all active API keys.</p>
                    </section>

                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                        Last updated: March 2, 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
