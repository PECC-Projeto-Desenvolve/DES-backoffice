import { Card, Typography } from '@material-tailwind/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import { GripVertical } from 'lucide-react';
import { stringResizer } from '../../utils';

interface Exam {
    id: string;
    title: string;
    startAt: string | null;
    endsAt: string | null;
    difficulty: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    __questions__: Question[];
  }

  interface Question {
    id: number | string;
    title: string;
    statement: string;
    rightAnswer: string;
    difficulty: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

function ExamEdit() {
  const [exam, setExam] = React.useState<Exam | null>(null);

  const { id } = useParams();


  const fetchExam = (examId: string) => {
    fetch(`http://localhost:3000/${examId}`)
      .then(response => response.json())
      .then(data => setExam(data as Exam))
      .catch(error => console.error('Erro ao buscar questões:', error));
  };

  React.useEffect(() => {
    if (id) {
      const fullExamId = `exams/${id}`;
      fetchExam(fullExamId);
    }
  }, [id]);

  return (
    <>
      <BackButton/>
      <div className='-mt-6 h-full w-full overflow-y-scroll rounded p-4'>
        <Typography variant='paragraph' className='dark:text-white'>Título da prova:</Typography>
        {exam && <Typography variant='h4' className='dark:text-white'>{exam.title}</Typography>}

        <div className='w-full py-4'>
          <Card
            shadow={false}
            className="cursor-pointer rounded-sm border border-blue-gray-50 p-2 dark:border-blue-gray-700 dark:bg-white/10"
          >
            <Typography variant="h5" color="blue-gray" className="mb-3 flex items-center gap-3 dark:text-white">
            Processos seletivos:
            </Typography>
            <Typography color="blue-gray" className="font-normal opacity-70 dark:text-white">
            Esta prova não está associado a nenhum processo seletivo
            </Typography>
          </Card>
        </div>

        <Typography variant='paragraph' className='mt-2 dark:text-white'>Questões:</Typography>

        <div className='grid w-[50%] grid-cols-1 gap-2 py-2 md:grid-cols-1'>
          {exam && exam.__questions__ && exam.__questions__.map((question, index) => (
            <li
              key={index}
              //   className={'-z-50 mb-2 flex animate-fade-in-down select-none items-center justify-between rounded-md border border-l-[0.8rem] border-l-green-400 bg-[#fafafa] px-1 py-1 pr-2 transition-shadow active:shadow-xl'}
              className='mb-1 flex animate-fade-in-down select-none items-center justify-between rounded-md border border-l-[0.6rem] border-l-green-400 bg-[#fafafa] px-1 py-1 pr-2 transition-shadow active:shadow-xl'
            >
              <div className='m-1 -ml-1 flex h-full cursor-grab items-center rounded-sm p-1 py-2 hover:bg-gray-200 active:cursor-grabbing active:bg-gray-300'
              >
                <GripVertical />
              </div>
              <p className='flex h-6 w-6 items-center justify-center rounded-full bg-black p-2 text-sm text-white'>{index + 1}</p>

              <div className='mx-2 w-full'>
                <Typography variant='h6'>
                  {question.statement.length > 49 ? (`${stringResizer(question.statement, 50)} ...`) : (question.statement)}
                </Typography>
              </div>
            </li>
          ))}
        </div>
      </div>
    </>
  );
}

export { ExamEdit };
