import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_PATHS = ['/', '/signin', '/auth', '/docs', '/status', '/not-found']

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isPublic = PUBLIC_PATHS.some(p =>
        pathname === p || pathname.startsWith(p + '/')
    )
    const isApi = pathname.startsWith('/api/')
    const isStatic = pathname.startsWith('/_next/') || pathname.includes('.')

    if (isStatic) return NextResponse.next()

    if (isPublic || isApi) {
        return await updateSession(request)
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
