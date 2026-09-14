import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Address, Order } from '../types';
import { getStorage, setStorage } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  addOrder: (order: Order) => void;
  sendOtp: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_OTP = '123456';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setUser(getStorage<User | null>('sf_user', null));
    setOrders(getStorage<Order[]>('sf_orders', []));
  }, []);

  useEffect(() => {
    setStorage('sf_user', user);
  }, [user]);

  useEffect(() => {
    setStorage('sf_orders', orders);
  }, [orders]);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const existing = getStorage<User | null>('sf_user', null);
    if (existing && existing.email === email) {
      setUser(existing);
      return true;
    }
    const demoUser: User = {
      id: 'user-1',
      name: 'Demo User',
      email,
      phone: '9876543210',
      addresses: [],
    };
    setUser(demoUser);
    return true;
  }, []);

  const sendOtp = useCallback(async (_phone: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    return true;
  }, []);

  const loginWithOtp = useCallback(async (phone: string, otp: string) => {
    await new Promise((r) => setTimeout(r, 800));
    if (otp !== DEMO_OTP) return false;
    const demoUser: User = {
      id: 'user-1',
      name: 'Demo User',
      email: 'demo@shahfashion.com',
      phone,
      addresses: [],
    };
    setUser(demoUser);
    return true;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, phone: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 800));
      const newUser: User = { id: `user-${Date.now()}`, name, email, phone, addresses: [] };
      setUser(newUser);
      return true;
    },
    []
  );

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newAddr: Address = { ...address, id: `addr-${Date.now()}` };
      return { ...prev, addresses: [...prev.addresses, newAddr] };
    });
  }, []);

  const updateAddress = useCallback((id: string, data: Partial<Address>) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map((a) => (a.id === id ? { ...a, ...data } : a)),
      };
    });
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) };
    });
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isAuthenticated: !!user,
        login,
        loginWithOtp,
        signup,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        addOrder,
        sendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
