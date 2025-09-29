import { useState, useEffect } from 'react'
import { supabase } from '~/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '~/supabase/types'

type ServiceProvider = Tables<'service_providers'>
type ServiceProviderInsert = TablesInsert<'service_providers'>
type ServiceProviderUpdate = TablesUpdate<'service_providers'>

export function useServiceProvider() {
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServiceProvider()
  }, [])

  const fetchServiceProvider = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setServiceProvider(null)
        return
      }

      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      setServiceProvider(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const createServiceProvider = async (data: ServiceProviderInsert) => {
    try {
      const { data: result, error } = await supabase
        .from('service_providers')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      setServiceProvider(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear perfil')
      throw err
    }
  }

  const updateServiceProvider = async (data: ServiceProviderUpdate) => {
    try {
      if (!serviceProvider) throw new Error('No hay perfil de proveedor')

      const { data: result, error } = await supabase
        .from('service_providers')
        .update(data)
        .eq('id', serviceProvider.id)
        .select()
        .single()

      if (error) throw error
      setServiceProvider(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil')
      throw err
    }
  }

  return {
    serviceProvider,
    loading,
    error,
    createServiceProvider,
    updateServiceProvider,
    refetch: fetchServiceProvider,
  }
}
