'use client';

import { useState, useEffect } from 'react';
import { Shield, ArrowRight, Zap, List, Plus } from 'lucide-react';

export default function OAuthTestPage() {
  const isMaintenance = true;

  if (isMaintenance) {
    return <div className="h-screen bg-black flex items-center justify-center text-white/30 font-black uppercase tracking-widest italic">OAuth Testing Node // Maintenance Mode</div>
  }
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    try {
      const res = await fetch('/api/oauth/apps');
      const data = await res.json();
      if (res.ok) {
        setApps(data);
      } else {
        setError(data.error || 'Failed to fetch apps');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  async function createTestApp() {
    setLoading(true);
    try {
      const res = await fetch('/api/oauth/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'OAuth Tester ' + Math.floor(Math.random() * 1000),
          redirect_uris: [window.location.origin + '/test-oauth/callback'],
          logo_url: '/logo-withoutbg.png'
        })
      });
      if (res.ok) {
        fetchApps();
      } else {
        const data = await res.json();
        alert(data.error || 'Creation failed');
      }
    } catch (err) {
      alert('Error creating app');
    } finally {
      setLoading(false);
    }
  }

  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const base64url = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return base64url;
  };

  async function handleSignIn(clientId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmglmcvceitpcvrlpjhp.supabase.co';
    const redirectUri = window.location.origin + '/test-oauth/callback';
    const state = Math.random().toString(36).substring(7);

    // PKCE Setup
    const codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem('oauth_verifier', codeVerifier);

    // Construct the Supabase OAuth Authorize URL
    const authUrl = `${supabaseUrl}/auth/v1/oauth/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid+email+profile&` +
      `state=${state}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`;

    window.location.href = authUrl;
  }

  return (
    <div className="min-h-screen bg-black text-white p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-black italic tracking-tighter">OAuth <span className="text-primary">Stresstest</span></h1>
            <p className="text-gray-500 font-medium">Verify your Supabase OAuth Server integration with PKCE enabled.</p>
          </div>
          <button
            onClick={createTestApp}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all"
          >
            <Plus size={16} />
            Create Test App
          </button>
        </div>

        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 font-bold">
            {error}
          </div>
        )}

        {/* App List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map((app) => (
            <div key={app.client_id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center overflow-hidden">
                  {app.logo_url ? <img src={app.logo_url} className="w-full h-full object-cover" /> : <Shield size={24} className="text-gray-700" />}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-1">Client ID</div>
                  <code className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">{app.client_id.substring(0, 12)}...</code>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-2xl font-black">{app.name}</h3>
                <p className="text-gray-500 text-sm font-medium">Click below to start the authorize handshake.</p>
              </div>

              <button
                onClick={() => handleSignIn(app.client_id)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest group-hover:bg-primary group-hover:text-black group-hover:border-transparent transition-all"
              >
                Sign in with Frenix
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}

          {!loading && apps.length === 0 && (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[48px]">
              <Zap size={48} className="mx-auto text-gray-800 mb-4" />
              <p className="text-gray-600 font-bold text-xl tracking-tight">No OAuth apps registered yet.</p>
              <p className="text-gray-700 font-medium">Create a test app to begin debugging.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="pt-12 border-t border-white/5 flex items-center justify-between opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">
          <span>OAuth Testing Node v1.1</span>
          <div className="flex items-center gap-4">
            <span>Status: PKCE ACTIVE</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  );
}
