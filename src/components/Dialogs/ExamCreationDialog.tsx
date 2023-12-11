import React from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select, Option, Chip, Typography } from '@material-tailwind/react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamCreationDialogProps {
    open: boolean;
    examTitle: string;
    setExamTitle: (title: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handler: () => void;
  }

function ExamCreationDialog({ open, examTitle, setExamTitle, onSubmit, handler }: ExamCreationDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} handler={handler} size='md'>
      <form onSubmit={onSubmit}>
        <DialogHeader className='-mb-4'>Criação de prova</DialogHeader>
        <DialogBody>
          <Typography className='mb-4'>
            Seja bem vindo(a) à criação
          </Typography>
          <div className='flex flex-col gap-2'>
            <Input
              label={'Título'}
              icon={<Search size={20}/>}
              size='lg'
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />
            <Select label="Nível da prova" size='lg' disabled>
              <Option>
                <Chip value="Fácil" className='w-fit' color='green'/>
              </Option>
              <Option>
                <Chip value="Médio" className='w-fit' color='orange'/>
              </Option>
              <Option>
                <Chip value="Difícil" className='w-fit' color='red'/>
              </Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => navigate(-1)} className="mr-3">
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" type='submit' color="green" disabled={examTitle === ''}>
            <span>Avançar</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default ExamCreationDialog;
