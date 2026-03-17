import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Shield, Lock, ArrowRight, User as UserIcon, Check, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ authorization_id?: string }>
}) {
  const params = await searchParams;
  const authorizationId = params.authorization_id;

  if (!authorizationId) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-sm opacity-30">Invalid context.</div>
      </div>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?redirect=/oauth/consent?authorization_id=${authorizationId}`);
  }

  let authDetails = null;
  let error = null;

  if (authorizationId === 'test' || authorizationId === 'preview' || authorizationId === 'test_preview_only') {
    authDetails = {
      client: {
        name: 'Frenix Alpha',
        logo_url: null,
        website_url: 'https://frenix.io'
      },
      scope: 'openid email profile phone'
    };
  } else {
    const response = await (supabase.auth as any).oauth.getAuthorizationDetails(authorizationId);
    authDetails = response.data;
    error = response.error;
    console.log('[Consent] Auth Details from Supabase:', authDetails);

    // If Supabase already determined the result (e.g. skip consent if previously authorized)
    // we should redirect immediately instead of showing the UI.
    if (authDetails?.redirect_url) {
      console.log('[Consent] Auto-redirecting to:', authDetails.redirect_url);
      redirect(authDetails.redirect_url);
    }
  }

  if (error || !authDetails) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-xs text-red-500/30">Session error.</div>
      </div>
    );
  }

  const userMeta = user.user_metadata || {};
  const fullName = userMeta.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = userMeta.avatar_url;

  return (
    <div className="h-screen w-screen bg-black text-white font-sans selection:bg-primary/20 flex flex-col items-center justify-center overflow-hidden p-8">

      {/* Absolute Minimal layer */}
      <div className="absolute inset-0 bg-[#000]" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.02]" />

      {/* Main Refined Container */}
      <div className="relative z-10 w-full max-w-[484px] flex flex-col items-center">

        {/* Understated Logo Handshake */}
        <div className="flex items-center gap-6 mt-12 mb-12">
          <div className="w-16 h-16 rounded-[20px] bg-white flex items-center justify-center p-3.5 shadow-sm border border-black/5">
            <img src="/logo-withoutbg.png" alt="F" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-2 opacity-10">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="w-16 h-16 rounded-[20px] bg-[#080808] border border-white/5 flex items-center justify-center overflow-hidden shadow-sm">
            {authDetails?.client?.logo_url ? (
              <img src={authDetails.client.logo_url} alt={authDetails.client.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={24} className="text-white/20" />
            )}
          </div>
        </div>

        {/* Minimal Sophisticated Header - Slightly Larger */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2.5">
            Authorize {authDetails?.client?.name || 'Connected Application'}
          </h1>
          <p className="text-base text-white/30 font-medium">Connecting your Gateway identity.</p>
        </div>

        {/* Card: High-End Minimalist Block (+10%) */}
        <div className="w-full bg-[#050505] border border-white/5 rounded-[40px] p-10 space-y-10 shadow-sm">

          {/* User context - Clean & Classy */}
          <div className="flex items-center gap-5 pb-7 border-b border-white/[0.04]">
            <div className="w-14 h-14 rounded-[16px] overflow-hidden bg-white/[0.03] border border-white/5 p-0.5">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-[12px]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10">
                  <UserIcon size={20} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white leading-none mb-1.5">{fullName}</h2>
              <p className="text-sm text-white/20 font-medium truncate italic">{user.email}</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <BadgeCheck size={13} className="text-primary/60" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Verified</span>
            </div>
          </div>

          {/* Scopes - Sophisticated list */}
          <div className="space-y-5">
            <div className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] mb-2.5">Authority Context:</div>
            <div className="space-y-4">
              {[
                'Public Cloud Identity Profile',
                'Validated Email Access',
                'Active Service Metadata'
              ].map((scope, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  <span className="text-base font-medium text-white/50 group-hover:text-white/80 transition-colors tracking-tight">{scope}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions - Clean monochromatic priority */}
          <div className="pt-6 space-y-5">
            <form action="/api/oauth/decision" method="POST" className="flex flex-col gap-4">
              <input type="hidden" name="authorization_id" value={authorizationId} />

              <button
                type="submit"
                name="decision"
                value="approve"
                className="w-full h-16 rounded-[22px] bg-white text-black font-bold text-base hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-inner"
              >
                Authorize Access
                <ArrowRight size={18} />
              </button>

              <button
                type="submit"
                name="decision"
                value="deny"
                className="w-full h-14 rounded-[20px] border border-white/[0.04] text-white/20 font-bold text-[11px] uppercase tracking-[0.3em] hover:text-white/60 hover:bg-white/[0.02] transition-colors"
              >
                Decline
              </button>
            </form>

            <div className="text-center pt-5 opacity-20 hover:opacity-100 transition-opacity">
              <Link href="/signin?switch=true" className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">
                Switch Session
              </Link>
            </div>
          </div>
        </div>

        {/* Global Footer Meta */}
        <div className="mt-12 flex items-center gap-5 opacity-5 pointer-events-none">
          <span className="text-[11px] font-bold uppercase tracking-[0.6em]">Frenix Secure Node</span>
        </div>
      </div>
    </div>
  );
}
