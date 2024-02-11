import { Button } from '@material-tailwind/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a `BackButton` component using Material Tailwind and Lucide icons that navigates to the previous page when clicked.
 * This component utilizes the `useNavigate` hook from `react-router-dom` for navigation.
 *
 * @returns {JSX.Element} A span element wrapping a Material Tailwind `Button` component. The button includes a left-pointing
 * Chevron icon and the text "Voltar". It applies specific styling for appearance and hover effects. When clicked, it navigates
 * the user to the previous page in the browser's history stack.
 */
function BackButton() {
  const navigate = useNavigate();

  return (
    <span>
      <Button className='flex items-center gap-2 bg-white/10 text-black hover:scale-110 dark:text-white' variant='text' size='sm' onClick={() => navigate(-1)}> <ChevronLeft size={20} /> Voltar</Button>
    </span>
  );
}

export { BackButton };
