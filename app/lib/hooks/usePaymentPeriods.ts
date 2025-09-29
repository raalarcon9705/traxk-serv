import { useState, useEffect } from 'react'
import { supabase } from '~/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '~/supabase/types'

type PaymentPeriod = Tables<'payment_periods'>
type PaymentPeriodInsert = TablesInsert<'payment_periods'>
type PaymentPeriodUpdate = TablesUpdate<'payment_periods'>

export function usePaymentPeriods() {
  const [paymentPeriods, setPaymentPeriods] = useState<PaymentPeriod[]>([])
  const [currentPeriod, setCurrentPeriod] = useState<PaymentPeriod | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPaymentPeriods()
  }, [])

  const fetchPaymentPeriods = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setPaymentPeriods([])
        setCurrentPeriod(null)
        return
      }

      // Get service provider first
      const { data: serviceProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!serviceProvider) {
        setPaymentPeriods([])
        setCurrentPeriod(null)
        return
      }

      const { data, error } = await supabase
        .from('payment_periods')
        .select('*')
        .eq('provider_id', serviceProvider.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setPaymentPeriods(data || [])
      
      // Find current period (not closed)
      const current = data?.find(period => !period.is_closed)
      
      // If no current period exists, create one automatically
      if (!current) {
        const today = new Date().toISOString().split('T')[0]
        const newPeriod = await createPaymentPeriod({
          period_start: today,
          period_end: null,
          is_closed: false
        })
        setCurrentPeriod(newPeriod)
        setPaymentPeriods(prev => [newPeriod, ...prev])
      } else {
        setCurrentPeriod(current)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar períodos')
    } finally {
      setLoading(false)
    }
  }

  const createPaymentPeriod = async (data: Omit<PaymentPeriodInsert, 'provider_id'>) => {
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

      const { data: result, error } = await supabase
        .from('payment_periods')
        .insert({ ...data, provider_id: serviceProvider.id })
        .select()
        .single()

      if (error) throw error
      setPaymentPeriods(prev => [result, ...prev])
      setCurrentPeriod(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear período')
      throw err
    }
  }

  const updatePaymentPeriod = async (id: string, data: PaymentPeriodUpdate) => {
    try {
      const { data: result, error } = await supabase
        .from('payment_periods')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setPaymentPeriods(prev => prev.map(period => period.id === id ? result : period))
      
      if (result.is_closed) {
        setCurrentPeriod(null)
      } else if (result.id === currentPeriod?.id) {
        setCurrentPeriod(result)
      }
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar período')
      throw err
    }
  }

  const closePaymentPeriod = async (id: string) => {
    try {
      const { data: result, error } = await supabase
        .from('payment_periods')
        .update({ 
          is_closed: true,
          period_end: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setPaymentPeriods(prev => prev.map(period => period.id === id ? result : period))
      setCurrentPeriod(null)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar período')
      throw err
    }
  }

  const startNewPeriod = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      return await createPaymentPeriod({
        period_start: today,
        period_end: null,
        is_closed: false
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar nuevo período')
      throw err
    }
  }

  const resetPeriod = async () => {
    try {
      // Close current period if exists
      if (currentPeriod) {
        await closePaymentPeriod(currentPeriod.id)
      }
      
      // Create new period
      const today = new Date().toISOString().split('T')[0]
      const newPeriod = await createPaymentPeriod({
        period_start: today,
        period_end: null,
        is_closed: false
      })
      
      setCurrentPeriod(newPeriod)
      return newPeriod
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reiniciar período')
      throw err
    }
  }

  return {
    paymentPeriods,
    currentPeriod,
    loading,
    error,
    createPaymentPeriod,
    updatePaymentPeriod,
    closePaymentPeriod,
    startNewPeriod,
    resetPeriod,
    refetch: fetchPaymentPeriods,
  }
}
