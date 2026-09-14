import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    // Check if prompt was dismissed in the last 7 days (desktop only)
    if (!isMobile) {
      const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (lastDismissed) {
        const daysSinceDismissed = (Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 7) {
          return; // Don't show if dismissed recently
        }
      }
    }

    // Android / Chrome desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    if (isIOSDevice && isSafari && !isStandalone) {
      setIsIOS(true);
      setShowIOSPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSPrompt(false);
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }
  };

  if (!showPrompt && !showIOSPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-ivory rounded-xl shadow-2xl border border-maroon/20 p-4 pointer-events-auto flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-playfair font-semibold text-gray-900 text-lg mb-1">
            Install Shah Fashion
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {isIOS 
              ? "Install this app on your device for quick access. Tap the Share icon below, then select 'Add to Home Screen'."
              : "Add our app to your home screen for faster browsing and a better mobile experience."
            }
          </p>
          
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="bg-[#C15D82] text-white px-5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#A94C6D] transition-colors"
            >
              <Download size={16} />
              Install App
            </button>
          )}
        </div>
        
        <button 
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Dismiss install prompt"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
