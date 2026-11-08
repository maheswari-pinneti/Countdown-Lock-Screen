import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { soundEngine } from '../../services/soundEngine';

export const SignupPage: React.FC = () => {
  const { signup } = useAppStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerPasskey, setRegisterPasskey] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 20, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 3) return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score <= 4) return { score: 75, label: 'Good', color: 'bg-cyan-500', text: 'text-cyan-400' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage('Please read and agree to the Terms & Conditions and Privacy Policy to proceed.');
      soundEngine.playKeyClick();
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    soundEngine.playKeyClick();

    try {
      const res = await signup(name, email, password, registerPasskey);
      if (res.success) {
        soundEngine.playSuccessChime();
        navigate('/');
      } else {
        setErrorMessage(res.error || 'Failed to create account. Please check your inputs.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while creating your account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyQuickSignup = async () => {
    const defaultName = name.trim() || 'Focus Specialist';
    const defaultEmail = email.trim() || `user_${Date.now()}@offermode.dev`;
    setIsLoading(true);
    soundEngine.playKeyClick();

    try {
      const res = await signup(defaultName, defaultEmail, 'passkey-protected', true);
      if (res.success) {
        soundEngine.playSuccessChime();
        navigate('/');
      } else {
        setErrorMessage(res.error || 'Passkey setup could not be completed.');
      }
    } catch {
      setErrorMessage('Passkey setup error.');
    } finally {
      setIsLoading(false);
    }
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
            Join Mahi - Countdown-Screen
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Start tracking countdowns, milestones, habits, and secure your command center with passkeys.
          </p>
        </div>

        {/* Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top subtle gradient highlight */}
          <div className="absolute inset-x-8 top-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />

          {/* Dual-Tab Header: Sign In vs Create Account */}
          <div className="flex p-1 rounded-2xl bg-slate-950/90 border border-slate-800 mb-6">
            <Link
              to="/login"
              onClick={() => soundEngine.playKeyClick()}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all text-center"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
            >
              Create Account
            </button>
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
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Taylor Swift"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Icon
                  name="User"
                  className="w-4 h-4 text-slate-500 absolute left-3.5 top-3"
                />
              </div>
            </div>

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
                {password && (
                  <span className={`text-[10px] font-mono font-semibold ${strength.text}`}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

              {/* Password strength bar */}
              {password && (
                <div className="mt-1.5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Confirm Password
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-mono ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {passwordsMatch ? '✓ Passwords Match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-slate-950/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    confirmPassword && !passwordsMatch
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                <Icon
                  name="Check"
                  className={`w-4 h-4 absolute left-3.5 top-3 ${passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}`}
                />
              </div>
            </div>

            {/* Passkey Opt-In Toggle */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registerPasskey}
                  onChange={(e) => setRegisterPasskey(e.target.checked)}
                  className="mt-0.5 rounded border-indigo-400 bg-slate-800 text-indigo-500 focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Icon name="Fingerprint" className="w-4 h-4 text-indigo-400" />
                    <span>Register Device Passkey (Recommended)</span>
                  </span>
                  <p className="text-slate-400 mt-0.5 font-normal leading-relaxed text-[11px]">
                    Enable biometric sign-in (Face ID, Touch ID, Windows Hello) and passkey protection for your projects.
                  </p>
                </div>
              </label>
            </div>

            {/* Terms and Conditions Agreement Checkbox */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
                  >
                    Terms &amp; Conditions
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <Button
              type="submit"
              size="md"
              variant="gradient"
              isLoading={isLoading}
              className="w-full shadow-lg shadow-purple-500/20 py-2.5 mt-2"
            >
              Create Account &amp; Unlock Workstations
            </Button>
          </form>

          {/* Instant Passkey Creation alternative */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-900 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Or Instant Passkey Setup
            </span>
          </div>

          <button
            type="button"
            onClick={handlePasskeyQuickSignup}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500/60 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-md group"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Icon name="KeyRound" className="w-4 h-4" />
            </div>
            <span>One-Click Sign Up with Passkey</span>
          </button>

          {/* Bottom Switch Link */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Already registered? </span>
            <Link
              to="/login"
              onClick={() => soundEngine.playKeyClick()}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Sign In
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
    </div>
  );
};
