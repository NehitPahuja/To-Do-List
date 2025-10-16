import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'TODO LIST',
  description: 'Created by Nehit',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{ variables: { colorPrimary: '#10b981', fontFamily: GeistSans.style.fontFamily } }}
      signInUrl="/login"
      signUpUrl="/sign-up"
    >
      <html lang="en">
        <head>
          <style>{`
  html {
    font-family: ${GeistSans.style.fontFamily};
    --font-sans: ${GeistSans.variable};
    --font-mono: ${GeistMono.variable};
  }
          `}</style>
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
