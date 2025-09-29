import { useEffect } from 'react'
import { useTheme } from '~/lib/hooks/useTheme'

export function ClientThemeHandler() {
  const { theme, isHydrated } = useTheme()

  useEffect(() => {
    // Only apply theme after hydration is complete
    if (!isHydrated) return
    
    // Apply theme class to html element after hydration
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(theme)
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#1e40af')
    }
  }, [theme, isHydrated])

  return null
}
