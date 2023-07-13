import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FU Quiz',
  description: 'A quiz app for FU students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-12 text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
        <p>
          FU Quiz
        </p>
      </h1>
      {/* secondary title asking user to select a topic. make the text left align and break it into two line */}
      {children}
    </main>
        </body>
    </html>
  )
}
