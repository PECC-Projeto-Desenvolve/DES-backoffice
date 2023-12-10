import { Button, Card, Typography } from '@material-tailwind/react';
import React from 'react';
import { useParams } from 'react-router-dom';

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
    id: number;
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

  const difficultyColorMap = {
    1: 'border-l-green-400',
    2: 'border-l-orange-400',
    3: 'border-l-red-400',
  };

  React.useEffect(() => {
    if (id) {
      const fullExamId = `exams/${id}`;
      fetchExam(fullExamId);
    }
  }, [id]);

  return (
    <div className='h-full w-full overflow-y-scroll rounded bg-white p-4'>
      <Typography variant='paragraph'>Título da prova:</Typography>
      {exam && <Typography variant='h4'>{exam.title}</Typography>}

      <div className='w-full py-4'>
        <Card
          shadow={false}
          className="cursor-pointer rounded-sm border border-blue-gray-50 p-2"
        >
          <Typography variant="h5" color="blue-gray" className="mb-3 flex items-center gap-3">
            Processos seletivos:
          </Typography>
          <Typography color="blue-gray" className="font-normal opacity-70">
            Esta prova não está associado a nenhum processo seletivo
          </Typography>
        </Card>
      </div>

      <Typography variant='paragraph' className='mt-4'>Questões:</Typography>

      <div className='grid grid-cols-1 gap-2 py-2 md:grid-cols-2 lg:grid-cols-3'>
        {exam && exam.__questions__ && exam.__questions__.map((question, index) => (

          <ul key={index} className={`flex flex-col justify-between rounded-md border-4 border-l-8 bg-white p-2 ${difficultyColorMap[question.difficulty]}`}>
            <span>
              <Typography variant='h6'>{question.title}</Typography>
              <Typography variant='paragraph' className='mt-1 leading-5'>{question.statement}</Typography>
            </span>

            <div className='flex h-fit w-full items-center justify-center '>
              <Button variant='text' size='sm'>Ver questão</Button>
            </div>
          </ul>

        ))}
      </div>
    </div>
  );
}

export { ExamEdit };
