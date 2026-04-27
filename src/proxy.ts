import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from './lib/jwt';

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const method = req.method;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateAccessToken(token);
    if (!user) {
        return NextResponse.json({ message: 'Session expired' }, { status: 401 });
    }

    const isWriteAction = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (pathname.startsWith('/api/agents')) {
        if (isWriteAction && user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Admin access is required' }, { status: 403 });
        }
    }

    // Downstream Route Handlers read the authenticated user from these headers,
    // which keeps the API layer small and avoids repeating token parsing logic.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', user.id.toString());
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    matcher: ['/api/agents/:path*', '/api/admin/:path*', '/api/shipments/:path*'],
};
