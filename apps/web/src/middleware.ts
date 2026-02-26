import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/', '/tree', '/security', '/social', '/dyk', '/settings'];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/register'];

// Get environment variables with fallback for build time
function getEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      url: 'https://placeholder.supabase.co',
      key: 'placeholder-anon-key-for-build-time-only',
      isPlaceholder: true,
    };
  }

  return { url: supabaseUrl, key: supabaseAnonKey, isPlaceholder: false };
}

export async function middleware(request: NextRequest) {
  const { url, key, isPlaceholder } = getEnvVars();

  // Skip auth checks during build time with placeholder values
  if (isPlaceholder) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if trying to access auth routes while authenticated
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if trying to access protected routes without authentication
  if (!user && protectedRoutes.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  })) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};
