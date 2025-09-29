import { useState, useEffect } from 'react'
import { useServiceProvider } from './useServiceProvider'
import { useLanguage } from './useLanguage'

export function useCurrency() {
  const { serviceProvider, updateCurrency } = useServiceProvider()
  const { getCurrentLanguage } = useLanguage()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const changeCurrency = async (currencyCode: string) => {
    try {
      // Update currency in database if user is logged in and has service provider
      if (serviceProvider) {
        await updateCurrency(currencyCode)
      }
    } catch (error) {
      console.error('Error changing currency:', error)
    }
  }

  const getCurrentCurrency = () => {
    return serviceProvider?.currency_code || 'BRL'
  }

  const getAvailableCurrencies = () => {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
      { code: 'COP', name: 'Colombian Peso', symbol: '$' },
      { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
      { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
      { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' }
    ]
  }

  const formatCurrency = (amountInCents: number) => {
    const currency = getCurrentCurrency()
    const language = getCurrentLanguage()
    
    // Convert cents to decimal amount (divide by 100)
    const amount = amountInCents / 100
    
    // Get locale based on language
    const locale = getLocaleFromLanguage(language)
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } catch (error) {
      // Fallback to manual formatting if Intl.NumberFormat fails
      console.warn('Currency formatting failed, using fallback:', error)
      const currencyInfo = getAvailableCurrencies().find(c => c.code === currency)
      const symbol = currencyInfo?.symbol || '$'
      return `${symbol}${amount.toFixed(2)}`
    }
  }

  const getLocaleFromLanguage = (language: string) => {
    const localeMap: Record<string, string> = {
      'pt': 'pt-BR', // Portuguese (Brazil)
      'es': 'es-ES', // Spanish (Spain) - can be changed to es-MX, es-CO, etc.
      'en': 'en-US', // English (US)
    }
    return localeMap[language] || 'en-US'
  }

  // Helper function to convert cents to decimal for display/calculation
  const fromCents = (amountInCents: number): number => {
    return amountInCents / 100
  }

  return {
    changeCurrency,
    getCurrentCurrency,
    getAvailableCurrencies,
    formatCurrency,
    fromCents,
    isHydrated,
    currentCurrency: getCurrentCurrency()
  }
}
