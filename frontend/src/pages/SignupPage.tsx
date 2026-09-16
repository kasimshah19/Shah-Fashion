import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please accept the Terms & Privacy Policy');
      return;
    }

    setLoading(true);
    const ok = await signup(name, email, phone.replace(/\D/g, ''), password);
    setLoading(false);

    if (ok) navigate('/account');
    else setError('Signup failed. Please try again.');
  };

  return (
    <div className="page-container py-8 pb-24 lg:pb-8 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <img src="/branding/logo/shah-fashion-logo.svg" alt="Shah Fashion" className="w-14 h-14 rounded-2xl mx-auto mb-4 shadow-sm" />
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">
            Join Shah Fashion for exclusive offers, order tracking & wishlist
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-brand mt-1 shrink-0"
              />
              <span className="text-sm text-gray-600 leading-snug">
                I agree to Shah Fashion's{' '}
                <Link to="/shipping-returns" className="text-brand hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="/faq" className="text-brand hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <UserPlus size={18} />
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">Login</Link>
        </p>

        <p className="text-center text-sm text-gray-400 mt-3">
          <Link to="/" className="hover:text-brand hover:underline">Continue as guest</Link>
        </p>
      </div>
    </div>
  );
}
