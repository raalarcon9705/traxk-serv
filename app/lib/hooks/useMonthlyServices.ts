import { useState, useEffect } from 'react'
import { supabase } from '~/supabase/client'

export function useMonthlyServices(selectedMonth: string) {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMonthlyServices()
  }, [selectedMonth])

  const fetchMonthlyServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setServices([])
        return
      }

      // Get service provider
      const { data: serviceProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!serviceProvider) {
        setServices([])
        return
      }

      // Get all services for the selected month
      const startDate = `${selectedMonth}-01`
      const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0)
        .toISOString().split('T')[0]

      // First, get all payment periods that overlap with the selected month
      const { data: periods } = await supabase
        .from('payment_periods')
        .select('id')
        .eq('provider_id', serviceProvider.id)
        .or(`and(period_start.lte.${endDate},period_end.gte.${startDate}),and(period_start.lte.${endDate},period_end.is.null)`)

      const periodIds = periods?.map(p => p.id) || []

      if (periodIds.length === 0) {
        setServices([])
        return
      }

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          clients (
            id,
            name
          ),
          payment_periods (
            id,
            period_start,
            period_end
          )
        `)
        .eq('provider_id', serviceProvider.id)
        .in('payment_period_id', periodIds)
        .order('service_date', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }

  return {
    services,
    loading,
    error,
    refetch: fetchMonthlyServices
  }
}
