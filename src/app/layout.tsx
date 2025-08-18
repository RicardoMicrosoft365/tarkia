import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Calculadora Tarkia | Otimização Fiscal e Investimentos UAE',
  description: 'Calculadora profissional para análise fiscal empresarial, investimentos imobiliários e planejamento de mudança para os Emirados Árabes Unidos. Compare impostos entre Brasil, Portugal e UAE.',
  keywords: 'calculadora fiscal, UAE, Dubai, Abu Dhabi, impostos, free zone, investimento imobiliário, Brasil, Portugal',
  authors: [{ name: 'Tarkia Consultoria', url: 'https://tarkia.ae' }],
  creator: 'Tarkia Consultoria',
  publisher: 'Tarkia Consultoria',
  openGraph: {
    title: 'Calculadora Tarkia | Otimização Fiscal UAE',
    description: 'Descubra quanto você pode economizar em impostos e ganhar com investimentos nos Emirados Árabes Unidos',
    url: 'https://calculadora.tarkia.ae',
    siteName: 'Tarkia Calculadora',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculadora Tarkia - Otimização Fiscal UAE',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora Tarkia | Otimização Fiscal UAE',
    description: 'Descubra quanto você pode economizar em impostos nos UAE',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#c8a46e" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <main className="relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
} 