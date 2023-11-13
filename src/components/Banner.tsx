import React from "react";
import { Typography, Card } from "@material-tailwind/react";


interface IBannerProps {
    title: string;
    description: string; 
    icon: React.ReactNode;
}

function Banner({ title, description, icon }: IBannerProps): JSX.Element {
    return (
        <a
        href="https://www.material-tailwind.com/docs/react/accordion?ref=template-vite-ts"
        target="_blank"
        rel="noreferrer"
      >
        <Card
          shadow={false}
          className="border border-blue-gray-50 py-4 px-5 shadow-xl shadow-transparent transition-all hover:-translate-y-4 hover:border-blue-gray-100/60 hover:shadow-blue-gray-900/5"
        >
          <Typography variant="h5" color="blue-gray" className="mb-3 flex items-center gap-3">
            {icon}
            {title}
          </Typography>
          <Typography color="blue-gray" className="font-normal opacity-70">
            {description}
          </Typography>
        </Card>
      </a>
    )
}

export { Banner }