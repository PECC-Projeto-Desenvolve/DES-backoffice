import React from 'react';
import {
  Input,
  Textarea,
  Select,
  Typography,
  Button,
} from '@material-tailwind/react';
import { AlternativeInput } from '../../../components/AlternativeInput';
import { useNavigate } from 'react-router-dom';

function ExamForm() {
  const [alternatives, setAlternatives] = React.useState(Array(5).fill(''));
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = value;
    setAlternatives(newAlternatives);
  };

  const formattedAlternatives = alternatives.map(value => `"${value}"`);

  const alternativesString = formattedAlternatives.join(', ');

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='-mt-6 flex h-full w-full flex-col gap-4 rounded bg-white px-4 pt-6 sm:w-full md:w-full lg:w-[50%]'>
        <div className='flex  w-full flex-col gap-4'>

          <Typography variant='h4'>Corpo da prova</Typography>

          <Input label="Título" size='lg'/>

          <Select label="Área de conhecimendo" size='lg' disabled>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </Select>

          <Textarea label='Enunciado' size='lg'/>

        </div>

        <div className='flex w-full flex-col'>
          <Typography variant='h4' className='mb-4'>Alternativas</Typography>

          <div className='flex flex-col gap-4'>
            {['A', 'B', 'C', 'D', 'E'].map((label, index) => (
              <AlternativeInput
                key={label}
                label={label}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>

          <div>
            <h1>
              {alternativesString}
            </h1>
          </div>

          <div className='flex w-full justify-end gap-4'>
            <Button variant='outlined' onClick={handleCancel}>Cancelar</Button>
            <Button>Salvar</Button>
          </div>

        </div>
      </div>
    </div>

  );
}

export { ExamForm };
