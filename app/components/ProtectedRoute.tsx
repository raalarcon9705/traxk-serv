import { useAuth } from '~/lib/auth'
import { useServiceProvider } from '~/lib/hooks/useServiceProvider'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/Skeleton'
import { useLanguage } from '~/lib/hooks/useLanguage'

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
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // No hacer nada mientras se está cargando
    if (authLoading || providerLoading) return

    // Si requiere autenticación y no hay usuario
    if (requireAuth && !user) {
      setIsRedirecting(true)
      navigate('/auth')
      return
    }

    // Si requiere service provider y no hay perfil
    if (requireServiceProvider && user && !serviceProvider) {
      setIsRedirecting(true)
      navigate('/setup')
      return
    }

    // Si todo está bien, asegurar que no estamos redirigiendo
    setIsRedirecting(false)
  }, [user, serviceProvider, authLoading, providerLoading, navigate, requireAuth, requireServiceProvider])

  // Mostrar skeleton simple si se está redirigiendo
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading || providerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2 mb-6 sm:mb-8">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 rounded-lg border bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick actions skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="p-6 rounded-lg border bg-white shadow-sm">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="p-6 rounded-lg border bg-white shadow-sm">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>

            {/* Chart skeleton */}
            <div className="p-6 rounded-lg border bg-white shadow-sm mb-6 sm:mb-8">
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
            
            {/* Recent services skeleton */}
            <div className="p-6 rounded-lg border bg-white shadow-sm">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
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