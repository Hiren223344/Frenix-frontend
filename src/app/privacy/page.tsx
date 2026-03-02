import Link from 'next/link';

export default function Privacy() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
                <Link href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontWeight: '600' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '-2px', color: 'var(--text-main)' }}>Privacy Policy</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', color: 'var(--text-main)', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>1. Collection of Personal Data</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p>Frenix collects information that identifies, relates to, describes, or is reasonably capable of being associated with you ("Personal Data"). The types of data we collect include:</p>
                            <ul style={{ paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li><strong>Direct Identifiers:</strong> Your full name, Github username, account ID, and email address associated with your Git provider.</li>
                                <li><strong>Technical & Usage Data:</strong> Detailed logs of your interactions with our API, including IP addresses, browser user-agent strings, referring URLs, access times, and pages viewed.</li>
                                <li><strong>Model Interaction Metadata:</strong> We record timestamps, the specific AI model requested, the duration of the request, response status codes, and total token usage (prompt + completion).</li>
                                <li><strong>Financial Metadata:</strong> While we use third-party payment processors, we may retain metadata related to your subscription tier, billing cycle, and transaction history identifiers.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>2. How We Use Your Personal Data</h2>
                        <p style={{ marginBottom: '16px' }}>Our processing of your Personal Data is grounded in providing a high-performance orchestration layer. We use your data to:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><strong>Service Delivery:</strong> Managing your API keys, authenticating your requests, and routing them to the appropriate upstream AI providers.</li>
                            <li><strong>Analytics & Diagnostics:</strong> Generating the "Usage Graph" and "Operations" statistics in your dashboard to help you monitor costs and performance.</li>
                            <li><strong>Security & Integrity:</strong> Monitoring for "botting," brute-force attacks on API keys, and ensuring compliance with our 20 RPM (Pro Tier) rate limits.</li>
                            <li><strong>Product Improvement:</strong> Aggregating anonymized usage data to identify which models are most popular and optimizing our global latency.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>3. How We Share and Disclose Your Personal Data</h2>
                        <p style={{ marginBottom: '16px' }}>Frenix enforces a strict "no-sale" policy regarding your information. Disclosure occurs only under specific operational requirements:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><strong>Upstream Model Providers:</strong> When you send a request, your prompt content is relayed to providers like OpenAI, LLC or Anthropic, PBC. While Frenix doesn't store terminal logs of this content, the providers themselves have their own retention policies.</li>
                            <li><strong>Infrastructure Sub-processors:</strong> Our hosting providers (e.g., AWS, Vercel) and database providers (e.g., Supabase, MongoDB) act as data processors under strict confidentiality agreements.</li>
                            <li><strong>Legal & Compliance:</strong> We may disclose data if required by a valid subpoena, court order, or if we believe in good faith that disclosure is necessary to prevent physical harm or financial loss.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>4. Your Rights and Choices</h2>
                        <p>Under global privacy frameworks (including GDPR and CCPA), you hold significant rights over your data. You may request to:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><strong>Access & Portability:</strong> Obtain a copy of all metadata and account information we hold in a machine-readable format.</li>
                            <li><strong>Rectification:</strong> Correct any inaccurate personal data (often via your linked GitHub profile).</li>
                            <li><strong>Erasure ("Right to be Forgotten"):</strong> Request the permanent deletion of your Frenix account and all associated API keys and usage history.</li>
                            <li><strong>Restriction of Processing:</strong> Object to our use of your data for specific analytics or marketing purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>5. Data Security</h2>
                        <p>Frenix employs a multi-layered security strategy. Your API keys are encrypted at rest using AES-256 standards, and all transport layer traffic is secured via TLS 1.3. We conduct regular vulnerability assessments and enforce strict principle-of-least-privilege access for our internal administrative tools. In the event of a suspected data breach, we will notify affected users and relevant authorities within 72 hours of verification.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>6. Integration of Third-Party Platforms</h2>
                        <p>Our service relies on GitHub OAuth for seamless entry. By using this integration, you authorize us to access specific tokens and profile data. We do not store your GitHub password. Furthermore, any third-party "Add-ons" or custom plugins you enable may collect their own data; we advise reviewing the manifest and privacy terms for every external integration you authorize.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>7. Personal Data Retention</h2>
                        <p>We maintain data only as long as necessary for operative purposes. Account data is kept for the duration of your active subscription. Metadata related to API requests is stored for 90 days in "Hot Storage" for dashboard visualization, after which it is moved to encrypted cold storage for up to 1 year for audit purposes before permanent purging.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>8. Eligibility</h2>
                        <p>Our services are strictly controlled for users aged 18 and older. Frenix does not knowingly market to or collect data from minors. If you are a parent or guardian and believe your child has provided us with Personal Data, please contact us immediately to facilitate its removal from our systems.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>9. Data Transfers</h2>
                        <p>Frenix is a global service. Your data may be processed in the United States, Singapore, or the European Union depending on your proximity to our edge nodes. We utilize Standard Contractual Clauses (SCCs) to ensure your data remains protected even when moving across international borders.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>10. Governing Law</h2>
                        <p>Any disputes arising from this Privacy Policy shall be governed by the laws of the jurisdiction where our parent entity is registered. You agree to submit to the exclusive jurisdiction of the courts located within that territory for the resolution of any legal matter arising from the Service.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>11. Regulatory Disclosures (GDPR & U.S. State Laws)</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>European Economic Area (GDPR)</h3>
                                <p>Our legal bases for processing include: (a) Performance of a Contract, (b) Legitimate Interest in security and service optimization, and (c) Compliance with Legal Obligations. The "Data Controller" for EEA users can be reached via our official support channels.</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>California Privacy Rights (CCPA/CPRA)</h3>
                                <p>Frenix does not "Sell" your information as defined by the CCPA. We do "Share" specific metadata with service providers for business purposes. California residents have the right to opt-out of sharing for cross-contextual behavioral advertising and the right to non-discrimination for exercising their privacy rights.</p>
                            </div>
                        </div>
                    </section>

                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                        Last updated: March 2, 2026. This version supersedes all previous versions.
                    </p>
                </div>
            </div>
        </div>
    );
}
