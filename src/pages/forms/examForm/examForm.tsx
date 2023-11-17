import React from 'react';
import { Typography } from '@material-tailwind/react';
import { QuestionCard } from '../../../components/QuestionCard';

function ExamForm(): JSX.Element {
  return (
    <div className=' grid h-full w-full grid-cols-2 flex-col gap-4 rounded bg-white p-6'>
      <div className='w-full'>
        <Typography variant='h4'>Corpo da prova</Typography>
      </div>

      <div className='h-full w-full '>
        <Typography variant='h4'>Selecione a questão</Typography>

        <div className='relative z-30 mt-2 flex h-full max-h-full flex-col gap-3'>
          <QuestionCard />
          <QuestionCard />
          <QuestionCard />
        </div>
      </div>
    </div>
  );
}

export { ExamForm };
