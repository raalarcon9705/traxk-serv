import { useAuth } from '~/lib/auth'
import { useServiceProvider } from '~/lib/hooks/useServiceProvider'
import { useServices } from '~/lib/hooks/useServices'
import { useServiceHistory } from '~/lib/hooks/useServiceHistory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { Layout } from '~/components/Layout'
import { ClientChart } from '~/components/ClientChart'
import { Plus, Users, DollarSign, Calendar, TrendingUp, BarChart3, CheckCircle, Clock } from 'lucide-react'
import { Link } from 'react-router'
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Panel Principal - TrackServ" },
    { name: "description", content: "Panel de control para gestión de comisiones y servicios. Visualiza estadísticas, gestiona períodos de pago y administra tus servicios." },
    { name: "keywords", content: "panel principal, dashboard, comisiones, servicios, gestión, TrackServ" },
    { property: "og:title", content: "Panel Principal - TrackServ" },
    { property: "og:description", content: "Panel de control para gestión de comisiones y servicios" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Panel Principal - TrackServ" },
    { name: "twitter:description", content: "Panel de control para gestión de comisiones y servicios" }
  ];
}

export default function Dashboard() {
  const { user } = useAuth()
  const { serviceProvider, loading: providerLoading } = useServiceProvider()
  const { services, loading: servicesLoading } = useServices()
  const { monthlyData, loading: historyLoading } = useServiceHistory()

  // Current period stats
  const totalAmount = services.reduce((sum, service) => sum + service.amount + (service.tip_amount || 0), 0)
  const totalTips = services.reduce((sum, service) => sum + (service.tip_amount || 0), 0)
  const totalCommission = services.reduce((sum, service) => sum + service.commission_amount, 0)
  const totalNet = services.reduce((sum, service) => sum + service.net_amount, 0)
  const paidServices = services.filter(service => service.is_paid).length
  const pendingServices = services.length - paidServices

  // Pending services stats (only unpaid services)
  const pendingServicesList = services.filter(service => !service.is_paid)
  const pendingAmount = pendingServicesList.reduce((sum, service) => sum + service.amount + (service.tip_amount || 0), 0)
  const pendingCommission = pendingServicesList.reduce((sum, service) => sum + service.commission_amount, 0)
  const pendingNet = pendingAmount - pendingCommission

  // Monthly stats
  const currentMonth = new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
  const currentMonthData = monthlyData.find(data => data.month === currentMonth) || { paid: 0, pending: 0, total: 0 }
  
  // Calculate monthly totals
  const monthlyPaid = monthlyData.reduce((sum, data) => sum + data.paid, 0)
  const monthlyPending = monthlyData.reduce((sum, data) => sum + data.pending, 0)
  const monthlyTotal = monthlyPaid + monthlyPending



  if (providerLoading || servicesLoading || historyLoading) {
    return (
      <Layout requireAuth={true} requireServiceProvider={true}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-8 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
              <div className="h-4 rounded w-1/2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
            </div>
            
            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="h-4 rounded w-1/2 mb-4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-3 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-5 rounded w-1/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-5 rounded w-1/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <div className="h-3 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-5 rounded w-1/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                    </div>
                  </div>
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
      </Layout>
    )
  }

  if (!serviceProvider) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configura tu Perfil
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Necesitas configurar tu perfil de proveedor de servicios
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Link to="/setup">
              <Button className="w-full">
                Configurar Perfil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout requireAuth={true} requireServiceProvider={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-blue-900">
            Panel Principal
          </h1>
          <p className="mt-1 sm:mt-2 text-dark-blue-600 text-sm sm:text-base">
            Bienvenido, {serviceProvider.business_name || user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resumen Financiero</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pendiente por recibir:</span>
                  <span className="text-lg font-bold text-orange-600">${pendingNet.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pagado este mes:</span>
                  <span className="text-lg font-bold text-green-600">${currentMonthData.paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium text-gray-800">Total del mes:</span>
                  <span className="text-lg font-bold text-blue-600">${currentMonthData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propinas y Comisiones</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Propinas recibidas:</span>
                  <span className="text-lg font-bold text-green-600">${totalTips.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comisiones retenidas:</span>
                  <span className="text-lg font-bold text-red-600">${totalCommission.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {serviceProvider.commission_rate}% retenido por el contratista
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado de Servicios</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Servicios pendientes:</span>
                  <span className="text-2xl font-bold text-orange-600">{pendingServices}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Servicios pagados:</span>
                  <span className="text-2xl font-bold text-green-600">{paidServices}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium text-gray-800">Total servicios:</span>
                  <span className="text-2xl font-bold text-blue-600">{services.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Gestiona tus servicios y clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/services/new">
                <Button className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Servicio
                </Button>
              </Link>
              <Link to="/report">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver Reporte Mensual
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Servicios
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        {/* Monthly Chart - Client Side Only */}
        <div className="mb-6 sm:mb-8">
          <ClientChart monthlyData={monthlyData} loading={historyLoading} />
        </div>

        {/* Recent Services */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Recientes</CardTitle>
            <CardDescription>
              Últimos servicios registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay servicios registrados
              </p>
            ) : (
              <div className="space-y-4">
                {services.slice(0, 5).map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.service_description}</p>
                        <p className="text-sm text-gray-500">
                          {service.service_date ? new Date(service.service_date).toLocaleDateString() : 'Sin fecha'}
                        </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${service.amount.toFixed(2)}</p>
                      <p className="text-sm text-red-600">
                        -${service.commission_amount.toFixed(2)} comisión
                      </p>
                      <p className="text-sm text-gray-600">
                        Neto: ${(service.amount - service.commission_amount).toFixed(2)}
                      </p>
                      {service.tip_amount && service.tip_amount > 0 && (
                        <p className="text-sm text-green-600">
                          +${service.tip_amount.toFixed(2)} propina
                        </p>
                      )}
                      <p className="text-sm font-semibold text-blue-600 border-t pt-1 mt-1">
                        Total: ${(service.amount - service.commission_amount + (service.tip_amount || 0)).toFixed(2)}
                      </p>
                      <p className={`text-xs ${service.is_paid ? 'text-green-600' : 'text-orange-600'}`}>
                        {service.is_paid ? 'Pagado' : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
