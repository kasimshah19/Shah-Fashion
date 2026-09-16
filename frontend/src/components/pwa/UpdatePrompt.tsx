import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export function UpdatePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Setup periodic update checks (every 60 minutes)
      // This is crucial for PWA users who keep the app open for days
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000); // 1 hour
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  // When needRefresh becomes true, open the prompt
  useEffect(() => {
    if (needRefresh) {
      setIsOpen(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-[84px] lg:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 pointer-events-auto"
        >
          <div className="bg-[#FDF8F4] border border-gray-100 rounded-xl shadow-xl overflow-hidden pointer-events-auto flex flex-col">
            <div className="p-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-brand/10 p-2 rounded-full">
                  <RefreshCw className="text-brand w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-gray-900 text-lg">Update Available</h3>
                  <p className="text-sm text-gray-600 mt-0.5">A new version of Shah Fashion is ready.</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white px-4 py-3 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                Later
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 py-2 text-sm font-medium text-white bg-maroon hover:bg-maroon-light rounded-lg transition-colors shadow-sm"
              >
                Update Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
