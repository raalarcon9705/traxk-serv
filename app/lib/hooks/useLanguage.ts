import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useServiceProvider } from './useServiceProvider'

export function useLanguage() {
  const { t, i18n } = useTranslation()
  const { serviceProvider, updateLanguage } = useServiceProvider()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    // Initialize language from service provider if available
    if (serviceProvider?.language_code && isHydrated) {
      i18n.changeLanguage(serviceProvider.language_code)
    }
  }, [serviceProvider, isHydrated])

  const changeLanguage = async (languageCode: string) => {
    try {
      // Change language in i18n
      await i18n.changeLanguage(languageCode)
      
      // Update language in database if user is logged in and has service provider
      if (serviceProvider) {
        await updateLanguage(languageCode)
      }
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const getCurrentLanguage = () => {
    return i18n.language || 'pt'
  }

  const getAvailableLanguages = () => {
    return [
      { code: 'pt', name: t('languages.pt') },
      { code: 'es', name: t('languages.es') },
      { code: 'en', name: t('languages.en') }
    ]
  }

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isHydrated,
    currentLanguage: getCurrentLanguage()
  }
}
