'use client'

import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ChevronRight, ExternalLink, Zap, Shield, Key, Globe, Image, Mic, Brain, AlertTriangle, Layers, Terminal, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://api.frenix.sh';
const DASHBOARD = GATEWAY.replace('api.', 'www.');

function CopyBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: '16px' }}>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          toast.success('Copied');
          setTimeout(() => setCopied(false), 2000);
        }}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: copied ? '#22c55e' : 'var(--text-muted)', padding: '4px',
          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px',
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <pre style={{
        background: '#18181b', color: '#a1a1aa', padding: '18px 20px',
        borderRadius: '10px', fontSize: '13px', lineHeight: '1.7',
        overflowX: 'auto', border: '1px solid #27272a',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}>
        {code}
      </pre>
    </div>
  );
}

function Badge({ children, color = 'green' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    green: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
    blue: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
    yellow: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
    red: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
  };
  const c = colors[color] || colors.green;
  return (
    <span style={{
      fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px',
      background: c.bg, color: c.text,
    }}>{children}</span>
  );
}

function Method({ method }: { method: string }) {
  const color = method === 'GET' ? '#22c55e' : method === 'POST' ? '#3b82f6' : '#f59e0b';
  return (
    <span style={{
      fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
      background: `${color}15`, color,
      fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em',
    }}>{method}</span>
  );
}

const sections = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'auth', label: 'Authentication', icon: Key },
  { id: 'oauth', label: 'OAuth & Connect', icon: User },
  { id: 'chat', label: 'Chat Completions', icon: Zap },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'videos', label: 'Videos', icon: Image },
  { id: 'audio', label: 'Audio', icon: Mic },
  { id: 'embeddings', label: 'Embeddings', icon: Brain },
  { id: 'moderations', label: 'Moderations', icon: Shield },
  { id: 'models', label: 'Models', icon: Layers },
  { id: 'claude-code', label: 'Claude Code', icon: Terminal },
  { id: 'tiers', label: 'Tiers & Limits', icon: AlertTriangle },
  { id: 'errors', label: 'Errors', icon: AlertTriangle },
];

export default function DocsPage() {
  const [active, setActive] = useState('overview');
  const manualClick = useRef(false);

  useEffect(() => {
    const ids = sections.map(s => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        if (manualClick.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setActive(id);
    manualClick.current = true;
    setTimeout(() => { manualClick.current = false; }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
      <div className="flex flex-col lg:grid lg:grid-cols-[240px,1fr] gap-12 lg:gap-20">
        {/* Sidebar */}
        <aside className="lg:block w-full mb-8 lg:mb-0">
          <nav className="lg:sticky lg:top-28 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-8">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-6 px-3">
              API Reference
            </div>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-1 no-scrollbar">
              {sections.map(s => {
                const Icon = s.icon;
                const isActive = active === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => handleNavClick(s.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap lg:whitespace-normal",
                      isActive
                        ? "bg-white/10 text-foreground shadow-sm shadow-white/5 scale-[1.02]"
                        : "text-foreground/40 hover:text-foreground hover:bg-white/[0.03]"
                    )}
                  >
                    <Icon size={16} className={cn("transition-all duration-300", isActive ? "opacity-100 text-primary-important" : "opacity-30 group-hover:opacity-60")} />
                    {s.label}
                  </a>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 space-y-24 pb-20">
          {/* Header */}
          <header className="space-y-6 pb-12 border-b border-white/5">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 bg-primary/10 w-fit px-3 py-1 rounded-md">
                DEVELOPER PORTAL
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground">
                Documentation
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg max-w-2xl leading-relaxed">
                The Frenix API is OpenAI-compatible. Point any existing client at our base URL and authenticate with your master key.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Base URL</span>
              <code className="text-xs md:text-sm font-bold text-primary tracking-tight font-mono">
                {GATEWAY}/v1
              </code>
            </div>
          </header>

          {/* Sections */}
          {/* ── Overview ─────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="overview" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Overview</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground text-sm md:text-base leading-relaxed space-y-4">
              <p>
                Frenix is a unified AI gateway that routes requests across multiple providers — OpenAI, Anthropic, Google, and more — through a single endpoint. It handles failover, model mapping, usage tracking, and cost calculation automatically.
              </p>
              <p>
                The API follows the OpenAI specification. Any SDK or HTTP client that works with OpenAI will work with Frenix — just change the base URL and use your Frenix API key.
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40 italic">Quick start</h3>
              <CopyBlock lang="bash" code={`curl ${GATEWAY}/v1/chat/completions \\
    -H "Authorization: Bearer sk-frenix-YOUR_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
      "model": "gpt-4o",
      "messages": [{"role": "user", "content": "Hello"}]
    }'`} />
            </div>
          </motion.section>

          {/* ── Authentication ──────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="auth" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Authentication</h2>
            <p className="text-muted-foreground/80 text-sm md:text-base leading-relaxed">
              All API requests require an API key. Pass it via the <code className="px-1.5 py-0.5 rounded bg-white/5 text-foreground font-bold text-xs font-mono">Authorization</code> header or the <code className="px-1.5 py-0.5 rounded bg-white/5 text-foreground font-bold text-xs font-mono">x-api-key</code> header.
            </p>

            <CopyBlock code={`# Option 1: Bearer token
Authorization: Bearer sk-frenix-YOUR_KEY

# Option 2: x-api-key header
x-api-key: sk-frenix-YOUR_KEY`} />

            <p className="text-muted-foreground/60 text-sm leading-relaxed opacity-80">
              Keys are generated on the <a href="/api-keys" className="text-foreground font-bold underline decoration-white/20 underline-offset-4 hover:decoration-white/50 transition-all">API Keys</a> dashboard. Keys follow the format <code className="text-foreground/80 font-mono">sk-frenix-*</code>.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="oauth" className="scroll-mt-32 space-y-12">

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Sign In with Frenix</h2>
              <p className="text-muted-foreground/80 text-sm md:text-lg leading-relaxed max-w-2xl">
                The Frenix Connect protocol allows any application to authenticate users and access their Frenix identities securely. Use our OAuth 2.1 implementation to build seamless integrations.
              </p>
            </div>

            {/* --- Integration Steps --- */}
            <div className="space-y-16">

              {/* Step 1: Authorization */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs">1</div>
                  <h3 className="text-xl font-bold text-foreground">Initiate Authorization</h3>
                </div>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed pl-12">
                  Construct a URL to redirect the user to. This will trigger the Frenix consent screen where the user can approve your application.
                </p>

                <div className="pl-12 space-y-4">
                  <div className="flex items-center gap-3">
                    <Method method="GET" />
                    <code className="text-xs md:text-sm font-bold text-foreground/60 font-mono">/oauth/authorize</code>
                  </div>
                  <CopyBlock lang="text" code={`${DASHBOARD}/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  response_type=code&
  redirect_uri=YOUR_CALLBACK_URL&
  scope=openid+email+profile&
  state=RANDOM_STATE&
  code_challenge=S256_CHALLENGE&
  code_challenge_method=S256`} />

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mt-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground/40 mb-3">Implementation Tip: PKCE</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We strictly enforce <strong>Proof Key for Code Exchange (PKCE)</strong>. You must generate a random high-entropy <code className="text-primary italic">code_verifier</code> and its SHA256 <code className="text-primary italic">code_challenge</code> on every login attempt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Token Exchange */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs">2</div>
                  <h3 className="text-xl font-bold text-foreground">Exchange Code for Tokens</h3>
                </div>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed pl-12">
                  Once the user approves, they'll be redirected back to your <code className="px-1.5 py-0.5 rounded bg-white/5 text-foreground font-mono">redirect_uri</code> with a <code className="text-primary">code</code>. Use this code to perform a server-to-server POST request to retrieve the access token.
                </p>

                <div className="pl-12 space-y-4">
                  <div className="flex items-center gap-3">
                    <Method method="POST" />
                    <code className="text-xs md:text-sm font-bold text-foreground/60 font-mono">/api/oauth/token</code>
                  </div>

                  <CopyBlock lang="javascript" code={`// Node.js Example using axios
const authHeader = Buffer.from(\`\${CLIENT_ID}:\${CLIENT_SECRET}\`).toString('base64');

const response = await axios.post('${DASHBOARD}/api/oauth/token', 
  new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCodeFromRedirect,
    redirect_uri: YOUR_REDIRECT_URI,
    code_verifier: YOUR_PKCE_VERIFIER
  }), 
  {
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': \`Basic \${authHeader}\`
    }
  }
);

const { access_token, refresh_token } = response.data;`} />
                </div>
              </div>

              {/* Step 3: Fetching Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs">3</div>
                  <h3 className="text-xl font-bold text-foreground">Access User Profile</h3>
                </div>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed pl-12">
                  Finally, use the <code className="text-primary italic">access_token</code> to fetch the user's Frenix profile.
                </p>

                <div className="pl-12 space-y-4">
                  <div className="flex items-center gap-3">
                    <Method method="GET" />
                    <code className="text-xs md:text-sm font-bold text-foreground/60 font-mono">/api/oauth/user</code>
                  </div>

                  <CopyBlock lang="bash" code={`# Using curl
curl ${DASHBOARD}/api/oauth/user \\
  -H "Authorization: Bearer \${ACCESS_TOKEN}"`} />

                  <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                    <div className="bg-white/5 px-4 py-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Expected Response</div>
                    <pre className="p-4 text-[12px] text-primary/80 font-mono">
                      {`{
  "id": "user_id_uuid",
  "email": "user@example.com",
  "user_metadata": {
    "full_name": "John Doe",
    "avatar_url": "https://..."
  },
  "app_metadata": {
    "provider": "google"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Design Your Core --- */}
            <div className="pt-12 border-t border-white/5">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40 italic mb-8 text-center">Standard UI Component</h3>

              <div className="grid md:grid-cols-2 gap-8 items-center bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12">
                <div className="space-y-6">
                  <h4 className="text-2xl font-black tracking-tight text-foreground">Sign In Button</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Maintain a premium feel by using our official black-on-white high contrast aesthetics.
                  </p>

                  {/* Visual Example */}
                  <div className="pt-4">
                    <button className="px-8 py-4 bg-white text-black rounded-2xl font-black text-sm tracking-tight flex items-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                      <Globe size={18} fill="black" />
                      Sign In with Frenix
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-2">CSS Snippet</div>
                  <CopyBlock lang="css" code={`.frenix-btn {
  background: #ffffff;
  color: #000000;
  font-weight: 900;
  border-radius: 12px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.frenix-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255,255,255,0.1);
}`} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── Chat Completions ────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="chat" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Chat Completions</h2>
            <div className="flex items-center gap-3">
              <Method method="POST" />
              <code className="text-xs md:text-sm font-bold text-foreground/60 font-mono">/v1/chat/completions</code>
            </div>
            <p className="text-muted-foreground/80 text-sm md:text-base leading-relaxed">
              Fully compatible with the OpenAI Chat Completions API. Supports streaming via <code className="px-1.5 py-0.5 rounded bg-white/5 text-foreground font-bold text-xs font-mono">stream: true</code>.
            </p>

            <CopyBlock code={`curl ${GATEWAY}/v1/chat/completions \\
    -H "Authorization: Bearer sk-frenix-YOUR_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
      "model": "gpt-4o",
      "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in one sentence."}
      ],
      "temperature": 0.7,
      "max_tokens": 256,
      "stream": false
    }'`} />
          </motion.section>

          {/* ── Images ──────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="images" className="scroll-mt-32 space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Images</h2>
            <div className="grid gap-8">
              {[
                {
                  path: '/v1/images/generations', desc: 'Generate images from a text prompt.', body: `{
  "model": "dall-e-3",
  "prompt": "A sunset over mountains",
  "size": "1024x1024",
  "n": 1
}` },
                { path: '/v1/images/edits', desc: 'Edit an image using a prompt and mask. Multipart form data.' },
                { path: '/v1/images/variations', desc: 'Generate variations of an existing image. Multipart form data.' },
              ].map((ep, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Method method="POST" />
                    <code className="text-xs md:text-sm font-bold text-foreground/60 font-mono">{ep.path}</code>
                    {(ep.path.includes('edit') || ep.path.includes('variation')) && <Badge color="yellow">Multipart</Badge>}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{ep.desc}</p>
                  {ep.body && <CopyBlock code={ep.body} />}
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Video Generation ────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="videos" className="scroll-mt-32 space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Video Generation</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Method method="POST" />
                <code className="text-xs md:text-sm font-bold text-foreground/60 font-mono">/v1/videos/generations</code>
                <Badge color="blue">Veo 3.1</Badge>
              </div>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Generate AI-powered videos from text prompts. Powered by Veo 3.1 engine. Returns a direct URL to the generated MP4 video file.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40 italic">Request Body</h3>
              <CopyBlock code={`{
  "model": "veo-3.1",
  "prompt": "A cinematic drone shot flying over a futuristic city at sunset",
  "aspect_ratio": "16:9",
  "duration": 5,
  "quality": "540p",
  "n": 1
}`} />
            </div>

            <div className="overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Parameter</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Type</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Default</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ['model', 'string', 'veo-3.1', 'Video model to use. Supports veo-3.1, wan, and other video models.'],
                      ['prompt', 'string', '—', 'Required. Text description of the video to generate.'],
                      ['aspect_ratio', 'string', '"16:9"', 'Video aspect ratio. Options: "16:9", "9:16", "1:1".'],
                      ['duration', 'number', '5', 'Video duration in seconds (3–10).'],
                      ['quality', 'string', '"540p"', 'Video quality. Options: "540p", "720p", "1080p".'],
                      ['n', 'number', '1', 'Number of videos to generate.'],
                    ].map(([param, type, def, desc]) => (
                      <tr key={param} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-foreground font-mono">{param}</td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{type}</td>
                        <td className="px-6 py-4 text-xs font-medium text-primary/80 font-mono">{def}</td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40 italic">cURL Example</h3>
              <CopyBlock lang="bash" code={`curl ${GATEWAY}/v1/videos/generations \\
    -H "Authorization: Bearer sk-frenix-YOUR_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
      "model": "veo-3.1",
      "prompt": "A cinematic drone shot flying over a futuristic city at sunset",
      "aspect_ratio": "16:9",
      "duration": 5,
      "quality": "540p"
    }'`} />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40 italic">Python Example</h3>
              <CopyBlock lang="python" code={`import openai

client = openai.OpenAI(
    base_url="${GATEWAY}/v1",
    api_key="sk-frenix-YOUR_KEY"
)

response = client.post(
    "/videos/generations",
    body={
        "model": "veo-3.1",
        "prompt": "A timelapse of a flower blooming in a garden",
        "aspect_ratio": "16:9",
        "duration": 5,
        "quality": "720p"
    },
    cast_to=dict
)

video_url = response["data"][0]["url"]
print(f"Video: {video_url}")`} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40">
              <div className="bg-white/5 px-4 py-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Response</div>
              <pre className="p-4 text-[12px] text-primary/80 font-mono">
                {`{
  "created": 1710000000,
  "data": [
    {
      "url": "https://cdn.veo31ai.io/explore/<task_id>.mp4",
      "model": "veo-3.1"
    }
  ]
}`}
              </pre>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground/40 mb-3">Important Notes</h4>
              <ul className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <li>• Video generation is asynchronous. The API will wait up to <strong>60 seconds</strong> for the video to be ready before returning.</li>
                <li>• The returned URL is a direct link to the MP4 file hosted on CDN.</li>
                <li>• Video generation costs are tracked and billed based on the model, duration, and quality.</li>
                <li>• Supported models include: <code className="text-primary/80 font-mono">veo-3.1</code>, <code className="text-primary/80 font-mono">wan</code>, and other video-capable models.</li>
              </ul>
            </div>
          </motion.section>

          {/* ── Audio ────────��──────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="audio" className="scroll-mt-32 space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Audio</h2>
            <div className="grid gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Method method="POST" />
                  <code className="text-sm font-bold text-foreground/60 font-mono">/v1/audio/speech</code>
                  <Badge color="blue">Provider-3</Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Convert text to speech. Powered by <strong>OpenAI.fm</strong> (Provider-3). Returns audio binary.
                </p>
                <CopyBlock code={`{
  "model": "tts-1",
  "input": "Hello, welcome to Frenix.",
  "voice": "alloy"
}`} />
                <p className="text-xs text-muted-foreground/60 italic">Supported models: tts-1, tts-1-hd</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Method method="POST" />
                  <code className="text-sm font-bold text-foreground/60 font-mono">/v1/audio/transcriptions</code>
                  <Badge color="yellow">Provider-4</Badge>
                  <Badge color="yellow">Multipart</Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Transcribe audio to text. Powered by <strong>Pollinations.ai</strong> (Provider-4). Upload audio file as multipart form data.
                </p>
                <p className="text-xs text-muted-foreground/60 italic">Supported models: whisper-1</p>
              </div>
            </div>
          </motion.section>

          {/* ── Embeddings ─────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="embeddings" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Embeddings</h2>
            <div className="flex items-center gap-3">
              <Method method="POST" />
              <code className="text-sm font-bold text-foreground/60 font-mono">/v1/embeddings</code>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">Generate vector embeddings for text input.</p>
            <CopyBlock code={`{
  "model": "text-embedding-3-small",
  "input": "The food was delicious and the waiter..."
}`} />
          </motion.section>

          {/* ── Moderations ────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="moderations" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Moderations</h2>
            <div className="flex items-center gap-3">
              <Method method="POST" />
              <code className="text-sm font-bold text-foreground/60 font-mono">/v1/moderations</code>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">Check text for policy violations.</p>
            <CopyBlock code={`{
  "input": "Some text to check for policy compliance."
}`} />
          </motion.section>

          {/* ── Models ─────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="models" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Models</h2>
            <div className="flex items-center gap-3">
              <Method method="GET" />
              <code className="text-sm font-bold text-foreground/60 font-mono">/v1/models</code>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">Returns the list of all available models for your tier.</p>
            <CopyBlock code={`curl ${GATEWAY}/v1/models \\
    -H "Authorization: Bearer sk-frenix-YOUR_KEY"`} />
          </motion.section>

          {/* ── Claude Code ──────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="claude-code" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Claude Code Integration</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground text-sm md:text-base leading-relaxed space-y-4">
              <p>
                Frenix supports <strong>Claude Code</strong>, Anthropic's command-line tool. You can route Claude Code through Frenix to use your available credits and models.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40 italic">PowerShell (Windows)</h3>
                <CopyBlock lang="powershell" code={`# 1. Set the Model and URL
$env:ANTHROPIC_MODEL = "claude-3-5-sonnet-20241022"
$env:ANTHROPIC_BASE_URL = "${GATEWAY}"

# 2. Set your Frenix API Key
$env:ANTHROPIC_API_KEY = "sk-frenix-YOUR_KEY"

# 3. Launch
claude`} />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40 italic">Bash (macOS / Linux)</h3>
                <CopyBlock lang="bash" code={`# 1. Set the Model and URL
export ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"
export ANTHROPIC_BASE_URL="${GATEWAY}"

# 2. Set your Frenix API Key
export ANTHROPIC_API_KEY="sk-frenix-YOUR_KEY"

# 3. Launch
claude`} />
              </div>
            </div>
          </motion.section>

          {/* ── Tiers & Limits ─────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="tiers" className="scroll-mt-32 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Tiers & Rate Limits</h2>
            <div className="overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Feature</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Free</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Pro</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary/80">EvolveX</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ['Rate limit', '10 req/min', '20 req/min', 'Unlimited'],
                      ['Models', 'Community', 'All models', 'All models'],
                      ['Pro models', 'No', 'Yes', 'Yes'],
                      ['Providers', 'Secondary', 'Primary + Secondary', 'All Providers'],
                      ['Streaming', 'Yes', 'Yes', 'Yes'],
                      ['Cost tracking', 'Yes', 'Yes', 'Yes'],
                    ].map(([feature, free, pro, evolvex], i) => (
                      <tr key={feature} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-foreground">{feature}</td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{free}</td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{pro}</td>
                        <td className="px-6 py-4 text-xs font-black text-primary/90">{evolvex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* ── Errors ──────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="errors" className="scroll-mt-32 space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Errors</h2>
            <div className="overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Code</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ['400', 'Bad Request — invalid or missing parameters'],
                      ['401', 'Unauthorized — missing or invalid API key'],
                      ['403', 'Forbidden — your tier cannot access this model'],
                      ['404', 'Not Found — no key exists for this account'],
                      ['429', 'Rate Limited — exceeded tier-specific limits'],
                      ['500', 'Internal Server Error — system failure'],
                      ['502', 'Bad Gateway — upstream provider error'],
                    ].map(([code, desc], i) => (
                      <tr key={code} className="hover:bg-white/[0.01] transition-colors">
                        <td className={cn(
                          "px-6 py-4 text-xs font-black font-mono",
                          parseInt(code) >= 500 ? "text-rose-500" : "text-amber-500"
                        )}>{code}</td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* ── All Endpoints ──────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            id="all-endpoints" className="scroll-mt-32 space-y-8 pb-32">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">All Endpoints</h2>
            <div className="overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Method</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Path</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Auth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ['GET', '/v1/keys/stats', 'Yes'],
                      ['POST', '/v1/chat/completions', 'Yes'],
                      ['POST', '/v1/messages', 'Yes'],
                      ['POST', '/v1/responses', 'Yes'],
                      ['POST', '/v1/images/generations', 'Yes'],
                      ['POST', '/v1/images/edits', 'Yes'],
                      ['POST', '/v1/images/variations', 'Yes'],
                      ['POST', '/v1/videos/generations', 'Yes'],
                      ['POST', '/v1/audio/speech', 'Yes'],
                      ['POST', '/v1/audio/transcriptions', 'Yes'],
                      ['POST', '/v1/audio/translations', 'Yes'],
                      ['POST', '/v1/embeddings', 'Yes'],
                      ['POST', '/v1/moderations', 'Yes'],
                      ['GET', '/v1/models', 'Yes'],
                      ['GET', '/v1/status', 'No'],
                    ].map(([method, path, auth], i) => (
                      <tr key={path} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4"><Method method={method} /></td>
                        <td className="px-6 py-4 text-xs font-bold font-mono text-foreground/60">{path}</td>
                        <td className={cn(
                          "px-6 py-4 text-[10px] font-black uppercase tracking-widest",
                          auth === 'Yes' ? "text-muted-foreground/40" : "text-emerald-500"
                        )}>{auth === 'Yes' ? 'Required' : 'Public'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
