import React, { useState } from 'react';
import { Icon } from './Icon';
import { soundEngine } from '../../services/soundEngine';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'support' | 'feature' | 'consulting' | 'feedback'>('feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!message.trim() || message.length < 10) {
      setError('Please enter a message with at least 10 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    soundEngine.playKeyClick();

    // Persist contact message locally in localStorage
    setTimeout(() => {
      try {
        const existingRaw = localStorage.getItem('offer_mode_contact_messages');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push({
          id: Date.now().toString(),
          name: name.trim(),
          email: email.trim(),
          category,
          message: message.trim(),
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('offer_mode_contact_messages', JSON.stringify(existing));
      } catch {}

      setIsSubmitting(false);
      setSubmitted(true);
      soundEngine.playSuccessChime();

      if (onSubmitSuccess) onSubmitSuccess();

      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setMessage('');
        onClose();
      }, 2200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090D1A] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] text-slate-100">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playKeyClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          aria-label="Close dialog"
        >
          <Icon name="X" className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-scaleUp">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Icon name="CheckCircle2" className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Transmission Received</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Your inquiry has been logged securely in local dispatch. Our career architecture team will review your message.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  Direct Channel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Contact & Executive Inquiry
              </h2>
              <p className="text-xs text-zinc-400">
                Submit feature suggestions, technical bug reports, or bespoke career consulting queries.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <Icon name="AlertCircle" className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase font-mono mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060913] border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase font-mono mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060913] border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase font-mono mb-1">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(['feedback', 'feature', 'support', 'consulting'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-2.5 rounded-xl border capitalize font-semibold transition-all text-center ${
                      category === cat
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-[#060913] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-zinc-300 uppercase font-mono">
                  Message
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {message.length} chars
                </span>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your question, feedback, or custom workstation requirement..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060913] border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

