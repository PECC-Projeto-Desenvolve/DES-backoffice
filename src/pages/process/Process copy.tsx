import React from 'react';
import { IconButton, Option, Select, Typography } from '@material-tailwind/react';
import { BackButton } from '../../components/BackButton';
// import { formatDate } from '../../utils';
import { Eye, Trash } from 'lucide-react';

function Process() {
  const [exams, setExams] = React.useState<any[]>([]);
  const [selectedExamID, setSelectedExamID] = React.useState<string>('');
  const [selectedExam, setSelectedExam] = React.useState({
    title: '',
    id: '',
  });

  const [selectedSimulationID, setSelectedSimulationID] = React.useState<string>('');
  const [selectedSimulation, setSelectedSimulation] = React.useState({
    title: '',
    id: '',
  });

  const handleFocus = () => {
    if (exams.length === 0) {
      fetchExams();
    }
  };

  const fetchExams = () => {

    fetch(`${import.meta.env.VITE_API_URL}/exams`)
      .then(response => response.json())
      .then(data => {
        setExams(data);

      })
      .catch(error => {
        console.error('Erro ao buscar provas:', error);

      });
  };

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
          </span>

          <div className='mb-8'>
            <Typography variant='lead' className='dark:text-white'>Atribua uma prova para um processo</Typography>
            <>
              {selectedExamID ?
                (<>
                  <div className='flex w-full items-center justify-between rounded-lg border bg-white p-4'>
                    <span>
                      <Typography variant='h5'>{selectedExam.title}</Typography>
                      <Typography variant='small'>{selectedExam.id}</Typography>
                    </span>

                    <span className='flex gap-2'>
                      <IconButton color='orange' disabled>
                        <Eye />
                      </IconButton>
                      <IconButton color='red' onClick={() => {
                        setSelectedExam({
                          title: '',
                          id: '',
                        });
                        setSelectedExamID('');
                      }}>
                        <Trash />
                      </IconButton>
                    </span>
                  </div>
                </>)
                :
                <Select
                  label="Provas"
                  size='lg'
                  onFocus={handleFocus}
                  labelProps={{ className: 'dark:text-white text-black' }}
                  className='bg-white/80 dark:bg-blue-gray-200/20'
                  onChange={(value) => {
                    setSelectedExamID(value);

                    fetch(`${import.meta.env.VITE_API_URL}/exams/${value}`)
                      .then(response => response.json())
                      .then(data => {
                        setSelectedExam(data);
                      })
                      .catch(error => {
                        console.error('Erro ao buscar provas:', error);
                      // setIsLoading(false);
                      });
                  }}
                >
                  {exams.map((exam, index) => (
                    <Option value={exam.id} index={index} key={index} className='mb-2 border'>
                      <Typography variant='h6'>{exam.title}</Typography>
                    </Option>
                  ))}
                </Select>
              }
            </>
          </div>

          <div>
            <Typography variant='lead' className='dark:text-white'>Atribua um simulado</Typography>
            <Typography variant='small' className='dark:text-white'>O simulado serve para o candidato praticar</Typography>
            <>
              {selectedSimulationID ?
                (<>
                  <div className='flex w-full items-center justify-between rounded-lg border bg-white p-4'>
                    <span>
                      <Typography variant='h5'>{selectedSimulation.title}</Typography>
                      <Typography variant='small'>{selectedSimulation.id}</Typography>
                    </span>

                    <span className='flex gap-2'>
                      <IconButton color='orange' disabled>
                        <Eye />
                      </IconButton>
                      <IconButton color='red' onClick={() => {
                        setSelectedSimulation({
                          title: '',
                          id: '',
                        });
                        setSelectedSimulationID('');
                      }}>
                        <Trash />
                      </IconButton>
                    </span>
                  </div>
                </>)
                :
                <Select
                  label="Provas"
                  size='lg'
                  onFocus={handleFocus}
                  labelProps={{ className: 'dark:text-white text-black' }}
                  className='bg-white/80 dark:bg-blue-gray-200/20'
                  onChange={(value) => {

                    setSelectedSimulationID(value);

                    fetch(`${import.meta.env.VITE_API_URL}/exams/${value}`)
                      .then(response => response.json())
                      .then(data => {
                        setSelectedSimulation(data);
                      })
                      .catch(error => {
                        console.error('Erro ao buscar provas:', error);
                      });
                  }}
                >
                  {exams.map((exam, index) => (
                    <Option value={exam.id} index={index} key={index} className='mb-2 border'>
                      <Typography variant='h6'>{exam.title}</Typography>
                    </Option>
                  ))}
                </Select>
              }
            </>
          </div>
        </div>
      </section>
    </>

  );
}

export { Process };
