import React from 'react';
import { Moon, Sun, BrainCircuit, LogOut, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { isDarkMode, setTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-7 w-7 text-primary-600 dark:text-primary-500" />
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            ExamPrep<span className="text-primary-600 dark:text-primary-500">AI</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            ) : (
              <Moon className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            )}
          </button>

          {currentUser && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                )}
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;