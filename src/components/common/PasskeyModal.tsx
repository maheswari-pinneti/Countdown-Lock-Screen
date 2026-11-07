import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Icon } from './Icon';
import { Button } from './Button';
import { soundEngine } from '../../services/soundEngine';

export const PasskeyModal: React.FC = () => {
  const store = useAppStore();
  const activePasskeyPromptProject = store?.activePasskeyPromptProject;
  const closePasskeyPrompt = store?.closePasskeyPrompt;
  const confirmUnlockProject = store?.confirmUnlockProject;
  const currentUser = store?.currentUser;

  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!activePasskeyPromptProject) return null;

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);
    soundEngine.playKeyClick();

    try {
      if (confirmUnlockProject) {
        const success = await confirmUnlockProject(activePasskeyPromptProject.trackId);
        if (!success) {
          setError('Passkey verification failed. Please try again or re-authenticate.');
        }
      }
    } catch {
      setError('Verification could not be completed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-6"
        style={{
          boxShadow: '0 20px 50px -10px rgba(99, 102, 241, 0.25)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closePasskeyPrompt}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cancel"
        >
          <Icon name="X" className="w-5 h-5" />
        </button>

        {/* Biometric Shield / Passkey Graphic */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-500/20">
              <Icon name="Fingerprint" className="w-10 h-10 text-indigo-300 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
              <Icon name="KeyRound" className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="inline-block text-[11px] font-semibold tracking-wide text-indigo-300 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 mb-1.5">
              Passkey Security Protection
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Unlock {activePasskeyPromptProject.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              This project is protected with biometric and device passkey verification. Confirm your identity to access the workstation.
            </p>
          </div>
        </div>

        {/* Device & Account Info */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
              {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
            </div>
            <div>
              <div className="font-semibold text-white">{currentUser?.name || 'Verified User'}</div>
              <div className="text-[11px] text-slate-400">{currentUser?.email || 'Device Authenticator'}</div>
            </div>
          </div>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Icon name="ShieldCheck" className="w-3 h-3" />
            <span>Passkey Ready</span>
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <Icon name="AlertTriangle" className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            size="md"
            variant="gradient"
            iconLeft="Fingerprint"
            isLoading={isVerifying}
            onClick={handleVerify}
            className="w-full shadow-lg shadow-purple-500/25 py-3"
          >
            {isVerifying ? 'Verifying Device Passkey...' : 'Unlock with Passkey / Face ID'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={closePasskeyPrompt}
            className="w-full text-slate-400 hover:text-white text-xs"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

