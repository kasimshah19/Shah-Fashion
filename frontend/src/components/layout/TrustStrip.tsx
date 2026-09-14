import { Shield, RotateCcw, Truck, Award } from 'lucide-react';

const items = [
  { icon: Shield, text: 'Secure Payments' },
  { icon: RotateCcw, text: '7-Day Easy Returns' },
  { icon: Truck, text: 'COD Available' },
  { icon: Award, text: '100% Authentic' },
];

export function TrustStrip() {
  return (
    <div className="bg-ivory-dark border-y border-gray-100">
      <div className="page-container py-3">
        <div className="flex overflow-x-auto scrollbar-hide gap-6 sm:gap-0 sm:justify-between">
          {items.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 shrink-0 sm:shrink">
              <Icon size={18} className="text-gold shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
