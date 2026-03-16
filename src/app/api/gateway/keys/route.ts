import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createGatewayKey, fetchStatsByEmail } from '@/lib/gateway';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
    let user;
    const authHeader = req.headers.get('Authorization');

    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll: () => [],
                    setAll: () => {},
                },
            }
        );
        const { data: { user: u } } = await supabase.auth.getUser(token);
        user = u;
    } else {
        const supabase = await createClient();
        const { data: { user: u } } = await supabase.auth.getUser();
        user = u;
    }

    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionUser = {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
    };

    const email = sessionUser.email;

    const cookieStore = await cookies();

    const body = await req.json().catch(() => ({}));

    try {
        // First check if the user already has a key via the backend
        try {
            const existingStats = await fetchStatsByEmail(email);
            if (existingStats && existingStats.fullKey) {
                // Key already exists, set it as cookie and return it immediately
                cookieStore.set('frenix_gateway_key', existingStats.fullKey, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 365, // 1 year
                    path: '/',
                });
                return NextResponse.json({
                    key: existingStats.fullKey,
                    tier: existingStats.tier,
                    email: existingStats.email,
                    message: "Retrieved existing key."
                }, { status: 200 });
            }
        } catch (checkErr: any) {
            // Ignore if not found, proceed to create it
        }

        const result = await createGatewayKey({
            email,
            name: sessionUser.name?.split(' ')[0] || undefined,
            lastName: sessionUser.name?.split(' ').slice(1).join(' ') || undefined,
            username: user.user_metadata?.user_name || undefined,
            ...body,
        });

        // Store the key in a secure HTTP-Only cookie so it survives server restarts
        cookieStore.set('frenix_gateway_key', result.key, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        });

        return NextResponse.json(result, { status: 201 });
    } catch (err: any) {
        const status = typeof err.status === 'number' ? err.status : 500;
        if (err.body && typeof err.body === 'object') {
            return NextResponse.json(err.body, { status });
        }
        return NextResponse.json({ error: err.message }, { status });
    }
}
