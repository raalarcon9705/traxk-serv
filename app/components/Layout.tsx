import { useState } from 'react'
import { Header } from './Header'
import { Navigation } from './Navigation'
import { ProgressBar } from './ui/ProgressBar'
import { ProtectedRoute } from './ProtectedRoute'
import { PWAInstallPrompt } from './PWAInstallPrompt'

interface LayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireServiceProvider?: boolean
}

export function Layout({ 
  children, 
  requireAuth = true, 
  requireServiceProvider = false 
}: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar />
      <Header onMenuToggle={toggleMenu} />
      <div className="flex">
        <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <ProtectedRoute requireAuth={requireAuth} requireServiceProvider={requireServiceProvider}>
            {children}
          </ProtectedRoute>
        </main>
      </div>
      <PWAInstallPrompt />
    </div>
  )
}