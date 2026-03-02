'use client'

import Link from 'next/link';
import { toast } from 'sonner';
import SplitText from '@/components/ui/SplitText';
import CountUp from '@/components/ui/CountUp';
import { OpenAI, Anthropic, Google, Meta, Mistral, HuggingFace } from '@lobehub/icons';

const features = [
  {
    title: "Dynamic Routing",
    desc: "Intelligent traffic management across OpenAI, Anthropic, Gemini, and local LLMs — all from one endpoint.",
    icon: "⚡",
    color: "rgba(91, 192, 235, 0.15)",
  },
  {
    title: "GitHub OAuth",
    desc: "Enterprise-grade sign-in with GitHub. Secure, fast, and zero friction for your team.",
    icon: "🔐",
    color: "rgba(33, 193, 165, 0.15)",
  },
  {
    title: "Universal API",
    desc: "One token, every model. Drop-in replacement for direct provider calls — no client changes needed.",
    icon: "🌐",
    color: "rgba(245, 210, 112, 0.12)",
  },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero (Evolvex Style) ─────────────────────────────────── */}
      <section className="hero-section-new animate-fade" style={{
        paddingTop: '200px',
        paddingBottom: '120px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '80vh',
        justifyContent: 'center'
      }}>
        <div className="hero-grid-bg" />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '100px',
          background: 'var(--bg-card)',
          color: 'var(--primary)',
          marginBottom: '40px',
          border: '1px solid var(--border)',
          fontSize: '11px', fontWeight: '800', letterSpacing: '2px',
          textTransform: 'uppercase',
          boxShadow: 'var(--shadow)',
          zIndex: 2
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px #10B981' }} />
          V1 API LIVE
        </div>

        <div style={{ textAlign: 'center', zIndex: 2, width: '100%', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(3.5rem, 12vw, 7.5rem)',
            color: 'var(--text-main)',
            letterSpacing: '-0.04em',
            lineHeight: '0.9',
            fontWeight: '950',
            margin: '0',
            display: 'block'
          }}>
            Democratizing
          </h1>
          <div style={{
            background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #D946EF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '950',
            letterSpacing: '-0.04em',
            fontSize: 'clamp(3.5rem, 12vw, 7.5rem)',
            lineHeight: '1.0',
            margin: '5px 0 0 0',
            display: 'inline-block'
          }}>
            Machine Intelligence.
          </div>
        </div>

        <div style={{ marginTop: '40px', maxWidth: '720px', padding: '0 20px', textAlign: 'center', zIndex: 2 }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: '1.4',
            fontWeight: '500',
          }}>
            Access <strong style={{ color: 'var(--text-main)' }}>150+ state-of-the-art LLMs</strong> via a single, keyless endpoint. The unified interface for the next generation of AI applications.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '60px', flexWrap: 'wrap', alignItems: 'center', zIndex: 2 }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: '18px 48px', gap: '14px', fontSize: '18px', borderRadius: '100px', background: '#0F172A', color: 'white', fontWeight: '800' }}>
            Explore Models
            <span style={{ opacity: 0.6 }}>→</span>
          </Link>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 28px', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: '100px',
            fontSize: '15px', color: 'var(--text-main)',
            fontFamily: 'monospace', cursor: 'pointer',
            boxShadow: 'var(--shadow)',
            transition: 'all 0.2s ease'
          }} onClick={() => {
            navigator.clipboard.writeText('api.frenix.io/v1');
            toast.success('Endpoint copied to clipboard!');
          }}>
            <span style={{ opacity: 0.6 }}>api.frenix.io/v1</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </div>
        </div>

        {/* Partner Logos */}
        <div style={{
          marginTop: '100px',
          textAlign: 'center',
          zIndex: 2
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800', marginBottom: '40px', opacity: 0.5 }}>
            Access Leading AI Models of top labs in one place!
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '64px',
            flexWrap: 'wrap',
            alignItems: 'center',
            opacity: 0.7
          }}>
            {[
              { name: 'OpenAI', icon: OpenAI, color: '#00A67E' },
              { name: 'Anthropic', icon: Anthropic, color: '#D97757' },
              { name: 'Google', icon: Google, color: '#4285F4' },
              { name: 'Meta', icon: Meta, color: '#0668E1' },
              { name: 'Mistral', icon: Mistral, color: '#F5D270' },
              { name: 'HuggingFace', icon: HuggingFace, color: '#FFD21E' }
            ].map((p, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                filter: 'grayscale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} onMouseEnter={e => {
                e.currentTarget.style.filter = 'grayscale(0)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }} onMouseLeave={e => {
                e.currentTarget.style.filter = 'grayscale(1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                {p.icon ? <p.icon size={28} /> : null}
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="section-divider" />

      {/* ── Feature Cards ─────────────────────────────────────────── */}
      <div className="feature-grid animate-fade-2" style={{ marginTop: '80px' }}>
        {features.map((feat, i) => (
          <div key={i} className="glass-card" style={{
            padding: '40px',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '100px', height: '100px',
              background: `radial-gradient(circle, ${feat.color}, transparent 80%)`,
              opacity: 0.3, zIndex: 0
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="feature-icon" style={{
                background: feat.color,
                width: '60px', height: '60px',
                borderRadius: '16px', fontSize: '28px',
                marginBottom: '24px',
                boxShadow: `0 8px 16px ${feat.color.replace('0.15', '0.1')}`
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '14px', color: 'var(--text-main)' }}>
                <SplitText text={feat.title} delay={40} duration={0.8} />
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.8' }}>{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats Banner ──────────────────────────────────────────── */}
      <div className="animate-fade-3" style={{ maxWidth: '1100px', margin: '0 auto 120px', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(91,192,235,0.08), rgba(33,193,165,0.06))',
          border: '1px solid rgba(91,192,235,0.15)',
          borderRadius: '24px',
          padding: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          textAlign: 'center',
        }}>
          {[
            { num: 99.9, suffix: "%", label: "Uptime SLA", color: '#60EFFF' },
            { num: 40, prefix: "<", suffix: "ms", label: "Avg Latency", color: '#21C1A5' },
            { num: 10, suffix: "+ Models", label: "Supported", color: '#9EFFC5' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-2px', color: s.color }}>
                {s.prefix}<CountUp to={s.num} duration={2} separator="." />{s.suffix}
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing Section ────────────────────────────────────────── */}
      <section id="pricing" className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto 120px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-2px', marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Choose the plan that fits your scale.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {[
            {
              name: "Free",
              price: "$0",
              desc: "Perfect for hobbyists and local testing.",
              features: ["1,000 Requests/day", "All Community Models", "Standard Latency", "Community Support"],
              button: "Get Started",
              highlight: false
            },
            {
              name: "Pro",
              price: "$10",
              desc: "For growing teams and production apps.",
              features: ["Unlimited Requests", "20 Requests Per Minute", "Priority Model Access", "Global Edge Network", "Email Support"],
              button: "Start Free Trial",
              highlight: true
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: "Full control for large scale organizations.",
              features: ["SLA Guarantees", "Custom Model Deployment", "Dedicated Infrastructure", "24/7 Phone Support", "White-labeling"],
              button: "Contact Sales",
              highlight: false
            }
          ].map((plan, i) => (
            <div key={i} className="glass-card" style={{
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              border: plan.highlight ? '2px solid var(--primary)' : '1px solid var(--border)',
              position: 'relative',
              background: plan.highlight ? 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-soft) 100%)' : 'var(--bg-card)',
              zIndex: plan.highlight ? 2 : 1,
              transform: plan.highlight ? 'scale(1.05)' : 'none',
              boxShadow: plan.highlight ? '0 20px 40px rgba(45, 212, 191, 0.15)' : 'var(--shadow)'
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  color: '#fff', padding: '6px 20px', borderRadius: '100px',
                  fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px'
                }}>Most Popular</div>
              )}
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
                <SplitText text={plan.name} delay={50} duration={0.8} />
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                <span style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-2px' }}>
                  {plan.price.startsWith('$') ? (
                    <>
                      $
                      <CountUp to={parseInt(plan.price.slice(1))} duration={2} />
                    </>
                  ) : (
                    <SplitText text={plan.price} delay={40} duration={1} />
                  )}
                </span>
                {plan.price !== 'Custom' && <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>/mo</span>}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px', lineHeight: '1.5' }}>{plan.desc}</p>

              <div style={{ flex: 1, marginBottom: '40px' }}>
                {plan.features.map((f, hi) => (
                  <div key={hi} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '14px', color: 'var(--text-main)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/signin" className={plan.highlight ? 'btn-primary' : 'btn-ghost'} style={{
                justifyContent: 'center',
                width: '100%',
                padding: '16px',
                fontSize: '16px'
              }}>
                {plan.button}
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '13px' }}>
          * Prices are in USD. By subscribing, you agree to our <Link href="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</Link> and <Link href="/refund" style={{ color: 'var(--primary)' }}>Refund Policy</Link>.
        </p>
      </section>

      {/* ── Background Flair ────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(45, 212, 191, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: -2,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: -2,
        pointerEvents: 'none'
      }} />
    </div>
  );
}
