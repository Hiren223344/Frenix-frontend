import Link from 'next/link';

export default function RefundPolicy() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '840px', margin: '0 auto', padding: '80px 24px' }}>
                <Link href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontWeight: '600' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '-2px', color: 'var(--text-main)' }}>Refund Policy</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', color: 'var(--text-main)', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>1. Overview</h2>
                        <p>At Frenix, we aim to be transparent regarding our billing. By subscribing to the Basic, Pro, or Ultra Tiers, you agree to the terms outlined in this Refund Policy. Our goal is to balance user satisfaction with the significant operational costs of providing high-performance AI orchestration.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>2. Refund Eligibility</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p>You may be eligible for a refund under the following strict circumstances:</p>
                            <ul style={{ paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li><strong>Documented Service Downtime:</strong> Total downtime exceeding 7 collective days within a 30-day period, or continuous core service downtime for 5 consecutive days.</li>
                                <li><strong>Model Availability:</strong> If a primary chat completion model designated in your plan (e.g., Llama 3.1) is non-functional for more than 2 consecutive days.</li>
                                <li><strong>Technical Non-compatibility:</strong> Proven failure of the API to meet its documented specifications (requires verifiable evidence).</li>
                                <li><strong>7-Day Grace Period:</strong> Full refund if requested within 7 days of initial signup, provided total usage is under 100 requests and no Ultra-tier SOTA models were consumed.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>3. Non-Refundable Items</h2>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><strong>Premium Consumption:</strong> Any usage of specialized SOTA models (Anthropic Claude, Grok, GPT-4o) or models exceeding $15 per million tokens.</li>
                            <li><strong>Beta Functionality:</strong> Services marked as "beta" or "experimental" (Vision, Image Gen, TTS).</li>
                            <li><strong>Security Blocks:</strong> Access denials triggered by Cloudflare, VPN usage, or poor IP reputation.</li>
                            <li><strong>Account Termination:</strong> Any refund requested after an account has been suspended for violating the "Individual Use" or "Fair Usage" policies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>4. Assessment Policy</h2>
                        <p>Refunds are assessed proportional to utilization. Users who have consumed significant resources (hundreds or thousands of dollars in credit equivalents) are fundamentally ineligible for full refunds. Each case is evaluated individually with fairness by our billing team.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>5. How to Request</h2>
                        <p>To initiate a request, contact <strong style={{ color: 'var(--primary)' }}>billing@frenix.ai</strong> with your registered GitHub email and API key identifier. Requests are typically processed within 3-5 business days. <strong>Note:</strong> Initiating a chargeback prior to contacting support will result in a permanent platform ban.</p>
                    </section>

                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                        Last updated: March 14, 2026.
                    </p>
                </div>
            </div>
        </div>
    );
}
