import { useState } from 'react'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { useCurrency } from '~/lib/hooks/useCurrency'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Globe, DollarSign, Check } from 'lucide-react'

interface LanguageCurrencySelectorProps {
  onClose?: () => void
  showTitle?: boolean
}

export function LanguageCurrencySelector({ onClose, showTitle = true }: LanguageCurrencySelectorProps) {
  const { t, changeLanguage, getCurrentLanguage, getAvailableLanguages } = useLanguage()
  const { changeCurrency, getCurrentCurrency, getAvailableCurrencies } = useCurrency()
  const [isChanging, setIsChanging] = useState(false)

  const handleLanguageChange = async (languageCode: string) => {
    setIsChanging(true)
    try {
      await changeLanguage(languageCode)
      if (onClose) onClose()
    } finally {
      setIsChanging(false)
    }
  }

  const handleCurrencyChange = async (currencyCode: string) => {
    setIsChanging(true)
    try {
      await changeCurrency(currencyCode)
      if (onClose) onClose()
    } finally {
      setIsChanging(false)
    }
  }

  const currentLanguage = getCurrentLanguage()
  const currentCurrency = getCurrentCurrency()
  const availableLanguages = getAvailableLanguages()
  const availableCurrencies = getAvailableCurrencies()

  return (
    <div className="space-y-6">
      {showTitle && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('setup.title')}</h2>
          <p className="mt-2 text-gray-600">
            Configure your language and currency preferences
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              {t('setup.language')}
            </CardTitle>
            <CardDescription>
              Choose your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableLanguages.map((language) => (
                <Button
                  key={language.code}
                  variant={currentLanguage === language.code ? "default" : "outline"}
                  onClick={() => handleLanguageChange(language.code)}
                  disabled={isChanging}
                  className="w-full justify-between"
                >
                  <span>{language.name}</span>
                  {currentLanguage === language.code && (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              {t('setup.currency')}
            </CardTitle>
            <CardDescription>
              Choose your preferred currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableCurrencies.map((currency) => (
                <Button
                  key={currency.code}
                  variant={currentCurrency === currency.code ? "default" : "outline"}
                  onClick={() => handleCurrencyChange(currency.code)}
                  disabled={isChanging}
                  className="w-full justify-between"
                >
                  <span>{currency.name} ({currency.symbol})</span>
                  {currentCurrency === currency.code && (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
