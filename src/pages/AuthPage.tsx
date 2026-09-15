import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  Store,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  Check,
  HelpCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STORE_CONFIG } from '../config/store';

export const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, register, loginDemo, logout, isAdmin } = useAuth();

  // Determine initial mode from path (/register vs /login) or search params
  const initialMode =
    location.pathname === '/register' || searchParams.get('mode') === 'register'
      ? 'register'
      : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Sync mode if pathname changes
  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('register');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const redirectUrl = searchParams.get('redirect') || (isAdmin ? '/admin' : '/');

  // Check if query has ?role=admin to prefill admin
  useEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setLoginEmail('admin@generalstore.com');
      setLoginPassword('admin123');
    }
  }, [searchParams]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        // If logging in as admin, prefer /admin unless specific redirect
        if (loginEmail.trim().toLowerCase().includes('admin') && redirectUrl === '/') {
          navigate('/admin');
        } else {
          navigate(redirectUrl);
        }
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Basic validation
    if (!regName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Please enter a valid email address (e.g., name@example.com).');
      return;
    }
    if (!regPassword) {
      setError('Please create a password.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Store Terms & Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      await register(regName.trim(), regEmail.trim(), regPassword, regPhone.trim() || undefined);
      setSuccessMsg(`Account created successfully! Welcome to ${STORE_CONFIG.name}.`);
      setTimeout(() => {
        navigate(redirectUrl);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fast demo credential filler
  const fillDemoCredentials = (role: 'ADMIN' | 'CUSTOMER') => {
    setError(null);
    setMode('login');
    if (role === 'ADMIN') {
      setLoginEmail('admin@generalstore.com');
      setLoginPassword('admin123');
    } else {
      setLoginEmail('customer@example.com');
      setLoginPassword('customer123');
    }
  };

  // 1-Click direct demo sign-in
  const handleDirectDemoLogin = async (role: 'ADMIN' | 'CUSTOMER') => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginDemo(role);
      setSuccessMsg(`Logged in as ${role === 'ADMIN' ? 'Store Administrator' : 'Demo Customer'}! Redirecting...`);
      setTimeout(() => {
        if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate(redirectUrl);
        }
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 transition-all group"
          >
            <Store className="w-7 h-7" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
            {STORE_CONFIG.name}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            {mode === 'login'
              ? 'Sign in to access your orders, saved cart, and account profile'
              : 'Create your account for fast local delivery & order tracking'}
          </p>
        </div>

        {/* If user is already logged in, provide clean account overview */}
        {user ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-black mx-auto mb-4 border-2 border-emerald-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              {user.role === 'ADMIN' ? 'Store Administrator' : 'Store Customer'}
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500 mb-6">{user.email}</p>

            <div className="space-y-2.5">
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Admin Dashboard</span>
                </Link>
              )}
              <Link
                to="/account"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-950/20"
              >
                <User className="w-4 h-4" />
                <span>Go to My Account & Orders</span>
              </Link>
              <Link
                to="/shop"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setSuccessMsg('Logged out successfully.');
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all flex items-center justify-center gap-2 mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Demo Access Bar */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/80 border border-emerald-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Quick Demo Access</span>
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Instant Access
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin('ADMIN')}
                  disabled={loading}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 shadow-xs disabled:opacity-50"
                  title="Direct sign-in as Administrator"
                >
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Portal</span>
                  </span>
                  <span className="text-[9px] text-slate-300 font-normal">
                    admin@generalstore.com
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin('CUSTOMER')}
                  disabled={loading}
                  className="px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 shadow-xs shadow-emerald-950/20 disabled:opacity-50"
                  title="Direct sign-in as Customer"
                >
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Customer Login</span>
                  </span>
                  <span className="text-[9px] text-emerald-100 font-normal">
                    customer@example.com
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                <span>Or autofill:</span>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('ADMIN')}
                  className="underline font-semibold hover:text-emerald-950 transition-colors"
                >
                  Fill Admin
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('CUSTOMER')}
                  className="underline font-semibold hover:text-emerald-950 transition-colors"
                >
                  Fill Customer
                </button>
              </div>
            </div>

            {/* Tab Switcher: Sign In vs Register */}
            <div className="flex bg-slate-200/70 p-1.5 rounded-2xl mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-rose-400 hover:text-rose-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="font-semibold">{successMsg}</div>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              {mode === 'login' ? (
                /* ================= LOGIN FORM ================= */
                <form onSubmit={handleLogin} className="space-y-4.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={loginEmail}
                        onChange={e => {
                          setLoginEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs text-slate-900"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-slate-700">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={e => {
                          setLoginPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs text-slate-900"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                        title={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <span className="text-[11px] text-slate-600 font-medium">
                        Remember this device
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-3 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-3 border-t border-slate-100">
                    <p className="text-slate-500 text-[11px]">
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setError(null);
                        }}
                        className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Register free now
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* ================= REGISTER FORM ================= */
                <form onSubmit={handleRegister} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={regName}
                        onChange={e => {
                          setRegName(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="e.g. Maya Sharma"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs text-slate-900"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={regEmail}
                        onChange={e => {
                          setRegEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs text-slate-900"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Phone Number <span className="text-slate-400 font-normal">(Optional for delivery updates)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="e.g. +977 9762592813"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs text-slate-900"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={regPassword}
                        onChange={e => {
                          setRegPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs text-slate-900"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                        title={showRegPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {regPassword && (
                      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            regPassword.length >= 6 ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          <Check className="w-3 h-3" /> 6+ characters
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={regConfirmPassword}
                        onChange={e => {
                          setRegConfirmPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Re-enter password"
                        className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-xs text-slate-900 ${
                          regConfirmPassword && regPassword !== regConfirmPassword
                            ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                            : regConfirmPassword && regPassword === regConfirmPassword
                            ? 'border-emerald-400 focus:border-emerald-600 bg-emerald-50/20'
                            : 'border-slate-200 focus:border-emerald-600 focus:bg-white'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                        title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {regConfirmPassword && (
                      <p
                        className={`text-[11px] font-semibold mt-1.5 flex items-center gap-1 ${
                          regPassword === regConfirmPassword ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {regPassword === regConfirmPassword ? (
                          <>
                            <Check className="w-3 h-3" /> Passwords match
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" /> Passwords do not match
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={e => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 shrink-0"
                      />
                      <span className="text-[11px] text-slate-600 leading-relaxed">
                        I agree to {STORE_CONFIG.name}'s{' '}
                        <Link to="/about" className="text-emerald-700 font-bold underline">
                          Terms of Service
                        </Link>{' '}
                        and Privacy Policy.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-3 border-t border-slate-100">
                    <p className="text-slate-500 text-[11px]">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setError(null);
                        }}
                        className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Sign in instead
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">Password Recovery</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              For this demo store, all accounts are managed with pre-configured demo credentials or
              you can register a new account instantly.
            </p>

            <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <p className="font-bold text-slate-800">Demo Customer Account:</p>
              <p className="text-slate-600 font-mono text-[11px]">customer@example.com / customer123</p>
              <p className="font-bold text-slate-800 pt-1">Demo Administrator:</p>
              <p className="text-slate-600 font-mono text-[11px]">admin@generalstore.com / admin123</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                fillDemoCredentials('CUSTOMER');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
            >
              Autofill Customer Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
