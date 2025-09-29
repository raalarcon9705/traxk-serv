import { useState } from 'react'
import { useServices } from '~/lib/hooks/useServices'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { useCurrency } from '~/lib/hooks/useCurrency'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { Layout } from '~/components/Layout'
import { ArrowLeft, Download, Calendar, DollarSign, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { Route } from "./+types/report";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reporte - TrackServ" },
    { name: "description", content: "Genera reportes detallados de tus servicios y comisiones. Visualiza estadísticas, exporta datos y analiza tu rendimiento." },
    { name: "keywords", content: "reporte, estadísticas, análisis, comisiones, servicios, TrackServ, exportar" },
    { property: "og:title", content: "Reporte - TrackServ" },
    { property: "og:description", content: "Genera reportes detallados de tus servicios y comisiones" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Reporte - TrackServ" },
    { name: "twitter:description", content: "Genera reportes detallados de tus servicios y comisiones" }
  ];
}

export default function Report() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const { services: allServices, loading, error } = useServices() // Get all services
  const { t } = useLanguage()
  const { formatCurrency } = useCurrency()
  const navigate = useNavigate()

  // Calculate pagination
  const totalPages = Math.ceil(allServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentServices = allServices.slice(startIndex, endIndex)


  const totalAmount = allServices.reduce((sum, service) => sum + service.amount, 0)
  const totalCommission = allServices.reduce((sum, service) => sum + service.commission_amount, 0)
  const totalNet = allServices.reduce((sum, service) => sum + service.net_amount, 0)
  const paidServices = allServices.filter(service => service.is_paid).length
  const pendingServices = allServices.length - paidServices

  const exportToCSV = () => {
    const headers = [t('report.date'), t('report.client'), t('report.service'), t('report.amount'), t('report.commission'), t('report.net'), t('report.status')]
    const csvData = allServices.map(service => [
      service.service_date ? new Date(service.service_date).toLocaleDateString() : t('report.noDate'),
      (service as any).clients?.name || 'N/A',
      service.service_description,
      service.amount.toFixed(2),
      service.commission_amount.toFixed(2),
      service.net_amount.toFixed(2),
      service.is_paid ? t('report.paid') : t('report.pending')
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `servicios_todos.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="h-4 rounded w-1/2 mb-2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                  <div className="h-6 rounded w-3/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                </div>
              ))}
            </div>
            
            {/* Services list skeleton */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <div className="h-6 rounded w-1/4 mb-4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--border))' }}>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 rounded w-3/4 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-3 rounded w-1/2 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 rounded w-16 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                      <div className="h-3 rounded w-12 animate-pulse" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-blue-900">{t('report.title')}</h1>
                <p className="mt-1 sm:mt-2 text-dark-blue-600 text-sm sm:text-base">
                  {t('report.allServicesProvided')} ({allServices.length} {t('report.services')})
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto text-dark-blue-600 hover:text-dark-blue-900 hover:bg-dark-blue-100">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{t('report.exportCSV')}</span>
                  <span className="sm:hidden">{t('report.export')}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('report.totalGeneral')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {allServices.length} {t('report.services')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('report.commission')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalCommission)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('report.netPayment')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalNet)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('report.status')}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paidServices}</div>
                <p className="text-xs text-muted-foreground">
                  {t('report.of')} {allServices.length} {t('report.paid')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Services List */}
          {allServices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{t('report.noServices')}</h3>
                <p className="mt-2 text-gray-500">
                  {t('report.noServicesFound')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('report.serviceHistory')}</CardTitle>
                <CardDescription>
                  {t('report.detailedList')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{service.service_description}</h3>
                        <p className="text-sm text-gray-600">
                          {t('report.client')}: {(service as any).clients?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {service.service_date ? new Date(service.service_date).toLocaleDateString() : t('report.noDate')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatCurrency(service.amount)}</div>
                        <div className="text-sm text-gray-600">
                          {t('report.commission')}: {formatCurrency(service.commission_amount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t('report.net')}: {formatCurrency(service.net_amount)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.is_paid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {service.is_paid ? t('report.paid') : t('report.pending')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {t('report.showing')} {startIndex + 1} {t('report.to')} {Math.min(endIndex, allServices.length)} {t('report.of')} {allServices.length} {t('report.services')}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t('common.previous')}
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        {t('common.next')}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
      </div>
    </Layout>
  )
}
