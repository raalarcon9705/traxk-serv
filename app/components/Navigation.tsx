import { Link, useLocation } from 'react-router'
import { useAuth } from '~/lib/auth'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { Button } from '~/components/ui/Button'
import {
  Home,
  Calendar,
  BarChart3,
  Users,
  LogOut,
  X,
  Settings
} from 'lucide-react'
import { clsx } from 'clsx'

interface NavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function Navigation({ isOpen, onClose }: NavigationProps) {
  const { signOut } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  const navigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: Home },
    { name: t('navigation.services'), href: '/services', icon: Calendar },
    { name: t('navigation.clients'), href: '/clients', icon: Users },
    { name: t('navigation.report'), href: '/report', icon: BarChart3 },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/20 transition-opacity duration-300 ease-in-out"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-xl transform transition-transform duration-300 ease-in-out animate-slide-in-left border-r" style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                  <Link to="/">TrackServ</Link>
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={clsx(
                        'group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200',
                        isActive ? 'nav-active' : 'nav-inactive'
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  )
                })}
                <Link
                to="/setup"
                className={clsx(
                  'group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200',
                  location.pathname === '/setup' ? 'nav-active' : 'nav-inactive'
                )}
              >
                <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                {t('navigation.settings')}
              </Link>
              </nav>
              <div className="border-t p-4" style={{ borderColor: 'hsl(var(--border))' }}>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  {t('auth.signOut')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30">
        <div className="flex flex-col flex-grow border-r pt-5 pb-4 overflow-y-auto" style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>TrackServ</h2>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive ? 'nav-active' : 'nav-inactive'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}

              <Link
                to="/setup"
                className={clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname === '/setup' ? 'nav-active' : 'nav-inactive'
                )}
              >
                <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                {t('navigation.settings')}
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4" style={{ borderColor: 'hsl(var(--border))' }}>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex-shrink-0 w-full group justify-start"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t('auth.signOut')}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}