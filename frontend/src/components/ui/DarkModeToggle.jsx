import { useTheme } from '../../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

const DarkModeToggle = ({ variant = 'default' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  // Variant styles
  const variants = {
    default: 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200',
    navbar: 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200',
    sidebar: 'p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 w-full flex items-center justify-center',
    button: 'inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200'
  };

  const sizeVariants = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const size = variant === 'sidebar' ? 'large' : 'medium';

  return (
    <button
      onClick={toggleDarkMode}
      className={variants[variant] || variants.default}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {darkMode ? (
        <HiSun className={`${sizeVariants[size]} text-yellow-500 transition-all duration-300 transform hover:rotate-90`} />
      ) : (
        <HiMoon className={`${sizeVariants[size]} text-gray-700 dark:text-gray-300 transition-all duration-300 transform hover:rotate-12`} />
      )}
    </button>
  );
};

export default DarkModeToggle;