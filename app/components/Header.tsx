import { useAuth } from '~/lib/auth'
import { useTheme } from '~/lib/hooks/useTheme'
import { Button } from '~/components/ui/Button'
import { LogOut, User, Menu, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme, isDark, isHydrated } = useTheme()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 sm:h-16">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">
            <Link to="/">TrackServ</Link>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate max-w-32">
              {user?.email}
            </span>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isHydrated && isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isHydrated && isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isHydrated && isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}