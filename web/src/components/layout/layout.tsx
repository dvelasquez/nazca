import type { ReactNode } from "react"
import { Navbar } from "./navbar"

/**
 * Layout component that provides a consistent structure for all pages.
 * Uses semantic HTML and responsive design per UI/UX guidelines.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
} 