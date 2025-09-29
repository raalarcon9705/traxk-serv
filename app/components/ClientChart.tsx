import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'

interface MonthlyData {
  month: string
  paid: number
  pending: number
  total: number
}

interface ClientChartProps {
  monthlyData: MonthlyData[]
  loading: boolean
}

export function ClientChart({ monthlyData, loading }: ClientChartProps) {
  const [isClient, setIsClient] = useState(false)
  const [ChartComponents, setChartComponents] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // Dynamic import of Recharts components only on client side
    import('recharts').then((recharts) => {
      setChartComponents({
        LineChart: recharts.LineChart,
        Line: recharts.Line,
        XAxis: recharts.XAxis,
        YAxis: recharts.YAxis,
        CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip,
        Legend: recharts.Legend,
        ResponsiveContainer: recharts.ResponsiveContainer
      })
    })
  }, [])

  if (!isClient || !ChartComponents) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumen de los Últimos 12 Meses</CardTitle>
          <CardDescription>
            Evolución de pagos y servicios pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Cargando gráfico...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = ChartComponents

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de los Últimos 12 Meses</CardTitle>
        <CardDescription>
          Evolución de pagos y servicios pendientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `$${Number(value).toFixed(2)}`, 
                  name === 'paid' ? 'Pagado' : name === 'pending' ? 'Pendiente' : 'Total'
                ]}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Legend 
                formatter={(value) => 
                  value === 'paid' ? 'Pagado' : 
                  value === 'pending' ? 'Pendiente' : 
                  'Total'
                }
              />
              <Line 
                type="monotone" 
                dataKey="paid" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                name="paid" 
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                name="pending" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
