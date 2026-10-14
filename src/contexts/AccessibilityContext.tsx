import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityState {
  darkMode: boolean;
  highContrast: boolean;
  voiceNav: boolean;
  colorblindFilter: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  dyslexiaFont: boolean;
  readingGuide: boolean;
  readingMask: boolean;
  neonmap: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  toggle: (key: keyof AccessibilityState) => void;
  setColorblindFilter: (filter: AccessibilityState['colorblindFilter']) => void;
  mouseY: number;
}

const defaultState: AccessibilityState = {
  darkMode: false,
  highContrast: false,
  voiceNav: false,
  colorblindFilter: 'none',
  dyslexiaFont: false,
  readingGuide: false,
  readingMask: false,
  neonmap: false,
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  ...defaultState,
  toggle: () => {},
  setColorblindFilter: () => {},
  mouseY: 0,
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(() => {
    try {
      const saved = localStorage.getItem('eyeterra-a11y');
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    localStorage.setItem('eyeterra-a11y', JSON.stringify(state));
    const root = document.documentElement;
    if (state.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (state.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    if (state.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
    root.classList.remove('colorblind-deuteranopia', 'colorblind-protanopia', 'colorblind-tritanopia');
    if (state.colorblindFilter !== 'none') {
      root.classList.add(`colorblind-${state.colorblindFilter}`);
    }
  }, [state]);

  useEffect(() => {
    if (!state.readingGuide && !state.readingMask) return;
    const handleMouseMove = (e: MouseEvent) => setMouseY(e.clientY);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state.readingGuide, state.readingMask]);

  const toggle = (key: keyof AccessibilityState) => {
    if (key === 'colorblindFilter') return;
    setState(prev => ({ ...prev, [key]: !prev[key as keyof typeof defaultState] }));
  };

  const setColorblindFilter = (filter: AccessibilityState['colorblindFilter']) => {
    setState(prev => ({ ...prev, colorblindFilter: filter }));
  };

  return (
    <AccessibilityContext.Provider value={{ ...state, toggle, setColorblindFilter, mouseY }}>
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      {children}
      {state.readingGuide && (
        <div
          className="pointer-events-none fixed left-0 right-0 z-50 transition-transform duration-75"
          style={{
            top: mouseY,
            height: '3px',
            background: 'hsl(210 100% 55%)',
            boxShadow: '0 0 6px 2px hsl(210 100% 65% / 0.5)',
          }}
          aria-hidden="true"
        />
      )}
      {state.readingMask && (
        <div
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(10,10,10,0.78) 0px,
              rgba(10,10,10,0.78) ${mouseY - 28}px,
              transparent ${mouseY - 28}px,
              transparent ${mouseY + 28}px,
              rgba(10,10,10,0.78) ${mouseY + 28}px,
              rgba(10,10,10,0.78) 100%
            )`,
          }}
          aria-hidden="true"
        />
      )}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
