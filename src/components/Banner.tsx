import React from 'react';
import { Typography, Card } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';


interface IBannerProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
}

function Banner({ title, description, icon, path }: IBannerProps): JSX.Element {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };


  return (

    <Card
      shadow={false}
      className="cursor-pointer border border-blue-gray-50 px-5 py-4 shadow-xl shadow-transparent transition-all hover:-translate-y-4 hover:border-blue-gray-100/60 hover:shadow-blue-gray-900/5"
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
