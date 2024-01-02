import { IconButton } from '@material-tailwind/react';
import { Moon, Sun } from 'lucide-react';
import React from 'react';

const DarkModeToggle = () => {
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
    <IconButton onClick={toggleDarkMode}>
      {darkMode ? ( <Sun /> ) : ( <Moon />)}
    </IconButton>
  );
};

export default DarkModeToggle;
