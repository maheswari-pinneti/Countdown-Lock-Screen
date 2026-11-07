import React, { useState, useEffect } from 'react';

export interface TypewriterProps {
  phrases: string[];
  typingSpeedMin?: number;
  typingSpeedMax?: number;
  pauseDuration?: number;
  deleteSpeed?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
  prefix?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  phrases,
  typingSpeedMin = 45,
  typingSpeedMax = 95,
  pauseDuration = 2200,
  deleteSpeed = 35,
  loop = true,
  className = '',
  cursorClassName = 'text-cyan-400',
  prefix = '',
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[currentPhraseIndex];

    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(waitTimer);
    }

    if (!isDeleting) {
      // Typing mode
      if (displayedText.length < currentPhrase.length) {
        // Natural speed variations: punctuation adds natural pause
        const nextChar = currentPhrase.charAt(displayedText.length);
        const isPunctuation = ['.', ',', '!', '?', '—', '-'].includes(nextChar);
        const naturalDelay = isPunctuation
          ? Math.floor(Math.random() * 200) + 250
          : Math.floor(Math.random() * (typingSpeedMax - typingSpeedMin)) + typingSpeedMin;

        const timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        }, naturalDelay);

        return () => clearTimeout(timer);
      } else {
        // Finished typing full phrase
        if (loop || currentPhraseIndex < phrases.length - 1) {
          setIsWaiting(true);
        }
      }
    } else {
      // Deleting mode
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, deleteSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [
    displayedText,
    isDeleting,
    isWaiting,
    currentPhraseIndex,
    phrases,
    pauseDuration,
    typingSpeedMin,
    typingSpeedMax,
    deleteSpeed,
    loop,
  ]);

  return (
    <span className={`inline-flex items-center font-mono ${className}`} aria-live="polite">
      {prefix && <span className="mr-2 opacity-80">{prefix}</span>}
      <span className="text-white font-bold">{displayedText}</span>
      <span
        className={`inline-block w-2 sm:w-2.5 h-5 ml-1 bg-current animate-pulse ${cursorClassName}`}
        aria-hidden="true"
      />
      {/* Screen reader only full text for accessibility */}
      <span className="sr-only">{phrases[currentPhraseIndex]}</span>
    </span>
  );
};

