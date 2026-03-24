'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'simple' | 'bright';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'simple',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('simple');

  useEffect(() => {
    const stored = localStorage.getItem('driver-theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('driver-theme', theme);
    document.documentElement.className = theme; // Apply theme class to <html>
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};