import React from 'react';
import { Typography, Card } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

interface IBannerProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    rounded?: string;
}

/**
 * Renders a clickable banner component using Material Tailwind, with navigation capabilities using React Router.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Title text of the banner.
 * @param {string} props.description - Description text of the banner.
 * @param {React.ReactNode} props.icon - React node for the icon displayed in the banner.
 * @param {string} props.path - The navigation path to redirect to when the banner is clicked.
 * @returns {JSX.Element} A card component that navigates to a specified path on click.
 */
function Banner({ title, description, icon, path, rounded }: IBannerProps): JSX.Element {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Card
      shadow={false}
      className={`cursor-pointer border border-blue-gray-50 px-5 py-4 shadow-xl shadow-transparent transition-all hover:-translate-y-2 hover:border-blue-gray-100/60 hover:shadow-blue-gray-900/5 ${rounded}`}
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
  );
}

export { Banner };
