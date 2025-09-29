import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning' | 'info'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            // Variants - TrackServ Brand Colors
            'bg-[#1e40af] text-white hover:bg-[#1d4ed8] shadow-sm shadow-blue-200 dark:shadow-blue-800': variant === 'default',
            'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200 dark:shadow-red-800': variant === 'destructive',
            'border border-[#1e40af] bg-transparent text-[#1e40af] hover:bg-[#1e40af] hover:text-white shadow-sm dark:border-[#3b82f6] dark:text-[#3b82f6] dark:hover:bg-[#3b82f6]': variant === 'outline',
            'bg-[#10b981] text-white hover:bg-[#059669] shadow-sm shadow-green-200 dark:shadow-green-800': variant === 'secondary',
            'hover:bg-[#1e40af]/10 hover:text-[#1e40af] dark:hover:bg-[#3b82f6]/10 dark:hover:text-[#3b82f6]': variant === 'ghost',
            'text-[#1e40af] underline-offset-4 hover:underline dark:text-[#3b82f6]': variant === 'link',
            'bg-[#059669] text-white hover:bg-[#047857] shadow-sm shadow-green-200 dark:shadow-green-800': variant === 'success',
            'bg-[#f59e0b] text-white hover:bg-[#d97706] shadow-sm shadow-yellow-200 dark:shadow-yellow-800': variant === 'warning',
            'bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-sm shadow-blue-200 dark:shadow-blue-800': variant === 'info',
          },
          {
            // Sizes
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }