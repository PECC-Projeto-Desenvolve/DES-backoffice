import React from 'react';
import { Select, Option, Typography, IconButton } from '@material-tailwind/react';
import { CircleDashed, Eye, Trash } from 'lucide-react';

interface IExamSelectionProps {
    exams: Array<{
        id: string;
        title: string;
      }>;
      selectedExam: {
        title: string;
        id: string;
      };
      setSelectedExam: React.Dispatch<React.SetStateAction<{
        title: string;
        id: string;
      }>>;
      selectedExamID: string;
      setSelectedExamID: React.Dispatch<React.SetStateAction<string>>;
      handleFocus: () => void;
  }

function ExamSelection({ exams, selectedExam, selectedExamID, setSelectedExam, setSelectedExamID, handleFocus }: IExamSelectionProps) {
  return (
    <div id="exam-selection" className='transition-all'>
      <Typography variant='lead' className='dark:text-white'>Atribua uma prova para um processo</Typography>

      {selectedExamID ? (
        <div className='flex w-full items-center justify-between rounded-lg border bg-white p-4'>
          <span>
            {!selectedExam.title &&
              <Typography variant='h5' className='flex animate-pulse items-center gap-2'>
                <CircleDashed className='animate-spin'/>
            Carregando
              </Typography>}
            <Typography variant='h5'>{selectedExam.title}</Typography>
            <Typography variant='small'>{selectedExam.id}</Typography>
          </span>

          <span className='flex gap-2'>
            <IconButton color='orange' disabled>
              <Eye />
            </IconButton>
            <IconButton color='red' onClick={() => {
              setSelectedExam({ title: '', id: '' });
              setSelectedExamID('');
            }}>
              <Trash />
            </IconButton>
          </span>
        </div>
      ) : (
        <Select
          label="Provas"
          size='lg'
          onFocus={handleFocus}
          labelProps={{ className: 'dark:text-white text-black' }}
          className='bg-white/80 dark:bg-blue-gray-200/20 '
          onChange={(value) => {
            setSelectedExamID(value);
            fetch(`${import.meta.env.VITE_API_URL}/exams/${value}`)
              .then(response => response.json())
              .then(data => {
                setSelectedExam(data);
              })
              .catch(error => {
                console.error('Erro ao buscar provas:', error);
              });
          }}
        >
          {exams.length === 0 ? (
            <Option disabled>
              <Typography variant='h6'>Carregando...</Typography>
            </Option>
          ) : (
            exams.map((exam, index) => (
              <Option value={exam.id} index={index} key={index} className='mb-2 border'>
                <Typography variant='h6'>{exam.title}</Typography>
              </Option>
            ))
          )}
        </Select>
      )}
    </div>
  );
}

export { ExamSelection };
