import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { soundEngine } from '../../services/soundEngine';

export const LoginPage: React.FC = () => {
  const { login, loginWithPasskey } = useAppStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    soundEngine.playKeyClick();

    try {
      const res = await login(email, password);
      if (res.success) {
        soundEngine.playSuccessChime();
        navigate('/');
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while signing in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeySignIn = async () => {
    setErrorMessage(null);
    setIsPasskeyLoading(true);
    soundEngine.playKeyClick();

    try {
      const res = await loginWithPasskey(email || undefined);
      if (res.success) {
        soundEngine.playSuccessChime();
        navigate('/');
      } else {
        setErrorMessage(res.error || 'Passkey verification failed. Please try again.');
      }
    } catch {
      setErrorMessage('Passkey authentication could not be completed.');
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    soundEngine.playSuccessChime();
    setIsLoading(true);
    const res = await login('alex@offermode.dev', 'offer2026');
    if (res.success) {
      navigate('/');
    } else {
      setIsLoading(false);
    }
  };

  const handleFillDemoCreds = () => {
    setEmail('alex@offermode.dev');
    setPassword('offer2026');
    setShowForgotModal(false);
    soundEngine.playKeyClick();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 animate-fadeIn">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/25 border border-indigo-400/30 items-center justify-center text-indigo-300 shadow-lg shadow-indigo-500/20 mb-2">
            <Icon name="Target" className="w-6 h-6 text-indigo-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Mahi - Countdown-Screen
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Personal Life, Career & Productivity Command Center
          </p>
        </div>

        {/* Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top subtle gradient highlight */}
          <div className="absolute inset-x-8 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />

          {/* Dual-Tab Header: Sign In vs Create Account */}
          <div className="flex p-1 rounded-2xl bg-slate-950/90 border border-slate-800 mb-6">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
            >
              Sign In
            </button>
            <Link
              to="/signup"
              onClick={() => soundEngine.playKeyClick()}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all text-center"
            >
              Create Account
            </Link>
          </div>

          {/* Instant 1-Click Demo Login */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full mb-5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon name="Sparkles" className="w-4 h-4 text-emerald-400" />
            <span>Instant 1-Click Demo Access</span>
            <Icon name="ArrowRight" className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-900 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Or Sign In With Email
            </span>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <Icon name="AlertTriangle" className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Icon
                  name="Mail"
                  className="w-4 h-4 text-slate-500 absolute left-3.5 top-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Icon
                  name="Lock"
                  className="w-4 h-4 text-slate-500 absolute left-3.5 top-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleFillDemoCreds}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Auto-fill demo credentials
              </button>
            </div>

            <Button
              type="submit"
              size="md"
              variant="gradient"
              isLoading={isLoading}
              className="w-full shadow-lg shadow-purple-500/20 py-2.5 mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Passkey Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-900 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Or Biometric Hardware Passkey
            </span>
          </div>

          {/* Passkey Sign In Option */}
          <button
            type="button"
            onClick={handlePasskeySignIn}
            disabled={isPasskeyLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500/60 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-md group"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Icon name="Fingerprint" className="w-4 h-4" />
            </div>
            <span>{isPasskeyLoading ? 'Authenticating with Passkey...' : 'Sign In with Passkey / Face ID'}</span>
          </button>

          {/* Bottom Switch Link */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Don't have an account yet? </span>
            <Link
              to="/signup"
              onClick={() => soundEngine.playKeyClick()}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Legal & Navigation Footer */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <Link
            to="/terms"
            className="hover:text-slate-300 transition-colors"
          >
            Terms &amp; Conditions
          </Link>
          <span>•</span>
          <Link
            to="/privacy"
            className="hover:text-slate-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            to="/"
            className="hover:text-slate-300 inline-flex items-center gap-1 transition-colors"
          >
            <Icon name="Home" className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Icon name="KeyRound" className="w-4 h-4 text-indigo-400" />
                <span>Account Recovery</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-500 hover:text-white"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              OFFER MODE is local-first. Since passwords are authenticated locally in your browser, you can auto-fill the demo credentials or create a new account to access your workstations.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
              <div>Email: <span className="text-emerald-400">alex@offermode.dev</span></div>
              <div>Password: <span className="text-emerald-400">offer2026</span></div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="gradient"
                size="sm"
                onClick={handleFillDemoCreds}
                className="flex-1 text-xs"
              >
                Auto-fill Credentials
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForgotModal(false)}
                className="text-xs text-slate-400"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
