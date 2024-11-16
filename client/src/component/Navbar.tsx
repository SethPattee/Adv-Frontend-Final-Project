import type React from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gray-800 text-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Astromoney</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <a
              href="/"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Home
            </a>
            <a
              href="/customize-profile"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Customize Profile
            </a>
          </div>
          <div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-md bg-yellow-500 text-gray-900 dark:bg-yellow-300"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
