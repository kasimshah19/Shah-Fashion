import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Coupon } from '../../types';
import { formatPrice } from '../../utils/format';
import { Tag } from 'lucide-react';

interface AvailableCouponsProps {
  onApply: (code: string) => void;
  subtotal: number;
}

export function AvailableCoupons({ onApply, subtotal }: AvailableCouponsProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveCoupons() {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('active', true)
          .or(`valid_from.is.null,valid_from.lte.${now}`)
          .or(`valid_to.is.null,valid_to.gte.${now}`)
          .order('min_order_value', { ascending: true });

        if (error) {
          console.error('Error fetching available coupons:', error);
          return;
        }

        setCoupons(data || []);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveCoupons();
  }, []);

  if (loading) {
    return (
      <div className="mt-4 p-4 border rounded-lg border-gray-200 bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1.5">
        <Tag className="w-4 h-4 text-primary" />
        Available Offers
      </h3>
      <div className="space-y-2">
        {coupons.map((coupon) => {
          const isEligible = subtotal >= coupon.min_order_value;
          
          return (
            <div 
              key={coupon.id} 
              className={`p-3 border rounded-lg transition-colors ${
                isEligible 
                  ? 'border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer' 
                  : 'border-gray-200 bg-gray-50 opacity-75'
              }`}
              onClick={() => isEligible && onApply(coupon.code)}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-white border border-dashed border-primary text-primary uppercase">
                  {coupon.code}
                </span>
                {isEligible ? (
                  <button 
                    className="text-xs font-medium text-primary hover:text-primary-dark uppercase"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApply(coupon.code);
                    }}
                  >
                    Apply
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                    Add {formatPrice(coupon.min_order_value - subtotal)} more
                  </span>
                )}
              </div>
              <div className="flex justify-between items-end mt-1">
                <p className="text-xs text-gray-600 max-w-[75%]">
                  Get {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : formatPrice(coupon.discount_value)} off on minimum order of {formatPrice(coupon.min_order_value)}.
                  <br />
                  <span className="text-[10px] text-gray-500 mt-0.5 inline-block">
                    {isEligible ? 'Click to apply.' : 'Add more items to unlock.'}
                  </span>
                </p>
                {coupon.valid_to && (
                  <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                    Till {new Date(coupon.valid_to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
