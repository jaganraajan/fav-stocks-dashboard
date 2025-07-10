import { FaGithub, FaLinkedin } from 'react-icons/fa'
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Favourite Stocks Dashboard",
  description: "Using Next.js, TypeScript, and Vercel platform to build a real-time stocks dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark:bg-gray-900">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.botpress.cloud/webchat/v2.3/inject.js" defer></script>
        <script src="https://files.bpcontent.cloud/2025/04/19/18/20250419181247-GU42H522.js" defer></script>  
      </head>
      <body className={`min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="py-6 px-4 bg-white dark:bg-gray-800 shadow-md">
              <nav className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <ul className="flex space-x-6 items-center">
                    <li>
                      <a href="https://www.linkedin.com/in/jagan-raajan/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} />
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/jaganraajan/fav-stocks-dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={24} />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">
                      Register
                    </button>
                  </Link>
                </div>
              </nav>
            </header>
            <main>
              {children}
            </main>
            <footer className="py-10 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 mt-20 border-t border-lavender-200 dark:border-gray-700">
              <p>Empowering investors with real-time data and insights. Built with ❤️ by Jagan</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
