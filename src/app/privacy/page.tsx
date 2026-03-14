import Link from 'next/link';

export default function Privacy() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '840px', margin: '0 auto', padding: '80px 24px' }}>
                <Link href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontWeight: '600' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '-2px', color: 'var(--text-main)' }}>Privacy Policy</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-main)', lineHeight: '1.8' }}>
                    <p>Frenix (“we”, “us” or “our”) respects your privacy and we are committed to protecting it through our compliance with this Privacy Policy. We have created this Privacy Policy to inform you of our policies regarding the collection, use and disclosure of personal data and the choices you have associated with that information. Capitalized terms used but not defined in this Privacy Policy have the meaning given to them in our Terms of Service.</p>

                    <p>This Privacy Policy applies to all personal data collected through any written, electronic, or oral communications, as you:</p>
                    <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                        <li>Access the Frenix website and all corresponding webpages and websites that link to this Privacy Policy (the “Site”);</li>
                        <li>Interact with our AI Gateway services, APIs, or playgrounds;</li>
                        <li>Utilize our Service via third-party integrations or direct API connections.</li>
                    </ul>

                    <p>Before using our Site and Service, please carefully read our Terms of Service and this Privacy Policy. By using this Site or Service, you consent to the collection and use of your personal data in accordance with this Privacy Policy and our Terms of Service. If you do not feel comfortable with any part of this Privacy Policy or our Terms of Service, you should not use or access our Site or Service.</p>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>1. Collection of Personal Data</h2>
                        <p>We collect personal data when you use our Site and our Service. Personal data is any information that relates to you, identifies you personally or could be used to identify you including, but not limited to: your name (retrieved via GitHub OAuth), email address, and IP address. Any prompt or text you input into the Service (“Inputs”) that include personal data will also be collected by us as part of the request processing.</p>
                        
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '20px', marginBottom: '10px' }}>Personal Data You Voluntarily Provide to Us</h3>
                        <p>The personal data we collect from you may include:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li>Information provided at the time of or after registering via GitHub OAuth, using our Service, and sending Inputs through the AI Gateway.</li>
                            <li>Records and copies of your correspondence (including email addresses), if you contact us for support or billing inquiries.</li>
                            <li>Your responses to surveys or feedback forms that we might ask you to complete for internal performance optimization.</li>
                            <li>Details of transactions you carry out through our Site, including subscription tier metadata and billing identifiers (processed via Razorpay or other gateways).</li>
                            <li>Your search queries on the Site and model selection history in the Playground.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>2. How We Use Your Personal Data</h2>
                        <p>We will only use your personal data as described in this Privacy Policy or as disclosed to you prior to such processing taking place. The purposes for which we may use your personal data include:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li><strong>Service Infrastructure:</strong> Authenticating requests, managing API keys, and routing prompts to upstream SOTA providers (OpenAI, Anthropic, etc.).</li>
                            <li><strong>Analytics & Logs:</strong> Monitoring traffic data, location data, and log files to understand how our orchestration layer is performing and to generate your dashboard statistics.</li>
                            <li><strong>Security:</strong> Using IP addresses, device signatures, and behavior patterns to combat spam, DDoS attacks, and unauthorized commercial reselling.</li>
                            <li><strong>Compliance:</strong> Maintaining legal and regulatory compliance and enforcing our strict "Individual Use" policy.</li>
                        </ul>

                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '20px', marginBottom: '10px' }}>Cookies and Other Tracking Technology</h3>
                        <p>We use Cookies and Tracking Technologies (such as Google Analytics) to personalize your experience. These technologies help us recognize your session, remember your dashboard preferences (like dark mode or sidebar state), and analyze usage to optimize our global edge nodes.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>3. How We Share and Disclose Your Personal Data</h2>
                        <p>We do not "sell" your personal data. Disclosure occurs only in the following business contexts:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li><strong>Infrastructure Providers:</strong> We share data with vendors like Vercel (hosting), Supabase (database), and Cloudflare (security) to perform tasks on our behalf.</li>
                            <li><strong>Upstream AI Providers:</strong> Your Inputs are sent to providers like OpenAI or Anthropic to generate responses. These providers have their own privacy policies governing that data.</li>
                            <li><strong>Corporate Transactions:</strong> In the event of a merger, divestiture, or sale of Frenix assets, your data may be transferred to the successor entity.</li>
                            <li><strong>Legal Obligations:</strong> We will disclose information if required by law, subpoena, or to protect the safety of our users and the public.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>4. Your Rights and Choices</h2>
                        <p>Depending on your jurisdiction (GDPR, CCPA, etc.), you have certain rights regarding your personal data:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li><strong>Right to Access:</strong> Request a copy of the metadata and account info we hold.</li>
                            <li><strong>Right to Deletion:</strong> Request the removal of your account and associated API keys.</li>
                            <li><strong>Right to Correction:</strong> Update inaccurate data through your account profile.</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>5. Data Security</h2>
                        <p>We have implemented robust measures designed to secure your personal data. API keys are encrypted at rest, and all traffic is secured via TLS 1.3. However, no internet transmission is 100% secure; you use the Site and Service at your own risk. You are responsible for keeping your API keys and credentials confidential.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>6. Data Retentions</h2>
                        <p>We retain your personal data for as long as necessary to fulfill your subscription requirements and comply with legal audits. When no longer required, data is either permanently deleted or anonymized for long-term statistical analysis.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>7. Minor Eligibility</h2>
                        <p>Frenix is intended for users who are at least 13 years of age. If we learn that we have collected personal data from a child under 13 without parental consent, we will delete that information immediately.</p>
                    </section>

                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                        Last updated: March 14, 2026. This policy supersedes all previous versions.
                    </p>
                </div>
            </div>
        </div>
    );
}
