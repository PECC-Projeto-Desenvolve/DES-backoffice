import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from '@material-tailwind/react';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface IExitConfirmationDialogProps {
    open: boolean;
    handleOpen: () => void;
    handleBack: () => void;
}

function ExitConfirmationDialog({ open, handleOpen, handleBack }: IExitConfirmationDialogProps) {
  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="flex flex-row gap-2">
          <AlertTriangle color='red'/>
          <Typography variant='h4' color='red'>
            Você possui alterações não salvas
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant='lead'>
          Você possui alterações não salvas nesta página. Se você sair agora, todas as alterações feitas serão perdidas.
          </Typography>

          <Typography variant='lead' className='mt-4'>
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
    </>
  );
}

export default ExitConfirmationDialog;
