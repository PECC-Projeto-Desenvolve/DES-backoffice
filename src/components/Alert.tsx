import React from 'react';
import { Alert, Button } from '@material-tailwind/react';
import { Check, AlertTriangle } from 'lucide-react';

interface ICustomAlertProps {
    open: boolean;
    success: boolean;
    customMessage?: string;
    successMessage: string;
    errorMessage: string;
    onClose: () => void;
  }

function CustomAlert({ open, success, onClose, customMessage, successMessage, errorMessage }: ICustomAlertProps) {
  return (
    <Alert
      open={open}
      color={success ? 'green' : 'red'}
      className='shadow-2xl'
      icon={success ? <Check /> : <AlertTriangle />}
      animate={{ mount: { y: 0 }, unmount: { y: 100 } }}
      action={
        <Button
          variant="text"
          color="white"
          size="sm"
          className="!absolute right-3 top-3"
          onClick={onClose}
        >
          Fechar
        </Button>
      }
    >
      {success ? successMessage : errorMessage}
      {customMessage ? (
        <>
          <ul className="ml-2 mt-2 list-inside list-disc">
            <li>{customMessage}</li>
          </ul>
        </>
      ): (
        <></>
      )}
    </Alert>
  );
}

export { CustomAlert };
