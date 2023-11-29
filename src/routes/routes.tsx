import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from '../pages/home/home';
import { Button, Navbar, Typography } from '@material-tailwind/react';
import { LogOut } from 'lucide-react';
// import { ExamForm } from '../pages/forms/questionForm/questionForm';
import { Exam } from '../pages/exam/Exam';

import {useNavigate} from 'react-router-dom';
import { QuestionForm } from '../pages/forms/questionForm/questionForm';
import { ExamForm } from '../pages/forms/examForm/examForm';

function AppRoutes(): JSX.Element {
  const location = useLocation();
  const paths = location.pathname;

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <>
      { paths.includes('exam/form') ? (
        <>
          <Routes>
            <Route path='/question/form' element={<QuestionForm />}/>
            <Route path='/exam/form' element={<ExamForm />}/>
            {/* <Route path='/exam/form' element={
              <StrictMode>
                <DragDropList />
              </StrictMode>
            }/> */}

          </Routes>
        </>
      ) : (
        <div className="relative flex h-screen w-screen flex-col gap-4 bg-blue-gray-50 p-4 px-2 transition-all sm:px-2 md:px-8 lg:px-32">
          <Navbar fullWidth className='mx-auto flex h-fit items-center justify-between rounded-md p-4'>
            <Typography variant="h5" color="black" onClick={handleNavigate} className='cursor-pointer transition-all hover:text-2xl'>
          Desenvolve Backoffice {paths}
            </Typography>

            <Button className="flex items-center gap-4">
          Sair <LogOut size={20} />
            </Button>
          </Navbar>


          <Routes>
            <Route path='/' element={<Home />}/>

            <Route path='/question/form' element={<QuestionForm />}/>
            {/* <Route path='/exam/form' element={<ExamForm />}/> */}

            <Route path='/exam' element={<Exam />}/>
          </Routes>
        </div>
      )}
    </>
  );
}

export { AppRoutes };
