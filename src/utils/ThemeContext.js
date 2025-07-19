import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    colors: {
      // Background colors
      background: isDarkMode ? '#000000' : '#ffffff',
      cardBackground: isDarkMode ? '#1c1c1e' : '#ffffff',
      sectionBackground: isDarkMode ? '#1c1c1e' : '#ffffff',
      
      // Text colors
      primary: isDarkMode ? '#ffffff' : '#1c1c1e',
      secondary: isDarkMode ? '#98989d' : '#8e8e93',
      accent: '#007AFF',
      
      // Border colors
      border: isDarkMode ? '#38383a' : '#f2f2f7',
      
      // Status bar
      statusBar: isDarkMode ? 'light-content' : 'dark-content',
      
      // Loading and error colors
      loading: isDarkMode ? '#2c2c2e' : '#f2f2f7',
      error: '#ff6b6b',
      
      // Carousel specific
      carouselGradient: isDarkMode 
        ? ['transparent', 'rgba(0,0,0,0.9)'] 
        : ['transparent', 'rgba(0,0,0,0.8)'],
    }
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};