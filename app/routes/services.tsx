import { useState } from 'react'
import { useServices } from '~/lib/hooks/useServices'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Layout } from '~/components/Layout'
import { Link } from 'react-router'
import { Plus, Calendar, DollarSign, CheckCircle, Clock, Trash2, ChevronDown, ChevronUp, Edit } from 'lucide-react'
import { Alert } from '~/components/ui/Alert'
import type { Route } from "./+types/services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Servicios - TrackServ" },
    { name: "description", content: "Gestiona todos tus servicios y comisiones. Visualiza el estado de pagos, montos totales y administra tu cartera de servicios." },
    { name: "keywords", content: "servicios, comisiones, pagos, gestión, TrackServ, administración" },
    { property: "og:title", content: "Servicios - TrackServ" },
    { property: "og:description", content: "Gestiona todos tus servicios y comisiones" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Servicios - TrackServ" },
    { name: "twitter:description", content: "Gestiona todos tus servicios y comisiones" }
  ];
}

export default function Services() {
  const { services, loading, error, markAsPaid, markAllAsPaid, deleteService, updateService } = useServices()
  const [submitError, setSubmitError] = useState('')
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())
  const [editingService, setEditingService] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    service_description: '',
    amount: '',
    tip_amount: '',
    service_date: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMarkAsPaid = async (serviceId: string) => {
    try {
      await markAsPaid(serviceId)
    } catch (err) {
      console.error('Error marking as paid:', err)
    }
  }

  const handleMarkAllAsPaid = async () => {
    try {
      setSubmitError('')
      await markAllAsPaid()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al marcar todos como pagados')
    }
  }


  const handleDeleteService = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return

    try {
      setSubmitError('')
      await deleteService(id)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al eliminar servicio')
    }
  }

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const handleEditService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      setEditingService(serviceId)
      setEditForm({
        service_description: service.service_description,
        amount: service.amount.toString(),
        tip_amount: service.tip_amount ? service.tip_amount.toString() : '',
        service_date: service.service_date || new Date().toISOString().split('T')[0]
      })
    }
  }

  const handleUpdateService = async (serviceId: string) => {
    if (!editForm.service_description.trim() || !editForm.amount.trim()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await updateService(serviceId, {
        service_description: editForm.service_description.trim(),
        amount: parseFloat(editForm.amount),
        tip_amount: editForm.tip_amount ? parseFloat(editForm.tip_amount) : 0,
        service_date: editForm.service_date
      })
      setEditingService(null)
      setEditForm({
        service_description: '',
        amount: '',
        tip_amount: '',
        service_date: ''
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al actualizar servicio')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingService(null)
    setEditForm({
      service_description: '',
      amount: '',
      tip_amount: '',
      service_date: ''
    })
    setSubmitError('')
  }

  if (loading) {
    return (
      <Layout requireAuth={true} requireServiceProvider={true}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-8 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
              <div className="h-4 rounded w-1/2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="h-4 rounded w-1/2 mb-2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                  <div className="h-6 rounded w-3/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                </div>
              ))}
            </div>
            
            {/* Services list skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-5 rounded w-3/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-4 rounded w-1/2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-3 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:gap-6">
                      <div className="text-right space-y-2">
                        <div className="h-5 rounded w-16 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                        <div className="h-4 rounded w-12 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                        <div className="h-4 rounded w-14 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                        <div className="h-4 rounded w-18 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      </div>
                      <div className="flex items-center justify-end lg:justify-start xl:justify-end space-x-2">
                        <div className="h-8 w-20 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                        <div className="h-8 w-8 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  const totalAmount = services.reduce((sum, service) => sum + service.amount + (service.tip_amount || 0), 0)
  const totalTips = services.reduce((sum, service) => sum + (service.tip_amount || 0), 0)
  const totalCommission = services.reduce((sum, service) => sum + service.commission_amount, 0)
  const totalNet = services.reduce((sum, service) => sum + service.net_amount, 0)
  const paidServices = services.filter(service => service.is_paid).length
  const pendingServices = services.length - paidServices

  return (
    <Layout requireAuth={true} requireServiceProvider={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-blue-900">Servicios</h1>
              <p className="mt-1 sm:mt-2 text-dark-blue-600 text-sm sm:text-base">
                Gestiona todos tus servicios y comisiones
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {pendingServices > 0 && (
                <Button
                  onClick={handleMarkAllAsPaid}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Marcar Todos como Pagados</span>
                  <span className="sm:hidden">Marcar Todos</span>
                </Button>
              )}
              <Link to="/services/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Agregar Servicio</span>
                  <span className="sm:hidden">Agregar</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <p className="text-sm">{submitError}</p>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {services.length} servicios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisión</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCommission.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pago Neto</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalNet.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propinas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalTips.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total en propinas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingServices}</div>
              <p className="text-xs text-muted-foreground">
                Pendientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay servicios</h3>
              <p className="mt-2 text-gray-500">
                Comienza agregando tu primer servicio
              </p>
              <Link to="/services/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Servicio
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((service) => {
              const isExpanded = expandedServices.has(service.id)
              const totalAmount = service.amount - service.commission_amount + (service.tip_amount || 0)
              const isEditing = editingService === service.id
              
              return (
                <Card key={service.id}>
                  <CardContent className="p-4 sm:p-6">
                    {/* Edit Form */}
                    {isEditing ? (
                      <div className="space-y-4">
                        {submitError && (
                          <Alert variant="destructive">
                            <p className="text-sm">{submitError}</p>
                          </Alert>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Descripción del Servicio"
                            value={editForm.service_description}
                            onChange={(e) => setEditForm(prev => ({ ...prev, service_description: e.target.value }))}
                            required
                            placeholder="Ej: Corte de cabello, Barba y bigote"
                          />
                          
                          <Input
                            label="Fecha del Servicio"
                            type="date"
                            value={editForm.service_date}
                            onChange={(e) => setEditForm(prev => ({ ...prev, service_date: e.target.value }))}
                            required
                          />
                          
                          <Input
                            label="Monto Cobrado"
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                            required
                            min="0"
                            step="0.01"
                            placeholder="25.00"
                          />
                          
                          <Input
                            label="Propina (Opcional)"
                            type="number"
                            value={editForm.tip_amount}
                            onChange={(e) => setEditForm(prev => ({ ...prev, tip_amount: e.target.value }))}
                            min="0"
                            step="0.01"
                            placeholder="5.00"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            Cliente: {(service as any).clients?.name || 'N/A'}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isSubmitting}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => handleUpdateService(service.id)}
                              loading={isSubmitting}
                              disabled={isSubmitting || !editForm.service_description.trim() || !editForm.amount.trim()}
                            >
                              Guardar Cambios
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Mobile Layout */}
                        <div className="lg:hidden">
                      {/* Header - Mobile */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">{service.service_description}</h3>
                          <p className="text-sm text-gray-600 truncate">
                            Cliente: {(service as any).clients?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {service.service_date ? new Date(service.service_date).toLocaleDateString() : 'Sin fecha'}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-3">
                          <div className="text-right">
                            <div className="text-lg font-semibold">${service.amount.toFixed(2)}</div>
                            <div className="text-sm font-semibold text-blue-600">
                              Total: ${totalAmount.toFixed(2)}
                            </div>
                          </div>
                          
                          {/* Mobile expand button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleServiceExpansion(service.id)}
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                              isExpanded ? 'rotate-180' : 'rotate-0'
                            }`} />
                          </Button>
                        </div>
                      </div>

                      {/* Action buttons - Mobile */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {service.is_paid ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              <span className="text-sm">Pagado</span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsPaid(service.id)}
                              className="whitespace-nowrap"
                            >
                              Marcar como Pagado
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditService(service.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex lg:items-center lg:justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate">{service.service_description}</h3>
                        <p className="text-sm text-gray-600 truncate">
                          Cliente: {(service as any).clients?.name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {service.service_date ? new Date(service.service_date).toLocaleDateString() : 'Sin fecha'}
                        </p>
                      </div>
                      
                      {/* Financial details - Desktop */}
                      <div className="text-right mr-6">
                        <div className="text-lg font-semibold">${service.amount.toFixed(2)}</div>
                        <div className="text-sm text-red-600">
                          -${service.commission_amount.toFixed(2)} comisión
                        </div>
                        <div className="text-sm text-gray-600">
                          Neto: ${(service.amount - service.commission_amount).toFixed(2)}
                        </div>
                        {service.tip_amount && service.tip_amount > 0 && (
                          <div className="text-sm text-green-600">
                            +${service.tip_amount.toFixed(2)} propina
                          </div>
                        )}
                        <div className="text-sm font-semibold text-blue-600 border-t pt-1 mt-1">
                          Total: ${totalAmount.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Action buttons - Desktop */}
                      <div className="flex items-center space-x-2">
                        {service.is_paid ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            <span className="text-sm">Pagado</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsPaid(service.id)}
                          >
                            Marcar como Pagado
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditService(service.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </div>

                    {/* Mobile collapsible details */}
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded 
                        ? 'max-h-96 opacity-100 border-t pt-4 mt-4' 
                        : 'max-h-0 opacity-0'
                    }`}>
                      <div className="space-y-3">
                        <div className={`flex justify-between items-center transition-all duration-300 ${
                          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`} style={{ transitionDelay: isExpanded ? '100ms' : '0ms' }}>
                          <span className="text-sm text-gray-600">Comisión:</span>
                          <span className="text-sm text-red-600 font-medium">
                            -${service.commission_amount.toFixed(2)}
                          </span>
                        </div>
                        <div className={`flex justify-between items-center transition-all duration-300 ${
                          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`} style={{ transitionDelay: isExpanded ? '150ms' : '0ms' }}>
                          <span className="text-sm text-gray-600">Neto:</span>
                          <span className="text-sm font-medium">
                            ${(service.amount - service.commission_amount).toFixed(2)}
                          </span>
                        </div>
                        {service.tip_amount && service.tip_amount > 0 && (
                          <div className={`flex justify-between items-center transition-all duration-300 ${
                            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                          }`} style={{ transitionDelay: isExpanded ? '200ms' : '0ms' }}>
                            <span className="text-sm text-gray-600">Propina:</span>
                            <span className="text-sm text-green-600 font-medium">
                              +${service.tip_amount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className={`flex justify-between items-center border-t pt-2 transition-all duration-300 ${
                          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`} style={{ transitionDelay: isExpanded ? '250ms' : '0ms' }}>
                          <span className="text-sm font-semibold text-gray-800">Total Final:</span>
                          <span className="text-sm font-bold text-blue-600">
                            ${totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
