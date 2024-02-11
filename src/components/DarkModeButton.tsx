import { IconButton } from '@material-tailwind/react';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A component that provides a toggle for dark mode on the website. It uses local storage to persist the user's
 * choice across sessions. The toggle is represented by an `IconButton` from Material Tailwind, switching between
 * a moon and sun icon based on the current mode. The button is not rendered on specific routes to avoid interference.
 *
 * @returns {JSX.Element} An IconButton that toggles dark mode on the website. The icon changes based on the current theme.
 * It's hidden on specific paths to prevent displaying the toggle in certain areas of the site.
 */
const DarkModeToggle = () => {
  const location = useLocation();
  const paths = location.pathname;

  const [darkMode, setDarkMode] = React.useState(() => {
    return JSON.parse(localStorage.getItem('darkMode')) || false;
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      { !paths.includes('question/form') && !paths.includes('categories') && !paths.includes('process') && <IconButton onClick={toggleDarkMode} className='bg-blue-200 text-blue-900 dark:bg-yellow-200 dark:text-yellow-900'>
        {darkMode ? ( <Sun /> ) : ( <Moon />)}
      </IconButton>    }
    </>
  );
};

export default DarkModeToggle;
