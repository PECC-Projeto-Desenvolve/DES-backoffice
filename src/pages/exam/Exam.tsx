import {
  Typography,
  Button,
} from '@material-tailwind/react';
import { FilePlus2, TextSelect } from 'lucide-react';

import React from 'react';
import { ExamCard } from '../../components/ExamCard';
import { useNavigate } from 'react-router-dom';

function Exam(): JSX.Element {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className='grid h-full grid-cols-2 gap-x-4 rounded-md border border-gray-200 bg-white p-4'>
        <div className='flex w-full flex-col gap-4 overflow-y-scroll rounded-md border border-gray-100 px-2 py-4'>
          <Typography variant="h4">Provas criadas</Typography>

          <div className='relative z-30 flex h-full max-h-full flex-col gap-3'>
            <ExamCard />
            <ExamCard />
            <ExamCard />
            <ExamCard />
          </div>

        </div>
        <div className='flex w-full flex-col gap-4 overflow-y-scroll rounded-md border border-gray-100 px-2 py-4'>
          {/* <Typography variant="h4">Criar prova</Typography> */}
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
    </>
  );
}

export { Exam };
