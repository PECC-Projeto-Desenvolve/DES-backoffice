import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from '../pages/home/home';
import { Button, Navbar, Typography } from '@material-tailwind/react';
import { LogOut } from 'lucide-react';
import { Exam } from '../pages/exam/Exam';

import {useNavigate} from 'react-router-dom';
import { QuestionForm } from '../pages/forms/questionForm/questionForm';
import { ExamForm } from '../pages/forms/examForm/examForm';
import { Categories } from '../pages/categories/Categories';
import { ExamEdit } from '../pages/examEdit/examEdit';
import {QuestionList } from '../pages/question/QuestionList';
import { DarkModeToggle } from '../components';
import { Process } from '../pages/process/Process';

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

  return (
    <>
      { paths.includes('exam/form') ? (
        <>
          <Routes>
            <Route path='/exam/form' element={<ExamForm />}/>
          </Routes>
        </>
      ) : (
        <div className={'relative flex h-fit min-h-screen w-screen flex-col gap-4 bg-light-background p-4 px-2 transition-colors dark:bg-blue-gray-900 sm:px-2 md:px-8 lg:px-32'}>
          {/* <div className={`bg- relative flex h-screen w-screen flex-col gap-4 p-4 px-2 transition-all sm:px-2 md:px-8 lg:px-32${darkMode ? 'dark' : 'light'}-background`}> */}
          <Navbar fullWidth className='mx-auto flex h-fit items-center justify-between rounded-md bg-white p-4'>
            <Typography variant="h5" color="black" onClick={handleNavigate} className='cursor-pointer transition-all hover:text-2xl'>
          Desenvolve Backoffice
            </Typography>

            <span className='flex items-center gap-2'>
              <DarkModeToggle />
              <Button className="flex items-center gap-4" disabled>
          Sair <LogOut size={18} />
              </Button>
            </span>
          </Navbar>


          <Routes>
            <Route path='/' element={<Home />}/>

            <Route path='/question/form' element={<QuestionForm />}/>
            <Route path='/categories' element={<Categories />}/>
            <Route path='/exam/edit/:id' element={<ExamEdit />}/>
            <Route path='/questions' element={<QuestionList />}/>

            <Route path='/exam' element={<Exam />}/>

            <Route path='/process' element={<Process />}/>
          </Routes>
        </div>
      )}
    </>
  );
}

export { AppRoutes };
