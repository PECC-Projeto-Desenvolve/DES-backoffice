import {
  Typography,
  Button,
} from '@material-tailwind/react';
import { FilePlus2, TextSelect } from 'lucide-react';

import React from 'react';
import { ExamCard } from '../../components';
import { useNavigate } from 'react-router-dom';

function Exam(): JSX.Element {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);

  const handleClick = (path: string) => {
    navigate(path);
  };

  React.useEffect(() => {
    fetch('http://localhost:3000/exams')
      .then(response => response.json())
      .then(data => setExams(data))
      .catch(error => console.error('Erro ao buscar questões:', error));
  }, []);

  return (
    <>
      <div className='flex h-full w-full flex-col gap-4 overflow-hidden rounded bg-white px-8 py-6 transition-all'>
        <div className='grid h-full w-full grid-cols-2 gap-2 '>
          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border px-2 py-4'>
            <span className='w-full'>
              <Typography variant="h4">Provas criadas</Typography>
            </span>

            <ul className='grid h-full w-full grid-cols-1 gap-2 overflow-y-scroll'>
              {
                exams.map((exam, index) => (
                  <>
                    <ExamCard
                      key={index}
                      title={exam.title}
                      createdAt={exam.createdAt}
                      updatedAt={exam.updatedAt}
                    />
                  </>

                ))
              }
            </ul>
          </div>
          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border px-2 py-4'>
            <div className='flex w-full flex-row-reverse gap-4'>
              <Button className='flex w-fit items-center justify-between gap-4' size='lg' onClick={() => handleClick('/question/form')}>
            Criar questão <TextSelect size={20}/>
              </Button>

              <Button className='flex w-fit items-center justify-between gap-4' size='lg' onClick={() => handleClick('/exam/form')}>
            Criar prova <FilePlus2 size={20}/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Exam };
