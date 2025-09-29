import { useState } from 'react'
import { clsx } from 'clsx'

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ children, content, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionClasses = () => {
    switch (side) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (side) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 -ml-1'
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
    }
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            'absolute z-50 px-2 py-1 text-xs text-primary-foreground bg-primary rounded shadow-lg animate-fade-in',
            getPositionClasses(),
            className
          )}
        >
          {content}
          <div
            className={clsx(
              'absolute w-2 h-2 bg-primary transform rotate-45',
              getArrowClasses()
            )}
          />
        </div>
      )}
    </div>
  )
}