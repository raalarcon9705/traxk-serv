import React, { useState, useEffect, useRef } from 'react'
import { useCurrency } from '~/lib/hooks/useCurrency'
import { Input } from './Input'

interface MoneyInputProps {
  value: number // Value in cents
  onChange: (valueInCents: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  required?: boolean
}

export function MoneyInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  id,
  name,
  required = false
}: MoneyInputProps) {
  const { formatCurrency } = useCurrency()
  const [displayValue, setDisplayValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Extract only numbers from input and convert to cents
  const parseInputToCents = (input: string): number => {
    if (!input || input.trim() === '') return 0
    
    // Remove everything that's not a digit
    const numbersOnly = input.replace(/\D/g, '')
    if (!numbersOnly) return 0
    
    // Convert to cents (last 2 digits are cents, rest are dollars)
    const cents = parseInt(numbersOnly, 10)
    return cents
  }


  // Update display value when prop value changes
  useEffect(() => {
    if (value === 0) {
      setDisplayValue('')
    } else {
      const formatted = formatCurrency(value)
      const cleanFormatted = formatted.replace(/[^\d.,]/g, '').trim()
      setDisplayValue(cleanFormatted)
    }
  }, [value, formatCurrency])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    const centsValue = parseInputToCents(inputValue)
    onChange(centsValue)
    
    // Update display with formatted currency in real-time
    if (centsValue === 0) {
      setDisplayValue('')
    } else {
      const formatted = formatCurrency(centsValue)
      const cleanFormatted = formatted.replace(/[^\d.,]/g, '').trim()
      setDisplayValue(cleanFormatted)
    }
  }


  // Get currency symbol from formatCurrency
  const getCurrencySymbol = () => {
    try {
      const formatted = formatCurrency(100) // $1.00
      return formatted.replace(/[\d\s.,]/g, '').trim()
    } catch (error) {
      return '$' // fallback
    }
  }

  const symbol = getCurrencySymbol()

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
        {symbol}
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`pl-${symbol.length > 1 ? '10' : '8'} ${className}`}
        id={id}
        name={name}
        required={required}
        inputMode="numeric"
        autoComplete="off"
      />
    </div>
  )
}