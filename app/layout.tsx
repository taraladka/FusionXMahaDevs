import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import AuthWrapper from './components/AuthWrapper'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#FF6D00',
}

export const metadata: Metadata = {
  title: 'Fusion Club CEC CGC Landran',
  description: 'Official website of Fusion Technical Club - CEC CGC Landran',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.png', sizes: '192x192' },
    ],
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen">
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </main>
      </body>
    </html>
  )
} 