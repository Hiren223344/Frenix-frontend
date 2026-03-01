import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createGatewayKey } from '@/lib/gateway';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const email = session.user.email;

    // Check if cookie exists
    const cookieStore = await cookies();
    if (cookieStore.has('frenix_gateway_key')) {
        return NextResponse.json({ error: 'You already have a key.' }, { status: 409 });
    }

    const body = await req.json().catch(() => ({}));

    try {
        const result = await createGatewayKey({
            email,
            name: session.user.name?.split(' ')[0] || undefined,
            lastName: session.user.name?.split(' ').slice(1).join(' ') || undefined,
            username: (session.user as any).login || undefined,
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
        const status = err.status === 409 ? 409 : 500;
        return NextResponse.json({ error: err.message }, { status });
    }
}
