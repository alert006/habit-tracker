import { useEffect } from 'react';

type Handler = (event: KeyboardEvent) => void;

/**
 * Registers a global key handler, ignoring keystrokes while the user is typing
 * in a text field, textarea, or select so shortcuts never hijack normal input.
 */
export function useKeyboardShortcut(key: string, handler: Handler, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (isTyping) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      handler(event);
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [key, handler, enabled]);
}
