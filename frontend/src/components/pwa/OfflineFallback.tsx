import { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

export function OfflineFallback() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsDismissed(false); // Reset dismissal on reconnect
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-ivory border-b-4 border-[#C15D82] shadow-md px-4 py-3">
      <div className="page-container flex items-start gap-3 relative">
        <div className="text-[#C15D82] mt-1">
          <WifiOff size={24} />
        </div>
        <div>
          <h3 className="font-playfair font-bold text-gray-900 text-lg">You're Offline</h3>
          <p className="text-sm text-gray-700 mt-1 max-w-2xl">
            It looks like you've lost your internet connection. You can still browse products you've already seen, but adding to cart or checking out requires an active connection.
          </p>
        </div>
        <button 
          onClick={() => setIsDismissed(true)}
          className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss offline banner"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
