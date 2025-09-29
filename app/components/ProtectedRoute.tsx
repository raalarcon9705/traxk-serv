import { useAuth } from '~/lib/auth'
import { useServiceProvider } from '~/lib/hooks/useServiceProvider'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { Skeleton } from './ui/Skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireServiceProvider?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireServiceProvider = false 
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const { serviceProvider, loading: providerLoading } = useServiceProvider()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading || providerLoading) return

    // Si requiere autenticación y no hay usuario
    if (requireAuth && !user) {
      navigate('/auth')
      return
    }

    // Si requiere service provider y no hay perfil
    if (requireServiceProvider && user && !serviceProvider) {
      navigate('/setup')
      return
    }
  }, [user, serviceProvider, authLoading, providerLoading, navigate, requireAuth, requireServiceProvider])

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading || providerLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <Skeleton className="h-6 w-1/3 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <Skeleton className="h-6 w-1/3 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si requiere autenticación y no hay usuario, no renderizar
  if (requireAuth && !user) {
    return null
  }

  // Si requiere service provider y no hay perfil, no renderizar
  if (requireServiceProvider && user && !serviceProvider) {
    return null
  }

  return <>{children}</>
}