import { useEffect } from 'react'
import { useAuth } from '~/lib/auth'
import { useServiceProvider } from '~/lib/hooks/useServiceProvider'
import { useNavigate } from 'react-router'
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrackServ - Gestión de Comisiones" },
    { name: "description", content: "Aplicación para gestión de comisiones de proveedores de servicios" },
  ];
}

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { serviceProvider, loading: providerLoading } = useServiceProvider()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading || providerLoading) return

    if (!user) {
      navigate('/auth')
    } else if (!serviceProvider) {
      navigate('/setup')
    } else {
      navigate('/dashboard')
    }
  }, [user, serviceProvider, authLoading, providerLoading, navigate])

  if (authLoading || providerLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-8 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
              <div className="h-4 rounded w-1/2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
            </div>
            
            {/* Stats cards skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="h-4 rounded w-1/2 mb-2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                  <div className="h-6 rounded w-3/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                </div>
              ))}
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <div className="h-6 rounded w-1/3 mb-4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                <div className="space-y-3">
                  <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                  <div className="h-4 rounded w-2/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                </div>
              </div>
              <div className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <div className="h-6 rounded w-1/3 mb-4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                <div className="space-y-3">
                  <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                  <div className="h-4 rounded w-2/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
