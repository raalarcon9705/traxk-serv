import { useState } from 'react'
import { useClients } from '~/lib/hooks/useClients'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Route } from "./+types/clients.new";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo Cliente - TrackServ" },
    { name: "description", content: "Agrega un nuevo cliente a tu lista. Registra información de contacto y detalles para un mejor seguimiento de servicios." },
    { name: "keywords", content: "nuevo cliente, agregar, cliente, contactos, TrackServ, registro" },
    { property: "og:title", content: "Nuevo Cliente - TrackServ" },
    { property: "og:description", content: "Agrega un nuevo cliente a tu lista" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Nuevo Cliente - TrackServ" },
    { name: "twitter:description", content: "Agrega un nuevo cliente a tu lista" }
  ];
}

export default function NewClient() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { createClient } = useClients()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createClient({
        name,
        phone: phone || null,
        email: email || null
      })
      
      navigate('/clients')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
    } finally {
      setLoading(false)
    }
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
            Volver a Clientes
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Nuevo Cliente
          </h1>
          <p className="mt-2 text-gray-600">
            Agrega un nuevo cliente a tu lista
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>
              Completa los datos del cliente
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
                label="Nombre del Cliente *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ej: Juan Pérez"
              />
              
              <Input
                label="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
              />
              
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/clients')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={loading}
                >
                  Crear Cliente
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
