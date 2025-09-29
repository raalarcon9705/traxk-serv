import { clsx } from 'clsx'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  return (
    <div
      className={clsx(
        'shrink-0 bg-border',
        {
          'h-[1px] w-full': orientation === 'horizontal',
          'h-full w-[1px]': orientation === 'vertical',
        },
        className
      )}
    />
  )
}