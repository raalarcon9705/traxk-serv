import { useState, useEffect } from 'react'
import { supabase } from '~/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '~/supabase/types'

type Client = Tables<'clients'>
type ClientInsert = TablesInsert<'clients'>
type ClientUpdate = TablesUpdate<'clients'>

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setClients([])
        return
      }

      // Get service provider first
      const { data: serviceProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!serviceProvider) {
        setClients([])
        return
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('provider_id', serviceProvider.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (data: Omit<ClientInsert, 'provider_id'>) => {
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
        .from('clients')
        .insert({ ...data, provider_id: serviceProvider.id })
        .select()
        .single()

      if (error) throw error
      setClients(prev => [result, ...prev])
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      throw err
    }
  }

  const updateClient = async (id: string, data: ClientUpdate) => {
    try {
      const { data: result, error } = await supabase
        .from('clients')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setClients(prev => prev.map(client => client.id === id ? result : client))
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente')
      throw err
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
      setClients(prev => prev.filter(client => client.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente')
      throw err
    }
  }

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  }
}
