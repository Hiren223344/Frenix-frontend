import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchLogs, fetchStatsByEmail } from '@/lib/gateway';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cookieStore = await cookies();
    const keyCookie = cookieStore.get('frenix_gateway_key');

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') ?? '100');
    const page = Number(searchParams.get('page') ?? '1');

    // Resolve the user's gateway API key (cookie first, email fallback).
    let apiKey = keyCookie?.value;
    if (!apiKey) {
        try {
            const info = await fetchStatsByEmail(userEmail);
            apiKey = info?.fullKey || info?.plainKey;
        } catch {
            apiKey = undefined;
        }
    }

    if (!apiKey) return NextResponse.json({ error: 'NO_KEY' }, { status: 404 });

    try {
        const logs = await fetchLogs(apiKey, { limit, page });
        return NextResponse.json(logs);
    } catch (err: any) {
        const msg = err.message || '';

        // Stale cookie — retry once via the email fallback.
        if (msg.includes('401') || msg.includes('Invalid API key')) {
            cookieStore.delete('frenix_gateway_key');
            try {
                const info = await fetchStatsByEmail(userEmail);
                if (info?.fullKey || info?.plainKey) {
                    const logs = await fetchLogs(info.fullKey || info.plainKey, { limit, page });
                    return NextResponse.json(logs);
                }
            } catch {
                /* fall through */
            }
        }

        return NextResponse.json({ error: msg || 'NO_KEY' }, { status: err.status || 404 });
    }
}
