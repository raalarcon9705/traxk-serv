import { clsx } from 'clsx'

interface TableProps {
  children: React.ReactNode
  className?: string
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

interface TableHeadProps {
  children: React.ReactNode
  className?: string
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={clsx('w-full caption-bottom text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={clsx('[&_tr]:border-b', className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={clsx('[&_tr:last-child]:border-0', className)}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr className={clsx(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th className={clsx(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className
    )}>
      {children}
    </th>
  )
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={clsx('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}>
      {children}
    </td>
  )
}