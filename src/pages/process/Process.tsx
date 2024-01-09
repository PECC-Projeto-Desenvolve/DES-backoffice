import { Option, Select, Typography } from '@material-tailwind/react';
import React from 'react';
import { BackButton } from '../../components/BackButton';
import { formatDate } from '../../utils';

const apiUrl = import.meta.env.VITE_API_URL;

function Process() {
  const [exams, setExams] = React.useState([]);
  //   const [selectedExam, setSelectedExam] = React.useState('');

  const fetchExams = () => {
    fetch(`${apiUrl}/exams`)
      .then(response => response.json())
      .then(data => setExams(data))
      .catch(error => console.error('Erro ao buscar provas:', error));
  };

  React.useEffect(() => {

  }, []);

  return (
    <>
      <BackButton />

      <div className='col-span-2 h-fit w-full'>
        <Typography variant='h4' className='dark:text-white'>Gestão de Processos</Typography>
      </div>
      <section className='grid h-screen w-full grid-cols-2 gap-4'>
        <div className='h-full w-full'>
          <Typography variant='h4' className='dark:text-white'>Processos em andamento</Typography>
        </div>
        <div className='flex h-full w-full flex-col'>
          <span className='mb-2'>
            <Typography variant='h4' className='dark:text-white'>Cadastrar novo processo</Typography>
            <Typography variant='small' className='dark:text-white'>Atribua uma prova para um processo</Typography>
          </span>


          <Select
            label="Provas"
            size='lg'
            onFocus={() => fetchExams()}
            labelProps={{ className: 'dark:text-white text-black' }}
            className='bg-white/80 dark:bg-blue-gray-200/20'
          >
            {exams.map((exam, index) => (
              <Option value={index.toString()} index={index} key={index} className=' border'>
                <Typography variant='paragraph' className='flex justify-between gap-2 font-bold'>
                  {exam.title} <span className='font-normal'> ( {formatDate(exam.createdAt)} )</span>
                </Typography>
              </Option>
            ))}
          </Select>

        </div>
      </section>
    </>

  );
}

export { Process };
