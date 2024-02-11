import React from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Typography } from '@material-tailwind/react';
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

  const [isDarkTheme, setIsDarkTheme] = React.useState<boolean>(false);

  React.useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkTheme(darkMode);
  }, []);


  return (
    <Dialog open={open} handler={handler} size='md' className='dark:bg-modal-bg'>
      <form onSubmit={onSubmit}>
        <DialogHeader className='-mb-4 text-black dark:text-white' >Criação de prova</DialogHeader>
        <DialogBody>
          <Typography className='mb-4 text-blue-gray-800 dark:text-blue-gray-100'>
            Seja bem vindo(a) à criação
          </Typography>
          <div className='flex flex-col gap-2'>
            <Input
              crossOrigin={''}
              label={'Título'}
              icon={<Search size={20}/>}
              size='lg'
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              labelProps={{ className: 'dark:text-white text-black' }}
              color={`${isDarkTheme ? 'white' : 'black'}`}
              className='bg-white/80 text-black dark:bg-blue-gray-200/20 dark:text-white'
            />
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
