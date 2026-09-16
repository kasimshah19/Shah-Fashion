import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PreFooterBanner } from './components/layout/PreFooterBanner';
import { MobileNav } from './components/layout/MobileNav';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { UpdatePrompt } from './components/pwa/UpdatePrompt';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { SearchPage } from './pages/SearchPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import {
  ContactPage,
  ShippingReturnsPage,
  FAQPage,
  SizeGuidePage,
  NotFoundPage,
} from './pages/StaticPages';
import { AboutPage } from './pages/AboutPage';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { OfflineFallback } from './components/pwa/OfflineFallback';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <OfflineFallback />
      <Header />
      <main className="flex-1 w-full overflow-hidden">{children}</main>
      <PreFooterBanner />
      <Footer />
      <MobileNav />
      <WhatsAppButton />
      <PWAInstallPrompt />
      <UpdatePrompt />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="homepage" element={<AdminHomepagePage />} />
                    <Route path="coupons" element={<AdminCouponsPage />} />
                    <Route path="reviews" element={<AdminReviewsPage />} />
                  </Route>
                </Route>

                {/* Storefront Routes */}
                <Route path="/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop/:category" element={<ShopPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/account/*" element={<AccountPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/size-guide" element={<SizeGuidePage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Layout>
                } />
              </Routes>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
