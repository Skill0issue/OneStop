import { createContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  theme: boolean;
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: false,
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<boolean>(true); // true is light theme and false is dark theme

  useEffect(() => {
    const root = document.documentElement;
    const root1 = document.getElementById("root");
    if (!theme) {
      root.classList.add("dark");
      root1?.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root1?.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
