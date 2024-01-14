import React from 'react';
import { Typography } from '@material-tailwind/react';
import { BackButton } from '../../components/BackButton';
// import { formatDate } from '../../utils';
import { ExamSelection } from './components/ExamSelection';
import { SimulationSelection } from './components/SimulationSelection';

function Process() {
  const [exams, setExams] = React.useState([]);
  const [selectedExamID, setSelectedExamID] = React.useState('');

  const [selectedExam, setSelectedExam] = React.useState({
    title: '',
    id: '',
  });

  const [selectedSimulationID, setSelectedSimulationID] = React.useState('');
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
            <Typography variant='h4' className='dark:text-white'>Configurar processo</Typography>
          </span>

          <div>

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
      </section>
    </>

  );
}

export { Process };
