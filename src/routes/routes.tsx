import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Button, Navbar, Typography } from '@material-tailwind/react';
import { LogOut } from 'lucide-react';
import { DarkModeToggle } from '../components';
import PrivateRoute from './auth';

import { QuestionForm } from '../pages/forms/questionForm/questionForm';
import { ExamForm } from '../pages/forms/examForm/examForm';
import { Categories } from '../pages/categories/Categories';
import { ExamEdit } from '../pages/examEdit/examEdit';
import {QuestionList } from '../pages/question/QuestionList';
import { Process } from '../pages/process/Process';
import Candidates from '../pages/candidates/Candidates';
import CadidateDetails from '../pages/candidates/details/CadidateDetails';
import Login from '../pages/login/Login';
import RedirectComponent from '../components/RedirectComponent';
import { Home } from '../pages/home/home';
import { Exam } from '../pages/exam/Exam';

function AppRoutes(): JSX.Element {
  const location = useLocation();
  const paths = location.pathname;

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  React.useEffect(() => {
    localStorage.getItem;
  }, []);

  const handleExit = () => {
    localStorage.removeItem('authenticated');
    navigate('/login');
  };

  return (
    <>
      { paths.includes('exam/form') || paths.includes('/login') ? (
        <>
          <Routes>
            <Route path='/exam/form' element={<ExamForm />}/>
            <Route path='/login' element={<Login />}/>
          </Routes>
        </>
      ) : (
        <div className={'relative flex h-fit min-h-screen w-screen flex-col gap-4 bg-light-background p-4 px-2 transition-colors dark:bg-blue-gray-900 sm:px-2 md:px-8 lg:px-32'}>
          <Navbar fullWidth className='mx-auto flex h-fit items-center justify-between rounded-md bg-white p-4'>
            <Typography variant="h5" color="black" onClick={handleNavigate} className='cursor-pointer transition-all hover:text-2xl'>
          Desenvolve Backoffice
            </Typography>

            <span className='flex items-center gap-2'>
              <DarkModeToggle />
              <Button className="flex items-center gap-4" color='red' onClick={() => handleExit()}>
          Sair <LogOut size={18} />
              </Button>
            </span>
          </Navbar>


          <Routes>
            <Route path='/' element={<RedirectComponent />} />
            <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path='/question/form' element={<PrivateRoute><QuestionForm /></PrivateRoute>} />
            <Route path='/categories' element={<PrivateRoute><Categories /></PrivateRoute>} />
            <Route path='/exam/edit/:id' element={<PrivateRoute><ExamEdit /></PrivateRoute>} />
            <Route path='/questions' element={<PrivateRoute><QuestionList /></PrivateRoute>} />
            <Route path='/exam' element={<PrivateRoute><Exam /></PrivateRoute>} />
            <Route path='/process' element={<PrivateRoute><Process /></PrivateRoute>} />
            <Route path='/candidates' element={<PrivateRoute><Candidates /></PrivateRoute>} />
            <Route path='/candidate/:id' element={<PrivateRoute><CadidateDetails /></PrivateRoute>} />
          </Routes>
        </div>
      )}
    </>
  );
}

export { AppRoutes };
