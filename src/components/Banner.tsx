import React from 'react';
import { Typography, Card } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

interface IBannerProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    path?: string;
    rounded?: string;
    disabled?: boolean;
}

/**
 * Renders a `Banner` component that is optionally clickable, leading to a specified route when not disabled.
 * This component uses Material Tailwind for styling and layout, and integrates with React Router for optional navigation.
 *
 * @param {IBannerProps} props - The properties passed to the Banner component.
 * @param {string} props.title - The title text to be displayed in the banner.
 * @param {string} props.description - The description text to be displayed below the title.
 * @param {React.ReactNode} props.icon - An icon displayed next to the title.
 * @param {string} [props.path] - The navigation path to redirect to when the banner is clicked. Optional.
 * @param {string} [props.rounded] - Additional tailwind classes for customizing the border radius. Optional.
 * @param {boolean} [props.disabled] - If true, the banner is not clickable and appears disabled. Optional.
 * @returns {JSX.Element} A Material Tailwind `Card` component, conditionally wrapped in a clickable area if not disabled.
 */
function Banner({ title, description, icon, path, rounded, disabled}: IBannerProps): JSX.Element {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <>
      {disabled ? (
        <>
          <Card
            shadow={false}
            className={`select-none border border-blue-gray-50/50 bg-blue-gray-100/50 px-5 py-4 shadow-xl shadow-transparent dark:bg-white/40 ${rounded}`}
          >
            <Typography variant="h5" className="mb-3 flex items-center gap-3 text-black/70 dark:text-white">
              {icon}
              {title}
            </Typography>
            <Typography className="font-normal opacity-70 dark:text-white">
              {description}
            </Typography>
          </Card></>
      ) : (
        <>
          <Card
            shadow={false}
            className={`cursor-pointer select-none border border-blue-gray-50 bg-white px-5 py-4 shadow-xl shadow-transparent transition-all hover:-translate-y-2 hover:border-blue-gray-100/60 hover:shadow-blue-gray-900/5 ${rounded}`}
            onClick={handleClick}
          >
            <Typography variant="h5" color="blue-gray" className="mb-3 flex items-center gap-3">
              {icon}
              {title}
            </Typography>
            <Typography color="blue-gray" className="font-normal opacity-70">
              {description}
            </Typography>
          </Card>
        </>
      )}</>
  );
}

export { Banner };
