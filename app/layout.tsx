import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Kindify - AI Voice Assistant for Kindness & Communication',
  description:
    'Transform your conversations with Kindify, an AI-powered voice assistant that promotes kindness, empathy, and effective communication. Real-time voice interaction with cosmic visual feedback.',
  keywords:
    'AI voice assistant, kindness app, communication tool, voice AI, empathy assistant, cosmic interface, real-time voice, conversation helper',
  authors: [{name: 'Kindify Team'}],
  creator: 'Kindify',
  publisher: 'Kindify',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kindify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kindify - AI Voice Assistant for Kinder Communication',
    description:
      'Experience the future of kind communication with our AI voice assistant. Real-time voice interaction with beautiful cosmic visuals.',
    url: 'https://kindify.app',
    siteName: 'Kindify',
    images: [
      {
        url: 'https://kindify.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kindify AI Voice Assistant Interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kindify - AI Voice Assistant',
    description:
      'Transform conversations with AI-powered kindness. Real-time voice interaction with cosmic visual feedback.',
    images: ['https://kindify.app/twitter-image.jpg'],
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
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        {/* Additional meta tags for SEO */}
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
        <meta name='theme-color' content='#345678' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Kindify' />
        <meta name='application-name' content='Kindify' />
        <meta name='msapplication-TileColor' content='#345678' />
        <meta name='msapplication-tap-highlight' content='no' />

        {/* Structured data for better SEO */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Kindify',
              description: 'AI-powered voice assistant for kinder communication',
              url: 'https://kindify.app',
              applicationCategory: 'CommunicationApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '150',
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
