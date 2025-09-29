import { clsx } from 'clsx'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  className?: string
}

export function Alert({ children, variant = 'default', className }: AlertProps) {
  const Icon = {
    default: Info,
    destructive: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
  }[variant]

  return (
    <div
      className={clsx(
        'relative w-full rounded-lg border p-4',
        {
          'bg-background text-foreground border-border': variant === 'default',
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive': variant === 'destructive',
          'border-success-500/50 text-success-700 dark:text-success-400 [&>svg]:text-success-600 dark:[&>svg]:text-success-400': variant === 'success',
          'border-warning-500/50 text-warning-700 dark:text-warning-400 [&>svg]:text-warning-600 dark:[&>svg]:text-warning-400': variant === 'warning',
        },
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-sm">{children}</div>
      </div>
    </div>
  )
}