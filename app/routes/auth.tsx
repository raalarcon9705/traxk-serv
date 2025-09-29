import { useState, useEffect } from 'react'
import { useAuth } from '~/lib/auth'
import { useLanguage } from '~/lib/hooks/useLanguage'
import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Link, useNavigate } from 'react-router'
import type { Route } from "./+types/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Iniciar Sesión - TrackServ" },
    { name: "description", content: "Inicia sesión en TrackServ para gestionar tus comisiones y servicios. Acceso seguro a tu panel de control." },
    { name: "keywords", content: "iniciar sesión, login, autenticación, TrackServ, comisiones, servicios" },
    { property: "og:title", content: "Iniciar Sesión - TrackServ" },
    { property: "og:description", content: "Inicia sesión en TrackServ para gestionar tus comisiones y servicios" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Iniciar Sesión - TrackServ" },
    { name: "twitter:description", content: "Inicia sesión en TrackServ para gestionar tus comisiones y servicios" }
  ];
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  
  const { user, signIn, signUp } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    } else {
      setIsCheckingAuth(false)
    }
  }, [user, navigate])

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'hsl(var(--background))' }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {t('common.loading')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn(email, password)
        navigate('/dashboard')
      } else {
        await signUp(email, password)
        // Para registro exitoso, mostrar mensaje de confirmación en lugar de navegar
        setError('')
        setSuccess('¡Cuenta creada exitosamente! Por favor, revisa tu correo electrónico para confirmar tu cuenta.')
      }
    } catch (err) {
      console.log('🚨 Error capturado en auth.tsx:', err)
      console.log('📝 Tipo de error:', typeof err)
      console.log('📄 Mensaje:', err instanceof Error ? err.message : 'No es Error')
      
      let errorMessage = 'Error desconocido'
      
      if (err instanceof Error) {
        // Manejo específico de errores de Supabase
        if (err.message.includes('User already registered') || 
            err.message.includes('already registered') ||
            err.message.includes('already exists') ||
            err.message.includes('duplicate key') ||
            err.message.includes('email already exists')) {
          errorMessage = 'Este correo electrónico ya está registrado. Intenta iniciar sesión en su lugar.'
        } else if (err.message.includes('Invalid email')) {
          errorMessage = 'Por favor, ingresa un correo electrónico válido.'
        } else if (err.message.includes('Password should be at least')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.'
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.'
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirma tu correo electrónico antes de iniciar sesión.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: 'hsl(var(--foreground))' }}>
          {isLogin ? t('auth.title') : t('auth.signupTitle')}
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {isLogin 
            ? t('auth.welcomeMessage')
            : t('auth.createAccountMessage')
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">
              {isLogin ? t('auth.title') : t('auth.signupTitle')}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? t('auth.welcomeMessage')
                : t('auth.createAccountMessage')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">{error}</p>
                  {error.includes('ya está registrado') && !isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(true)
                        setError('')
                        setSuccess('')
                      }}
                      className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                    >
                      ¿Ya tienes cuenta? Inicia sesión aquí
                    </button>
                  )}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  <p className="text-sm">{success}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <Input
                  label={t('auth.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                />
                
                <Input
                  label={t('auth.password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {isLogin ? t('auth.signIn') : t('auth.signUp')}
              </Button>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  {isLogin ? (
                    <>
                      {t('auth.noAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(false)
                          setError('')
                          setSuccess('')
                        }}
                        className="font-medium text-dark-blue-600 hover:text-dark-blue-700 hover:underline"
                      >
                        {t('auth.signUpHere')}
                      </button>
                    </>
                  ) : (
                    <>
                      {t('auth.hasAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(true)
                          setError('')
                          setSuccess('')
                        }}
                        className="font-medium text-dark-blue-600 hover:text-dark-blue-700 hover:underline"
                      >
                        {t('auth.signInHere')}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
