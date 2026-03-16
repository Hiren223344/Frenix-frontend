import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);
    
    const clientId = params.get('client_id');
    const clientSecret = params.get('client_secret');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'apikey': anonKey!,
    };

    if (clientId && clientSecret) {
      const basicAuth = btoa(`${clientId}:${clientSecret}`);
      headers['Authorization'] = `Basic ${basicAuth}`;
      // Remove from body to avoid ambiguity
      params.delete('client_id');
      params.delete('client_secret');
    } else {
      headers['Authorization'] = request.headers.get('Authorization') || '';
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/oauth/token`, {
      method: 'POST',
      headers,
      body: params.toString(),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
