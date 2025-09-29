import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  isHydrated: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Durante SSR, siempre usar 'light'
    if (typeof window === 'undefined') {
      return 'light'
    }
    
    // En el cliente, verificar si ya hay una clase aplicada por el script inline
    if (document.documentElement.classList.contains('dark')) {
      return 'dark'
    } else if (document.documentElement.classList.contains('light')) {
      return 'light'
    } else {
      // Fallback: leer de localStorage o preferencia del sistema
      const savedTheme = localStorage.getItem('trackserv-theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  })
  
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Marcar como hidratado después del primer render
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    
    // Remover clases existentes del tema
    root.classList.remove('light', 'dark')
    
    // Agregar clase del tema actual
    root.classList.add(theme)
    
    // Guardar en localStorage
    localStorage.setItem('trackserv-theme', theme)
    
    // Actualizar meta theme-color basado en el tema
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#1e40af')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isHydrated
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

