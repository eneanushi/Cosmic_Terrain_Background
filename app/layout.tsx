import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="w-full py-6 px-4 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto flex justify-center items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Created by{' '}
              <a 
                href="https://www.eneanushi.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Enea Nushi
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}
