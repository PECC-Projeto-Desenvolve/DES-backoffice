import React from 'react';
import { Select, Typography, Option, IconButton, Button } from '@material-tailwind/react';
import { BackButton } from '../../components/BackButton';
// import { formatDate } from '../../utils';
import { ExamSelection } from './components/ExamSelection';
import { SimulationSelection } from './components/SimulationSelection';
import { Trash } from 'lucide-react';

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

  const [selectedProcess, setSelectedProcess] = React.useState<string>('');

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

  const handleDisableSaveButton = () => {
    if (selectedProcess && selectedExam && selectedSimulation) {
      return true;
    }
  };

  return (
    <>
      <BackButton />

      <div className='col-span-2 h-fit w-full'>
        <Typography variant='h4' className='dark:text-white'>Gestão de Processos</Typography>
      </div>
      <section className='grid h-[75vh] w-full grid-cols-2 gap-4'>
        <div className='h-full w-full'>
          <Typography variant='h4' className='dark:text-white'>Processos em andamento</Typography>
        </div>

        <div className='relative flex h-full w-full flex-col'>
          <span className='mb-2'>
            <Typography variant='h4' className='dark:text-white'>Configurar processo</Typography>
          </span>

          <div className='flex flex-col gap-6'>
            <div id='process-selection' className='transition-all'>
              <Typography variant='lead' className='dark:text-white'>Selecione um processo</Typography>

              {selectedProcess ? (
                <div className='flex w-full items-center justify-between rounded-lg border bg-white p-4'>
                  <span>
                    <Typography>{selectedProcess}</Typography>
                  </span>

                  <span className='flex gap-2'>
                    <IconButton color='red' onClick={() => {
                      setSelectedProcess('');
                    }}>
                      <Trash />
                    </IconButton>
                  </span>
                </div>

              ): (
                <Select
                  label='Processos'
                  size='lg'
                  labelProps={{ className: 'dark:text-white text-black' }}
                  className='bg-white/80 dark:bg-blue-gray-200/20'
                  onChange={(value) => setSelectedProcess(value)}
                >
                  <Option value='processo'>
                    <Typography>Processo</Typography>
                  </Option>
                </Select>
              )}

            </div>

            <ExamSelection
              exams={exams}
              selectedExam={selectedExam}
              selectedExamID={selectedExamID}
              setSelectedExam={setSelectedExam}
              setSelectedExamID={setSelectedExamID}
              handleFocus={handleFocus}
            />

            <SimulationSelection
              exams={exams}
              selectedSimulation={selectedSimulation}
              selectedSimulationID={selectedSimulationID}
              setSelectedSimulation={setSelectedSimulation}
              setSelectedSimulationID={setSelectedSimulationID}
              handleFocus={handleFocus}
            />
          </div>

          <div id='footer' className='absolute bottom-0 mt-16 flex w-full items-end justify-end'>
            <Button
              color='green'
              disabled={
                !handleDisableSaveButton()
              }
              className=""
            >Salvar</Button>
          </div>
        </div>


      </section>
    </>

  );
}

export { Process };
