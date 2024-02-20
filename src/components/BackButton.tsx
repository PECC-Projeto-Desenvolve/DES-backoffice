import { Button } from '@material-tailwind/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Interface for BackButton component props.
 * @typedef {Object} IButtonProps
 * @property {string} [path] - Optional path to navigate to. If not provided, navigates to the previous page.
 */
interface IButtonProps {
    path?: string
}

/**
 * Renders a `BackButton` component.
 * Utilizes Material Tailwind for the button component and Lucide for the icon.
 * Leverages `useNavigate` from `react-router-dom` for navigation functionality.
 * If a path is provided, navigates to that path; otherwise, navigates to the previous page.
 *
 * @param {IButtonProps} props - The properties passed to the component.
 * @returns {JSX.Element} A span element wrapping a Material Tailwind `Button` with a `ChevronLeft` icon and text "Voltar".
 */
function BackButton({path}: IButtonProps) {
  const navigate = useNavigate();

  return (
    <span>
      <Button
        className='flex items-center gap-2 bg-white/10 text-black hover:scale-110 dark:text-white'
        variant='text' size='sm' onClick={() => {
          path ? navigate(path) : navigate(-1);
        }}> <ChevronLeft size={20} /> Voltar</Button>
    </span>
  );
}

export { BackButton };
