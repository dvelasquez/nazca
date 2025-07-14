import { Link } from '@tanstack/react-router'
import { useState } from 'react'

/**
 * Navbar component for main navigation using shadcn/ui and Tailwind.
 * Responsive, accessible, and follows UI/UX best practices.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  function handleToggleMenu() {
    setIsOpen((open) => !open)
  }

  return (
    <nav className="sticky top-0 z-20 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60" aria-label="Main navigation">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold text-xl tracking-tight text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm" aria-label="Nazca Home">
          Nazca
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={handleToggleMenu}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-200 ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col gap-2 px-4 pb-4">
          <NavLinks onClick={() => setIsOpen(false)} />
        </div>
      </div>
    </nav>
  )
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors [&.active]:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" onClick={onClick}>
        Home
      </Link>
      <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors [&.active]:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" onClick={onClick}>
        About
      </Link>
      <Link to="/bpmn/viewer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors [&.active]:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" onClick={onClick}>
        BPMN Viewer
      </Link>
      <Link to="/bpmn/editor" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors [&.active]:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" onClick={onClick}>
        BPMN Editor
      </Link>
      <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors [&.active]:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" onClick={onClick}>
        Admin
      </Link>
    </>
  )
} 