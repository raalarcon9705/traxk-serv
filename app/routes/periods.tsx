import { usePaymentPeriods } from '~/lib/hooks/usePaymentPeriods'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { Link } from 'react-router'
import { Plus, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import type { Route } from "./+types/periods";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Períodos de Pago - TrackServ" },
    { name: "description", content: "Gestiona tus períodos de pago. Visualiza períodos activos y cerrados, controla fechas y administra el flujo de comisiones." },
    { name: "keywords", content: "períodos de pago, gestión, fechas, comisiones, TrackServ, administración" },
    { property: "og:title", content: "Períodos de Pago - TrackServ" },
    { property: "og:description", content: "Gestiona tus períodos de pago" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Períodos de Pago - TrackServ" },
    { name: "twitter:description", content: "Gestiona tus períodos de pago" }
  ];
}

export default function Periods() {
  const { paymentPeriods, currentPeriod, loading, error, closePaymentPeriod } = usePaymentPeriods()

  const handleClosePeriod = async (periodId: string) => {
    try {
      await closePaymentPeriod(periodId)
    } catch (err) {
      console.error('Error closing period:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Períodos de Pago</h1>
              <p className="mt-2 text-gray-600">
                Gestiona tus períodos de pago y comisiones
              </p>
            </div>
            <Link to="/periods/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Período
              </Button>
            </Link>
          </div>
        </div>

        {/* Current Period */}
        {currentPeriod && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-600" />
                Período Actual
              </CardTitle>
              <CardDescription>
                Período activo desde {new Date(currentPeriod.period_start).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">${currentPeriod.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Comisión</p>
                  <p className="text-2xl font-bold">${currentPeriod.total_commission.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pago Neto</p>
                  <p className="text-2xl font-bold">${currentPeriod.total_net_amount.toFixed(2)}</p>
                </div>
              </div>
              <Button
                onClick={() => handleClosePeriod(currentPeriod.id)}
                variant="destructive"
              >
                Cerrar Período
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Periods List */}
        {paymentPeriods.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay períodos</h3>
              <p className="mt-2 text-gray-500">
                Comienza creando tu primer período de pago
              </p>
              <Link to="/periods/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Período
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentPeriods.map((period) => (
              <Card key={period.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold">
                          Período {new Date(period.period_start).toLocaleDateString()}
                        </h3>
                        {period.is_closed ? (
                          <div className="ml-2 flex items-center text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            <span className="text-sm">Cerrado</span>
                          </div>
                        ) : (
                          <div className="ml-2 flex items-center text-orange-600">
                            <Clock className="mr-1 h-4 w-4" />
                            <span className="text-sm">Activo</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {period.period_end 
                          ? `Hasta ${new Date(period.period_end).toLocaleDateString()}`
                          : 'Período en curso'
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">${period.total_amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        Comisión: ${period.total_commission.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Neto: ${period.total_net_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
