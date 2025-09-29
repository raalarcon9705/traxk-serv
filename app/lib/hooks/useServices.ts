import { useState, useEffect } from 'react'
import { supabase } from '~/supabase/client'
import { useCurrency } from './useCurrency'
import type { Tables, TablesInsert, TablesUpdate } from '~/supabase/types'

type Service = Tables<'services'>
type ServiceInsert = TablesInsert<'services'>
type ServiceUpdate = TablesUpdate<'services'>

export function useServices(paymentPeriodId?: string) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fromCents } = useCurrency()

  useEffect(() => {
    fetchServices()
  }, [paymentPeriodId])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setServices([])
        return
      }

      // Get service provider first
      const { data: serviceProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!serviceProvider) {
        setServices([])
        return
      }

      let query = supabase
        .from('services')
        .select(`
          *,
          clients (
            id,
            name
          )
        `)
        .eq('provider_id', serviceProvider.id)
        .order('service_date', { ascending: false })

      if (paymentPeriodId) {
        query = query.eq('payment_period_id', paymentPeriodId)
      }

      const { data, error } = await query

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }

  const createService = async (data: Omit<ServiceInsert, 'provider_id' | 'commission_amount' | 'net_amount'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      // Get service provider
      const { data: serviceProvider } = await supabase
        .from('service_providers')
        .select('id, commission_rate')
        .eq('user_id', user.id)
        .single()

      if (!serviceProvider) throw new Error('Perfil de proveedor no encontrado')

      // Calculate commission and net amount (data.amount is already in cents)
      const commissionAmount = Math.round(data.amount * (serviceProvider.commission_rate / 100))
      const netAmount = data.amount - commissionAmount

      const { data: result, error } = await supabase
        .from('services')
        .insert({ 
          ...data, 
          provider_id: serviceProvider.id,
          commission_rate: serviceProvider.commission_rate,
          commission_amount: commissionAmount,
          net_amount: netAmount,
          tip_amount: data.tip_amount || 0
        })
        .select(`
          *,
          clients (
            id,
            name
          )
        `)
        .single()

      if (error) throw error
      setServices(prev => [result, ...prev])
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear servicio')
      throw err
    }
  }

  const updateService = async (id: string, data: ServiceUpdate) => {
    try {
      const { data: result, error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          clients (
            id,
            name
          )
        `)
        .single()

      if (error) throw error
      setServices(prev => prev.map(service => service.id === id ? result : service))
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar servicio')
      throw err
    }
  }

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error
      setServices(prev => prev.filter(service => service.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar servicio')
      throw err
    }
  }

  const markAsPaid = async (id: string) => {
    try {
      const { data: result, error } = await supabase
        .from('services')
        .update({ is_paid: true })
        .eq('id', id)
        .select(`
          *,
          clients (
            id,
            name
          )
        `)
        .single()

      if (error) throw error
      setServices(prev => prev.map(service => service.id === id ? result : service))
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar como pagado')
      throw err
    }
  }

  const markAllAsPaid = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      // Get service provider
      const { data: serviceProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!serviceProvider) throw new Error('Perfil de proveedor no encontrado')

      const { error } = await supabase
        .from('services')
        .update({ is_paid: true })
        .eq('provider_id', serviceProvider.id)
        .eq('is_paid', false)

      if (error) throw error
      
      // Refresh services to update the UI
      await fetchServices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar todos como pagados')
      throw err
    }
  }

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    markAsPaid,
    markAllAsPaid,
    refetch: fetchServices,
  }
}
