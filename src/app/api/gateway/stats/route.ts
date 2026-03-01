import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchStats } from '@/lib/gateway';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cookieStore = await cookies();
    const keyCookie = cookieStore.get('frenix_gateway_key');

    if (!keyCookie?.value) {
        return NextResponse.json({ error: 'NO_KEY' }, { status: 404 });
    }

    try {
        const stats = await fetchStats(keyCookie.value);
        return NextResponse.json(stats);
    } catch (err: any) {
        // If the gateway rejects the key (e.g. revoked from DB), clear the cookie
        if (err.message.includes('HTTP 401') || err.message.includes('Invalid API key')) {
            cookieStore.delete('frenix_gateway_key');
            return NextResponse.json({ error: 'NO_KEY' }, { status: 404 });
        }
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
