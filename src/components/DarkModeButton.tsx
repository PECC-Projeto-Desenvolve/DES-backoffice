import { IconButton } from '@material-tailwind/react';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

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
