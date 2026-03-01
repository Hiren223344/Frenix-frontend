import Link from 'next/link';

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
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero animate-fade">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', borderRadius: '100px',
          background: 'rgba(91, 192, 235, 0.08)',
          color: 'var(--primary)',
          marginBottom: '44px',
          border: '1px solid rgba(91, 192, 235, 0.18)',
          fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}>
          <span style={{ fontSize: '14px' }}>✦</span>
          The Evolution of AI Orchestration
        </div>

        <h1>
          Power to build<br />
          <span style={{
            background: 'linear-gradient(100deg, #60EFFF 0%, #21C1A5 50%, #9EFFC5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            display: 'inline-block',
          }}>
            without limits
          </span>
        </h1>

        <p style={{ marginTop: '28px', marginBottom: '0' }}>
          Frenix is a high-performance, open-source AI gateway that connects
          your apps to every leading model — with one unified, secure API.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '52px', flexWrap: 'wrap' }}>
          <Link href="/signin" className="btn-primary" style={{
            fontSize: '17px', padding: '15px 44px',
            boxShadow: '0 0 48px rgba(91, 192, 235, 0.25)',
          }}>
            Get Started — Free
          </Link>
          <a href="https://github.com" className="btn-ghost" style={{ fontSize: '17px', padding: '15px 44px' }}>
            ⭐ Star on GitHub
          </a>
        </div>

        {/* Orbit glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: '55%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(91,192,235,0.06) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: -1,
        }} />
      </section>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="section-divider" />

      {/* ── Feature Cards ─────────────────────────────────────────── */}
      <div className="feature-grid animate-fade-2">
        {features.map((feat, i) => (
          <div key={i} className="glass-card" style={{ padding: '32px' }}>
            <div className="feature-icon" style={{ background: feat.color }}>
              {feat.icon}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>{feat.desc}</p>
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
            { num: "99.9%", label: "Uptime SLA" },
            { num: "<40ms", label: "Avg Latency" },
            { num: "10+ Models", label: "Supported" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-2px', color: '#fff' }}>{s.num}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
