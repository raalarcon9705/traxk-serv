import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'

export function ProgressBar() {
  const navigation = useNavigation()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsVisible(true)
      setProgress(0)
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 30
        })
      }, 200)

      return () => clearInterval(interval)
    } else {
      setProgress(100)
      setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 200)
    }
  }, [navigation.state])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}