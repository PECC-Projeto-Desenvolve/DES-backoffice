import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

interface ExamCompletionDialogProps {
  open: boolean;
  handler: () => void;
  resetExam: () => void;
}

function ExamCompletionDialog({ open, handler, resetExam }: ExamCompletionDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>Prova criada com sucesso! 🎉</DialogHeader>
      <DialogBody>
        <Typography variant='lead'>
          Você deseja criar outra prova?
        </Typography>
      </DialogBody>
      <DialogFooter className='flex gap-4'>
        <Button variant="text" color="red" onClick={() => navigate(-1)}>
          <span>Não</span>
        </Button>
        <Button variant="gradient" color="green" onClick={resetExam}>
          <span>Sim</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default ExamCompletionDialog;
