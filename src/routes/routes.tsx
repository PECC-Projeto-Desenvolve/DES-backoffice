import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/home/home';
import { Button, Navbar, Typography } from '@material-tailwind/react';
import { LogOut } from 'lucide-react';
import { ExamForm } from '../pages/forms/examForm/examForm';

function AppRoutes(): JSX.Element {
  return (
    <div className="relative h-screen w-screen bg-blue-gray-50 flex flex-col p-8 gap-10 lg:px-32 md:px-8 sm:px-2 px-2">
      <Navbar fullWidth className='rounded-md flex h-fit items-center justify-between mx-auto p-4'>
        <Typography variant="h5" color="black">
          Desenvolve Backoffice
        </Typography>

        <Button className="flex items-center gap-4">
          Sair <LogOut size={20} />
        </Button>
      </Navbar>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/exam/form' element={<ExamForm />}/>
      </Routes>
    </div>
  );
}

export { AppRoutes };
