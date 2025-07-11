import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "./stack";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import NavBarWrapper from "@/components/NavBarWrapper";

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
      <body className={`min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}><StackProvider app={stackServerApp}><StackTheme>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="py-6 px-4 bg-white dark:bg-gray-800 shadow-md">
              <NavBarWrapper />
            </header>
            <main>
              {children}
            </main>
            <footer className="py-10 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 mt-20 border-t border-lavender-200 dark:border-gray-700">
              <p>Empowering investors with real-time data and insights. Built with ❤️ by Jagan</p>
            </footer>
          </div>
        </Providers>
      </StackTheme></StackProvider></body>
    </html>
  )
}
