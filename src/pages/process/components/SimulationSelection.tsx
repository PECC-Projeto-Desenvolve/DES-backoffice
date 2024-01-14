import React from 'react';
import { Select, Option, Typography, IconButton } from '@material-tailwind/react';
import { CircleDashed, Eye, Trash } from 'lucide-react';

interface ISimulationSelectionProps {
  exams: Array<{
    id: string;
    title: string;
  }>;
  selectedSimulation: {
    title: string;
    id: string;
  };
  setSelectedSimulation: React.Dispatch<React.SetStateAction<{
    title: string;
    id: string;
  }>>;
  selectedSimulationID: string;
  setSelectedSimulationID: React.Dispatch<React.SetStateAction<string>>;
  handleFocus: () => void;
}

function SimulationSelection({exams, selectedSimulation, setSelectedSimulationID, setSelectedSimulation, selectedSimulationID, handleFocus}: ISimulationSelectionProps){
  return (
    <div id='simulation-selection' className='transition-all'>
      <Typography variant='lead' className='dark:text-white'>Atribua um simulado</Typography>
      <Typography variant='small' className='dark:text-white'>O simulado serve para o candidato praticar</Typography>

      {selectedSimulationID ?
        (
          <div className='flex w-full items-center justify-between rounded-lg border bg-white p-4'>
            <span>
              {!selectedSimulation.title &&
              <Typography variant='h5' className='flex animate-pulse items-center gap-2'>
                <CircleDashed className='animate-spin'/>
              Carregando
              </Typography>}
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
        )
        :
        <Select
          label="Simulados"
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
                console.error('Erro ao buscar simulados:', error);
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
      }
    </div>
  );
}

export { SimulationSelection };
