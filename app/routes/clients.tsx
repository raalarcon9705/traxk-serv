import { useState } from 'react'
import { Link } from 'react-router'
import { useClients } from '~/lib/hooks/useClients'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { Layout } from '~/components/Layout'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Badge } from '~/components/ui/Badge'
import { Alert } from '~/components/ui/Alert'
import { Separator } from '~/components/ui/Separator'
import { Skeleton } from '~/components/ui/Skeleton'
import { 
  Plus, 
  Search, 
  Users, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import type { Route } from "./+types/clients";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clientes - TrackServ" },
    { name: "description", content: "Gestiona tu lista de clientes. Agrega, edita y administra la información de tus clientes para un mejor control de servicios." },
    { name: "keywords", content: "clientes, gestión, administración, TrackServ, servicios, contactos" },
    { property: "og:title", content: "Clientes - TrackServ" },
    { property: "og:description", content: "Gestiona tu lista de clientes" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Clientes - TrackServ" },
    { name: "twitter:description", content: "Gestiona tu lista de clientes" }
  ];
}

export default function Clients() {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await createClient({ name: newClientName.trim() })
      setNewClientName('')
      setShowCreateForm(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('clients.errorCreating'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateClient = async (id: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await updateClient(id, { name: editName.trim() })
      setEditingClient(null)
      setEditName('')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('clients.errorUpdating'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm(t('clients.confirmDelete'))) return

    try {
      await deleteClient(id)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('clients.errorDeleting'))
    }
  }

  const startEditing = (client: any) => {
    setEditingClient(client.id)
    setEditName(client.name)
  }

  const cancelEditing = () => {
    setEditingClient(null)
    setEditName('')
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
            
            {/* Search skeleton */}
            <div className="h-10 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
            
            {/* Clients list skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-3 rounded w-1/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-8 w-8 rounded animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
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
      <Layout requireAuth={true} requireServiceProvider={true}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Alert variant="destructive">
            <h3 className="font-medium">{t('clients.errorLoading')}</h3>
            <p className="text-sm">{error}</p>
          </Alert>
        </div>
      </Layout>
    )
  }

  return (
    <Layout requireAuth={true} requireServiceProvider={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-blue-900">{t('clients.title')}</h1>
              <p className="mt-1 sm:mt-2 text-dark-blue-600 text-sm sm:text-base">
                {t('clients.manageClients')} ({clients.length} {t('clients.clientCount')})
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t('clients.addClient')}</span>
                <span className="sm:hidden">{t('clients.addClient')}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('clients.searchClients')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('clients.addNewClient')}</CardTitle>
              <CardDescription>
                {t('clients.createNewClient')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateClient} className="space-y-4">
                {submitError && (
                  <Alert variant="destructive">
                    <p className="text-sm">{submitError}</p>
                  </Alert>
                )}
                
                <Input
                  label={t('clients.clientName')}
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  required
                  placeholder={t('clients.clientNamePlaceholder')}
                />
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting || !newClientName.trim()}
                  >
                    {t('clients.createClient')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewClientName('')
                      setSubmitError('')
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm ? t('clients.noClientsFound') : t('clients.noClients')}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm 
                  ? t('clients.noClientsMessage')
                  : t('clients.noClientsStart')
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('clients.addFirstClient')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-6">
                  {editingClient === client.id ? (
                    <form onSubmit={(e) => handleUpdateClient(client.id, e)} className="space-y-4">
                      {submitError && (
                        <Alert variant="destructive">
                          <p className="text-sm">{submitError}</p>
                        </Alert>
                      )}
                      
                      <Input
                        label={t('clients.clientName')}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        placeholder={t('clients.clientNamePlaceholder')}
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          loading={isSubmitting}
                          disabled={isSubmitting || !editName.trim()}
                        >
                          {t('common.save')}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-dark-blue-900">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {t('clients.clientSince')} {client.created_at ? new Date(client.created_at).toLocaleDateString() : t('clients.unknownDate')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(client)}
                          className="text-dark-blue-600 hover:text-dark-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t('common.edit')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('common.delete')}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}