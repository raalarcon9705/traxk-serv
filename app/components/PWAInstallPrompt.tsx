import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { useTheme } from '~/lib/hooks/useTheme';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-800 text-slate-100 border border-slate-700' 
        : 'bg-blue-600 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Instalar TrackServ</h3>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'opacity-90'}`}>
            Agrega TrackServ a tu pantalla de inicio para un acceso más rápido
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            onClick={handleInstallClick}
            className={
              isDark 
                ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                : 'bg-white text-blue-600 hover:bg-gray-100'
            }
            size="sm"
          >
            Instalar
          </Button>
          <Button
            onClick={() => setShowInstallPrompt(false)}
            variant="outline"
            className={
              isDark 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100' 
                : 'border-white text-white hover:bg-white hover:text-blue-600'
            }
            size="sm"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
