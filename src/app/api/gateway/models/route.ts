import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const base = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://api.frenix.sh';
    const normalized = base.replace(/\/$/, '');
    const url = `${normalized}/v1/status/models`;
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { models: [], message: 'Model stats are currently unavailable.' },
            { status: 503 }
        );
    }
}
