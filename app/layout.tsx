import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Book Heaven - Calm Reads, Boundless Stories',
  description: 'A sunlit place to discover, read and listen. Gentle UI, big type, and audio that starts right where you want.',
  keywords: 'books, reading, PDF, audio, TTS, library, accessible',
  authors: [{ name: 'Book Heaven Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
