import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithOtp, sendOtp } = useAuth();
  const [mode, setMode] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/account');
    else setError('Invalid email or password');
  };

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    await sendOtp(phone);
    setOtpSent(true);
    setLoading(false);
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await loginWithOtp(phone, otp);
    setLoading(false);
    if (ok) navigate('/account');
    else setError('Invalid OTP. Demo OTP: 123456');
  };

  return (
    <div className="page-container py-8 pb-24 lg:pb-8 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <img src="/shah-fashion-main-logo.svg" alt="Shah Fashion" className="w-14 h-14 rounded-2xl mx-auto mb-4 shadow-sm" />
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">
            Login to track orders, wishlist & saved addresses
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          {/* Login method tabs */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => { setMode('email'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-medium min-h-[44px] ${mode === 'email' ? 'bg-brand text-white' : 'bg-white text-gray-600'}`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setMode('otp'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-medium min-h-[44px] ${mode === 'otp' ? 'bg-brand text-white' : 'bg-white text-gray-600'}`}
            >
              Mobile OTP
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {mode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                <LogIn size={18} />
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="input-field w-16 shrink-0 text-center text-gray-500 bg-gray-50">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    className="input-field flex-1"
                  />
                </div>
              </div>
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={phone.length < 10 || loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              ) : (
                <>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="6-digit OTP (demo: 123456)"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      className="input-field"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="text-sm text-brand hover:underline w-full text-center"
                  >
                    Change number
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand font-medium hover:underline">Sign Up</Link>
        </p>

        <p className="text-center text-sm text-gray-400 mt-3">
          <Link to="/" className="hover:text-brand hover:underline">Continue as guest</Link>
        </p>
      </div>
    </div>
  );
}
