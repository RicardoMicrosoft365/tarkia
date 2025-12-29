import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // Ignorar arquivos estáticos do Next.js e API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/static')
    ) {
      return NextResponse.next()
    }

    // Verificar se é uma rota administrativa
    if (pathname.startsWith('/admin')) {
      // Permitir acesso à página de login
      if (pathname === '/admin/login') {
        return NextResponse.next()
      }

      // Para outras rotas admin, verificar autenticação
      const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true'
      
      if (!isAuthenticated) {
        // Redirecionar para login se não autenticado
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Erro no middleware:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
