import type { Metadata, Viewport } from 'next'
import { Sora, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'aymandev | Java & Python Developer',
  description: 'Clean code. Fast delivery. Real results. Freelance backend developer specialising in bots, automation, APIs, and backend systems. Based in London, UK.',
  keywords: ['developer', 'freelance', 'Java', 'Python', 'Discord bots', 'web scraping', 'automation', 'REST API', 'backend', 'London'],
  authors: [{ name: 'aymandev' }],
  creator: 'aymandev',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://aymandev.com',
    title: 'aymandev | Java & Python Developer',
    description: 'Clean code. Fast delivery. Real results. Freelance backend developer specialising in bots, automation, APIs, and backend systems.',
    siteName: 'aymandev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'aymandev | Java & Python Developer',
    description: 'Clean code. Fast delivery. Real results. Freelance backend developer specialising in bots, automation, APIs, and backend systems.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
