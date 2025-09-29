import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { useTheme } from '~/lib/hooks/useTheme';
import { useLanguage } from '~/lib/hooks/useLanguage';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { isDark } = useTheme();
  const { t } = useLanguage();

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
          <h3 className="font-semibold">{t('pwa.installTitle')}</h3>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'opacity-90'}`}>
            {t('pwa.installMessage')}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            onClick={handleInstallClick}
            variant="secondary"
            size="sm"
          >
            {t('pwa.install')}
          </Button>
          <Button
            onClick={() => setShowInstallPrompt(false)}
            variant="ghost"
            size="sm"
          >
            {t('pwa.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}
