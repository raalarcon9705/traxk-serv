import { useState } from 'react'
import { usePaymentPeriods } from '~/lib/hooks/usePaymentPeriods'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Route } from "./+types/periods.new";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo Período - TrackServ" },
    { name: "description", content: "Crea un nuevo período de pago para organizar tus servicios y comisiones. Establece fechas de inicio para un mejor control financiero." },
    { name: "keywords", content: "nuevo período, período de pago, comisiones, TrackServ, gestión, fechas" },
    { property: "og:title", content: "Nuevo Período - TrackServ" },
    { property: "og:description", content: "Crea un nuevo período de pago para organizar tus servicios" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Nuevo Período - TrackServ" },
    { name: "twitter:description", content: "Crea un nuevo período de pago para organizar tus servicios" }
  ];
}

export default function NewPeriod() {
  const [periodStart, setPeriodStart] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { createPaymentPeriod } = usePaymentPeriods()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createPaymentPeriod({
        period_start: periodStart,
        period_end: null,
        is_closed: false
      })
      
      navigate('/periods')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('periods.errorCreating'))
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
            onClick={() => navigate('/periods')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')} {t('periods.title')}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('periods.newPeriod')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('periods.createNewPeriod')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('periods.periodInfo')}</CardTitle>
            <CardDescription>
              {t('periods.configurePeriodDates')}
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
                label={t('periods.periodStart')} *
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                required
              />
              
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                <p className="text-sm">
                  <strong>{t('periods.note')}:</strong> {t('periods.periodNote')}
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/periods')}
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
                  {t('periods.createPeriod')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
