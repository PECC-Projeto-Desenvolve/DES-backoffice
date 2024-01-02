import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from '@material-tailwind/react';
import { AlertTriangle } from 'lucide-react';

interface IExitConfirmationDialogProps {
    open: boolean;
    handleOpen: () => void;
    handleBack: () => void;
}

/**
 * Renders a confirmation dialog for exiting a page with unsaved changes.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.open - Determines if the dialog is open or not.
 * @param {() => void} props.handleOpen - Function to toggle the dialog's open state.
 * @param {() => void} props.handleBack - Function to execute when choosing to exit without saving.
 * @returns {JSX.Element} A dialog component warning the user about unsaved changes with options to leave or stay on the page.
 */
function ExitConfirmationDialog({ open, handleOpen, handleBack }: IExitConfirmationDialogProps) {
  return (
    <Dialog open={open} handler={handleOpen} className='bg-white dark:bg-modal-bg'>
      <DialogHeader className="flex flex-row gap-2">
        <AlertTriangle color='red'/>
        <Typography variant='h4' color='red'>
            Você possui alterações não salvas
        </Typography>
      </DialogHeader>
      <DialogBody>
        <Typography variant='lead' className='text-blue-gray-800 dark:text-white'>
          Você possui alterações não salvas nesta página. Se você sair agora, todas as alterações feitas serão perdidas.
        </Typography>

        <Typography variant='lead' className='mt-4 text-blue-gray-800 dark:text-white'>
            Tem certeza de que deseja sair sem salvar?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleBack}
          className="mr-4"
        >
          <span>sair sem salvar</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleOpen}>
          <span>Continuar editando</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export { ExitConfirmationDialog };
