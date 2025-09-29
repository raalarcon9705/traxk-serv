import React, { useState } from 'react'
import { useAuth } from '~/lib/auth'
import { useServiceProvider } from '~/lib/hooks/useServiceProvider'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Layout } from '~/components/Layout'
import { useNavigate } from 'react-router'
import type { Route } from "./+types/setup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Configuración - TrackServ" },
    { name: "description", content: "Configura tu perfil de proveedor de servicios. Establece tu nombre comercial y tasa de comisión para comenzar a gestionar tus servicios." },
    { name: "keywords", content: "configuración, perfil, proveedor, servicios, comisiones, TrackServ, setup" },
    { property: "og:title", content: "Configuración - TrackServ" },
    { property: "og:description", content: "Configura tu perfil de proveedor de servicios" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Configuración - TrackServ" },
    { name: "twitter:description", content: "Configura tu perfil de proveedor de servicios" }
  ];
}

export default function Setup() {
  const [businessName, setBusinessName] = useState('')
  const [commissionRate, setCommissionRate] = useState('15')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const { serviceProvider, createServiceProvider, updateServiceProvider } = useServiceProvider()
  const navigate = useNavigate()

  // Si ya existe un service provider, cargar los datos existentes
  React.useEffect(() => {
    if (serviceProvider) {
      setBusinessName(serviceProvider.business_name || '')
      setCommissionRate(serviceProvider.commission_rate?.toString() || '15')
    }
  }, [serviceProvider])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user) throw new Error('Usuario no autenticado')
      
      if (serviceProvider) {
        // Actualizar service provider existente
        await updateServiceProvider({
          business_name: businessName,
          commission_rate: parseFloat(commissionRate)
        })
      } else {
        // Crear nuevo service provider
        await createServiceProvider({
          user_id: user.id,
          business_name: businessName,
          commission_rate: parseFloat(commissionRate)
        })
      }
      
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout requireAuth={true} requireServiceProvider={false}>
      <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
        <div className="flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: 'hsl(var(--foreground))' }}>
              {serviceProvider ? 'Actualizar Perfil' : 'Configurar Perfil'}
            </h2>
            <p className="mt-2 text-center text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {serviceProvider 
                ? 'Actualiza la información de tu perfil de proveedor de servicios'
                : 'Configura tu perfil de proveedor de servicios'
              }
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">
                Información del Negocio
              </CardTitle>
              <CardDescription>
                {serviceProvider 
                  ? 'Actualiza la información básica de tu negocio'
                  : 'Completa la información básica de tu negocio'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <Input
                    label="Nombre del Negocio"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="Ej: Barbería El Estilo"
                  />
                  
                  <Input
                    label="Tasa de Comisión (%)"
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="15"
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                  <p className="text-sm">
                    <strong>Ejemplo:</strong> Si cobras $100 y tu comisión es {commissionRate}%, 
                    recibirás ${(100 * (1 - parseFloat(commissionRate) / 100)).toFixed(2)} 
                    (${(100 * parseFloat(commissionRate) / 100).toFixed(2)} de comisión)
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  {serviceProvider ? 'Actualizar Perfil' : 'Crear Perfil'}
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
