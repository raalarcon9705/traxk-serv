import { useState, useEffect } from 'react'
import { useClients } from '~/lib/hooks/useClients'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Route } from "./+types/clients.$id.edit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Editar Cliente - TrackServ" },
    { name: "description", content: "Edita la información de un cliente existente. Actualiza datos de contacto y detalles para mantener tu lista de clientes actualizada." },
    { name: "keywords", content: "editar cliente, modificar, cliente, contactos, TrackServ, actualizar" },
    { property: "og:title", content: "Editar Cliente - TrackServ" },
    { property: "og:description", content: "Edita la información de un cliente existente" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Editar Cliente - TrackServ" },
    { name: "twitter:description", content: "Edita la información de un cliente existente" }
  ];
}

export default function EditClient() {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { clients, updateClient, loading: clientsLoading } = useClients()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const client = clients.find(c => c.id === id)

  useEffect(() => {
    if (client) {
      setName(client.name)
      setPhone(client.phone || '')
      setEmail(client.email || '')
    }
  }, [client])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setLoading(true)
    setError('')

    try {
      await updateClient(id, {
        name,
        phone: phone || null,
        email: email || null
      })
      
      navigate('/clients')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('clients.errorUpdating'))
    } finally {
      setLoading(false)
    }
  }

  if (clientsLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('clients.clientNotFound')}</h2>
          <Button onClick={() => navigate('/clients')}>
            {t('common.back')} {t('clients.title')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/clients')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')} {t('clients.title')}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('clients.editClient')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('clients.modifyClientInfo')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('clients.clientInfo')}</CardTitle>
            <CardDescription>
              {t('clients.updateClientData')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <Input
                label={t('clients.clientName')} *
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('clients.clientNamePlaceholder')}
              />
              
              <Input
                label={t('clients.phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('clients.phonePlaceholder')}
              />
              
              <Input
                label={t('clients.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('clients.emailPlaceholder')}
              />
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/clients')}
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={loading}
                >
                  {t('clients.updateClient')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
