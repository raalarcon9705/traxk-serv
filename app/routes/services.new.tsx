import { useState, useEffect } from 'react'
import { useClients } from '~/lib/hooks/useClients'
import { useServices } from '~/lib/hooks/useServices'
import { usePaymentPeriods } from '~/lib/hooks/usePaymentPeriods'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Autocomplete } from '~/components/ui/Autocomplete'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Layout } from '~/components/Layout'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Route } from "./+types/services.new";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo Servicio - TrackServ" },
    { name: "description", content: "Agrega un nuevo servicio a tu cartera. Registra detalles del servicio, cliente, monto y fecha para un mejor control de comisiones." },
    { name: "keywords", content: "nuevo servicio, agregar, servicio, comisiones, TrackServ, registro" },
    { property: "og:title", content: "Nuevo Servicio - TrackServ" },
    { property: "og:description", content: "Agrega un nuevo servicio a tu cartera" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Nuevo Servicio - TrackServ" },
    { name: "twitter:description", content: "Agrega un nuevo servicio a tu cartera" }
  ];
}

export default function NewService() {
  const [clientName, setClientName] = useState('')
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null)
  const [serviceDescription, setServiceDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [tipAmount, setTipAmount] = useState('')
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { clients, loading: clientsLoading, createClient } = useClients()
  const { createService } = useServices()
  const { currentPeriod } = usePaymentPeriods()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!currentPeriod) {
        throw new Error('No hay un período activo.')
      }

      let clientId = selectedClient?.id

      // If no client is selected, create a new one
      if (!clientId && clientName.trim()) {
        const newClient = await createClient({
          name: clientName.trim(),
          phone: null,
          email: null
        })
        clientId = newClient.id
      }

      if (!clientId) {
        throw new Error('Debes seleccionar o crear un cliente')
      }

      await createService({
        client_id: clientId,
        payment_period_id: currentPeriod.id,
        service_description: serviceDescription,
        service_date: serviceDate,
        amount: parseFloat(amount),
        tip_amount: tipAmount ? parseFloat(tipAmount) : 0,
        commission_rate: 0, // Se calculará automáticamente
        is_paid: false
      })
      
      navigate('/services')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear servicio')
    } finally {
      setLoading(false)
    }
  }

  if (clientsLoading) {
    return (
      <Layout requireAuth={true} requireServiceProvider={true}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-8 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
              <div className="h-4 rounded w-1/2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
            </div>
            
            {/* Form skeleton */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <div className="h-6 rounded w-1/4 mb-4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
              <div className="space-y-4">
                <div className="h-10 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                <div className="h-10 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                <div className="h-10 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                <div className="h-10 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                <div className="h-10 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout requireAuth={true} requireServiceProvider={true}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/services')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Servicios
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Nuevo Servicio
          </h1>
          <p className="mt-2 text-gray-600">
            Registra un nuevo servicio prestado
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Servicio</CardTitle>
            <CardDescription>
              Completa los detalles del servicio prestado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Autocomplete
                label="Cliente"
                placeholder="Buscar o crear cliente..."
                options={clients.map(client => ({ id: client.id, name: client.name }))}
                value={clientName}
                onChange={setClientName}
                onSelect={setSelectedClient}
                required
              />
              
              <Input
                label="Descripción del Servicio"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                required
                placeholder="Ej: Corte de cabello, Barba y bigote"
              />
              
              <Input
                label="Monto Cobrado"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="25.00"
              />
              
              <Input
                label="Propina (Opcional)"
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="5.00"
              />
              
              <Input
                label="Fecha del Servicio"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                required
              />
              
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading || !currentPeriod}
              >
                Registrar Servicio
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
