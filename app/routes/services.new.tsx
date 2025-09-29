import { useState, useEffect } from 'react'
import { useClients } from '~/lib/hooks/useClients'
import { useServices } from '~/lib/hooks/useServices'
import { usePaymentPeriods } from '~/lib/hooks/usePaymentPeriods'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { MoneyInput } from '~/components/ui/MoneyInput'
import { Autocomplete } from '~/components/ui/Autocomplete'
import { Layout } from '~/components/Layout'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Route } from "./+types/services.new";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo Servicio - TrackServ" },
    { name: "description", content: "Agrega un nuevo servicio a tu cartera. Registra detalles del servicio, cliente, monto y fecha para un mejor control de comisiones." }
  ];
}

export default function NewService() {
  const [clientName, setClientName] = useState('')
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null)
  const [serviceDescription, setServiceDescription] = useState('')
  const [amount, setAmount] = useState(0) // Now in cents
  const [tipAmount, setTipAmount] = useState(0) // Now in cents
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { clients, loading: clientsLoading, createClient } = useClients()
  const { createService } = useServices()
  const { currentPeriod } = usePaymentPeriods()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!currentPeriod) {
        throw new Error(t('services.noActivePeriod'))
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
        throw new Error(t('services.mustSelectOrCreateClient'))
      }

      await createService({
        client_id: clientId,
        payment_period_id: currentPeriod.id,
        service_description: serviceDescription,
        service_date: serviceDate,
        amount: amount, // Already in cents
        tip_amount: tipAmount, // Already in cents
        commission_rate: 0, // Se calculará automáticamente
        is_paid: false
      })
      
      navigate('/services')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('services.errorCreating'))
    } finally {
      setLoading(false)
    }
  }

  if (clientsLoading) {
    return (
      <Layout requireAuth={true} requireServiceProvider={true}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-blue-900">
            {t('services.newService')}
          </h1>
          <p className="mt-1 sm:mt-2 text-dark-blue-600 text-sm sm:text-base">
            {t('services.registerNewService')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Autocomplete
              label={t('services.client')}
              placeholder={t('services.searchClient')}
              options={clients.map(client => ({ id: client.id, name: client.name }))}
              value={clientName}
              onChange={setClientName}
              onSelect={setSelectedClient}
              required
            />
            
            <Input
              label={t('services.serviceDescription')}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              required
              placeholder={t('services.serviceDescriptionPlaceholder')}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('services.amount')}
              </label>
              <MoneyInput
                value={amount}
                onChange={setAmount}
                required
                placeholder={t('services.amountPlaceholder')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('services.tipAmount')}
              </label>
              <MoneyInput
                value={tipAmount}
                onChange={setTipAmount}
                placeholder={t('services.tipPlaceholder')}
              />
            </div>
            
            <Input
              label={t('services.serviceDate')}
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading || !currentPeriod}
          >
            {t('services.registerService')}
          </Button>
        </form>
      </div>
    </Layout>
  )
}
