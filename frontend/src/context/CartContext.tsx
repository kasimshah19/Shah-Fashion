import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem, Product } from '../types';
import { getStorage, setStorage } from '../utils/storage';

export interface Coupon {
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
}

type CartAction =
  | { type: 'ADD'; productId: string; quantity?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'TOGGLE_SAVE'; productId: string }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[]; coupon: Coupon | null }
  | { type: 'APPLY_COUPON'; coupon: Coupon }
  | { type: 'REMOVE_COUPON' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(
        (i) => i.productId === action.productId && !i.savedForLater
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.productId && !i.savedForLater
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { productId: action.productId, quantity: action.quantity || 1 }],
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'TOGGLE_SAVE':
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, savedForLater: !i.savedForLater } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'LOAD':
      return { ...state, items: action.items, appliedCoupon: action.coupon };
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.coupon };
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSaveForLater: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: (products: Product[]) => { subtotal: number; discount: number; total: number; couponDiscount: number };
  activeItems: CartItem[];
  savedItems: CartItem[];
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], appliedCoupon: null });

  useEffect(() => {
    dispatch({ 
      type: 'LOAD', 
      items: getStorage<CartItem[]>('sf_cart', []),
      coupon: getStorage<Coupon | null>('sf_coupon', null)
    });
  }, []);

  useEffect(() => {
    setStorage('sf_cart', state.items);
  }, [state.items]);

  useEffect(() => {
    setStorage('sf_coupon', state.appliedCoupon);
  }, [state.appliedCoupon]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    dispatch({ type: 'ADD', productId, quantity });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE', productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', productId, quantity });
  }, []);

  const toggleSaveForLater = useCallback((productId: string) => {
    dispatch({ type: 'TOGGLE_SAVE', productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const applyCoupon = useCallback((coupon: Coupon) => {
    dispatch({ type: 'APPLY_COUPON', coupon });
  }, []);

  const removeCoupon = useCallback(() => {
    dispatch({ type: 'REMOVE_COUPON' });
  }, []);

  const activeItems = state.items.filter((i) => !i.savedForLater);
  const savedItems = state.items.filter((i) => i.savedForLater);
  const cartCount = activeItems.reduce((sum, i) => sum + i.quantity, 0);

  const getCartTotal = useCallback(
    (products: Product[]) => {
      let subtotal = 0;
      let mrpTotal = 0;
      activeItems.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          subtotal += product.discountedPrice * item.quantity;
          mrpTotal += product.price * item.quantity;
        }
      });
      let couponDiscount = 0;
      if (state.appliedCoupon) {
        if (state.appliedCoupon.discount_type === 'percent') {
          couponDiscount = (subtotal * state.appliedCoupon.discount_value) / 100;
        } else {
          couponDiscount = state.appliedCoupon.discount_value;
        }
      }
      return { 
        subtotal, 
        discount: mrpTotal - subtotal, 
        couponDiscount,
        total: Math.max(0, subtotal - couponDiscount) 
      };
    },
    [activeItems, state.appliedCoupon]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSaveForLater,
        clearCart,
        getCartTotal,
        activeItems,
        savedItems,
        appliedCoupon: state.appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
