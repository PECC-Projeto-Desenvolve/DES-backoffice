import { Button } from '@material-tailwind/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <span>
      <Button className='flex items-center gap-2 bg-white/10 text-black hover:scale-110 dark:text-white' variant='text' size='sm' onClick={() => navigate(-1)}> <ChevronLeft size={20} /> Voltar</Button>
    </span>
  );
}

export { BackButton };
