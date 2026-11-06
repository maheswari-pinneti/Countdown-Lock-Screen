import { useEffect } from 'react';

export interface HotkeyMap {
  [key: string]: (e: KeyboardEvent) => void;
}

export function useHotkeys(keyMap: HotkeyMap, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when the user is typing in inputs or textareas
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      const handler = keyMap[e.key] || keyMap[e.key.toLowerCase()] || keyMap[e.code];
      if (handler) {
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyMap, enabled]);
}

