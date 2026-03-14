import Link from 'next/link';

export default function Terms() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <div style={{ maxWidth: '840px', margin: '0 auto', padding: '80px 24px' }}>
                <Link href="/" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontWeight: '600' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '-2px', color: 'var(--text-main)' }}>Terms of Service</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-main)', lineHeight: '1.8' }}>
                    <p style={{ fontWeight: '600' }}>Last Updated: March 14, 2026</p>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>1. Agreement to Terms</h2>
                        <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Frenix (“Company”, “we”, “us”, or “our”), concerning your access to and use of the Frenix website as well as any other media form, media channel, or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).</p>
                        <p>You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Service. <strong>IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.</strong></p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>2. Intellectual Property Rights</h2>
                        <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, text, and the trademarks/logos (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
                        <p>The Content and Marks are provided on the Site “AS IS” for your information and personal use only. No part of the Site may be exploited for any commercial purpose whatsoever without our express prior written permission.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>3. User Representations</h2>
                        <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true and accurate (retrieved via GitHub OAuth); (2) you have the legal capacity to comply with these terms; (3) you are not a minor; (4) you will not access the Site through automated means; (5) you will not use the Site for any illegal purpose.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>4. Prohibited Activities</h2>
                        <p>You agree not to:</p>
                        <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li>Systematically retrieve data to compile a database without permission.</li>
                            <li>Circumvent, disable, or interfere with security features of the Site, including Cloudflare protection.</li>
                            <li>Engage in unauthorized framing or linking to the Site.</li>
                            <li>Attempt to impersonate another user or profile.</li>
                            <li>Use our services for business scaling, team operations, or commercial reselling without an Enterprise plan.</li>
                            <li>Except as the result of standard search engine usage, use any automated system (spiders, robots, scrapers) that accesses the Site.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>5. Subscription Plans and Usage Policies</h2>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '10px' }}>5.1 Plan Hierarchy</h3>
                        <p><strong>Free Plan:</strong> Limited access for exploration (5 RPM, 300 RPD), restricted models, and reduced context windows.</p>
                        <p><strong>Basic Plan ($15/month):</strong> Personal use, providing access to good quality models with 10 RPM base rate limits.</p>
                        <p><strong>Pro Plan ($25/month):</strong> Individual professional use, access to almost all open-source and SOTA models (excluding Anthropic/Grok).</p>
                        <p><strong>Ultra Plan ($40/month):</strong> Premium tier with exclusive access to all models including Anthropic (Claude) and Grok series, with priority support.</p>
                        
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '10px' }}>5.2 Individual Use & Fair Usage</h3>
                        <p>Accounts are strictly for <strong>one person, one account</strong>. They are NOT for business operations, team sharing, or commercial redistribution. We employ advanced detection systems to identify abuse patterns. Violations will result in immediate suspension without refund.</p>
                        
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '10px' }}>5.3 Dynamic Model Allocation</h3>
                        <p>We reserve the right to prioritize access for Ultra plan subscribers during periods of exceptionally high demand. Models initially available in Basic or Pro plans may be temporarily or permanently moved to higher tiers based on real-time operational costs.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>7. Refund Policy</h2>
                        <p>Refund eligibility is tied to service uptime. Key points: (1) Total downtime exceeding 7 cumulative days in a 30-day period; (2) Core chat completion failure for more than 2 consecutive days. High-usage scenarios (consuming significant credits on a flat-fee plan) preclude refund eligibility. For full details, see our Refund Policy page.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>9. Third-Party Security Services (Cloudflare)</h2>
                        <p>Frenix utilizes Cloudflare and other WAF services for DDoS protection and bot mitigation. You are solely responsible for ensuring your network (IP reputation, VPN usage) does not trigger these security blocks. <strong>Frenix will not modify security rules, whitelist IPs, or bypass WAF thresholds</strong> to accommodate individual user accounts. Access issues caused by third-party security services are explicitly non-refundable.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>10. Beta Features</h2>
                        <p>Functionalities marked as "beta," "experimental," or "preview" (e.g., Vision, Function Calling) are provided "as-is" without warranty. They are not covered by our uptime guarantees or refund policies.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>15. Term and Termination</h2>
                        <p>These terms remain in effect while you use the Site. We reserve the right to deny access (including blocking IP addresses) for any reason or no reason, without notice or liability.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>20. Disclaimer & Liability</h2>
                        <p>The Site is provided on an AS-IS and AS-AVAILABLE basis. Frenix will not be liable for any direct, indirect, or consequential damages resulting from your use of the Service. Our liability is limited to the amount paid by you during the six (6) month period prior to any cause of action.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>26. Contact Us</h2>
                        <p>To resolve a complaint or receive further information, please contact us through the official support channels on the Site.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
