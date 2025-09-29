import { useState, useEffect } from 'react'
import { supabase } from '~/supabase/client'
import type { Tables } from '~/supabase/types'

type Service = Tables<'services'>

interface MonthlyData {
  month: string
  paid: number
  pending: number
  total: number
}

export function useServiceHistory() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServiceHistory()
  }, [])

  const fetchServiceHistory = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setMonthlyData([])
        return
      }

      // Get service provider
      const { data: serviceProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!serviceProvider) {
        setMonthlyData([])
        return
      }

      // Get services from last 12 months
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

      const { data: services, error } = await supabase
        .from('services')
        .select('service_date, amount, tip_amount, commission_amount, net_amount, is_paid')
        .eq('provider_id', serviceProvider.id)
        .gte('service_date', twelveMonthsAgo.toISOString().split('T')[0])
        .order('service_date', { ascending: true })

      if (error) throw error

      // Group by month
      const monthlyStats: { [key: string]: { paid: number; pending: number } } = {}
      
      services?.forEach(service => {
        const date = new Date(service.service_date || '')
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
        
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = { paid: 0, pending: 0 }
        }
        
        // Calculate net amount (amount - commission) + tip
        const netAmount = (service.amount - (service.commission_amount || 0))
        const totalAmount = netAmount + (service.tip_amount || 0)
        
        if (service.is_paid) {
          monthlyStats[monthKey].paid += totalAmount
        } else {
          monthlyStats[monthKey].pending += totalAmount
        }
      })

      // Convert to array and fill missing months
      const result: MonthlyData[] = []
      const currentDate = new Date()
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
        
        const stats = monthlyStats[monthKey] || { paid: 0, pending: 0 }
        result.push({
          month: monthName,
          paid: stats.paid,
          pending: stats.pending,
          total: stats.paid + stats.pending
        })
      }

      setMonthlyData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar historial')
    } finally {
      setLoading(false)
    }
  }

  return {
    monthlyData,
    loading,
    error,
    refetch: fetchServiceHistory
  }
}
