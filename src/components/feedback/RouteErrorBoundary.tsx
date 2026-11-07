import React, { useState } from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertOctagon, RotateCcw, Home, RefreshCw, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const [showDetails, setShowDetails] = useState(false);

  let title = 'Unexpected Application Error';
  let message = 'OFFER MODE encountered a runtime exception. Your saved career countdowns and settings remain preserved in LocalStorage.';
  let statusCode = 500;
  let stackDetails = '';

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = 'Page Not Found';
      message = "The requested workstation or countdown route doesn't exist or has moved.";
    } else {
      title = error.statusText || 'Application Route Exception';
      message = typeof error.data === 'string' ? error.data : JSON.stringify(error.data);
    }
  } else if (error instanceof Error) {
    message = error.message;
    stackDetails = error.stack || '';
  } else if (typeof error === 'string') {
    message = error;
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleResetAndRecover = () => {
    try {
      // Clear session keys that could hold corrupted state
      sessionStorage.clear();
    } catch {
      // Ignore storage errors
    }
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-cyan-400 selection:text-black">
      <div className="max-w-xl w-full p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-red-500/30 shadow-2xl shadow-red-500/10 text-center space-y-6 backdrop-blur-xl">
        {/* Error Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-500/20 via-orange-500/20 to-amber-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
          <AlertOctagon className="w-10 h-10 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border border-red-400 flex items-center justify-center text-[11px] font-black font-mono text-red-300">
            {statusCode}
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider">
            OFFER MODE Recovery Protocol
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        {/* Debug Stack Trace (Collapsible) */}
        {stackDetails && (
          <div className="text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors mx-auto"
            >
              <span>{showDetails ? 'Hide Diagnostics' : 'Show Diagnostics'}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDetails && (
              <div className="mt-3 p-4 rounded-2xl bg-black/80 border border-slate-800 font-mono text-[11px] text-red-300/90 max-h-48 overflow-y-auto overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {stackDetails}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <button
            onClick={handleReload}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <button
            onClick={handleResetAndRecover}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all"
            title="Clear temporary session tokens and return to safety"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>
        </div>

        {/* Local Storage Safety Guarantee */}
        <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local storage state & countdown milestones are preserved securely</span>
        </div>
      </div>
    </div>
  );
};
