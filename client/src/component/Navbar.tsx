import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'bg-dark navbar-dark' : 'bg-light navbar-light'}`}>
      <div className="container-fluid">
        <span className="navbar-brand">Astromoney</span>
        <button
          className="btn btn-outline-primary"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
