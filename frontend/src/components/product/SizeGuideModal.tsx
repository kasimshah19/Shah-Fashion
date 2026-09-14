import { X, Ruler, Scissors, Shirt } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-gray-900">
            Size & Blouse Guide
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Sarees generally come in a standard free size (5.5 meters). The primary sizing difference lies in the accompanying blouse piece. Here is a quick guide to help you understand the different blouse options.
          </p>

          <div className="space-y-4">
            {/* Unstitched */}
            <div className="flex gap-4 p-4 rounded-xl bg-ivory/50 border border-ivory-dark">
              <div className="mt-1 text-maroon shrink-0">
                <Ruler size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Unstitched Blouse Piece</h3>
                <p className="text-sm text-gray-600 mb-2">
                  A continuous piece of matching fabric (usually 0.8m to 1.0m) attached to the saree or provided separately.
                </p>
                <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                  <li>Requires full stitching by your local tailor.</li>
                  <li>Maximum flexibility for custom designs and perfect fit.</li>
                  <li>Can be tailored up to bust size 42-44 inches (depending on fabric width).</li>
                </ul>
              </div>
            </div>

            {/* Semi-stitched */}
            <div className="flex gap-4 p-4 rounded-xl bg-ivory/50 border border-ivory-dark">
              <div className="mt-1 text-maroon shrink-0">
                <Scissors size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Semi-stitched</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Partially tailored. The neckline and front/back patterns are usually set, but the side seams are left open.
                </p>
                <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                  <li>Requires minimal tailoring to close the sides to your exact measurement.</li>
                  <li>Quicker turnaround than unstitched fabric.</li>
                  <li>Generally fits up to bust size 42 inches.</li>
                </ul>
              </div>
            </div>

            {/* Readymade / Stitched */}
            <div className="flex gap-4 p-4 rounded-xl bg-ivory/50 border border-ivory-dark">
              <div className="mt-1 text-maroon shrink-0">
                <Shirt size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Stitched (Readymade)</h3>
                <p className="text-sm text-gray-600 mb-2">
                  A fully tailored blouse, ready to wear immediately.
                </p>
                <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                  <li>Available in standard sizes (S, M, L, XL).</li>
                  <li>Usually includes 1-2 inches of extra margin inside for minor alterations.</li>
                  <li>Perfect if you need to wear the saree immediately.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full btn-primary py-3"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
