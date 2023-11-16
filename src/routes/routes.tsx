import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/home/home';
import { Button, Navbar, Typography } from '@material-tailwind/react';
import { LogOut } from 'lucide-react';
import { ExamForm } from '../pages/forms/examForm/examForm';
import { Exam } from '../pages/exam/Exam';

function AppRoutes(): JSX.Element {
  return (
    <div className="relative flex h-screen w-screen flex-col gap-10 bg-blue-gray-50 p-8 px-2 sm:px-2 md:px-8 lg:px-32">
      <Navbar fullWidth className='mx-auto flex h-fit items-center justify-between rounded-md p-4'>
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

        <Route path='/exam' element={<Exam />}/>
      </Routes>
    </div>
  );
}

export { AppRoutes };
