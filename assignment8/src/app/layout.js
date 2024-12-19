"use client";  

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import useThemeStore from './themeStore';
import { useEffect } from "react";
import { Sun, Moon } from 'react-feather';  

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const { theme, toggleTheme } = useThemeStore();  
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <html lang="en">
      <body className="transition-all duration-300">
      <header className="flex justify-end p-4">
          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-info flex items-center gap-2" // Add gap and flex for icons
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} />  
              </>
            ) : (
              <>
                <Sun size={16} />  
              </>
            )}
          </button>
        </header>
        {children}
      </body>
    </html>
  );
}
