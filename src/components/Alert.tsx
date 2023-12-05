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

/**
 * Renders a custom alert component using Material Tailwind and Lucide-React.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.open - Determines if the alert is open or not.
 * @param {boolean} props.success - Determines the type of the alert (success or error).
 * @param {string} [props.customMessage] - Optional additional message for the alert.
 * @param {string} props.successMessage - Message displayed when the alert is of type 'success'.
 * @param {string} props.errorMessage - Message displayed when the alert is of type 'error'.
 * @param {() => void} props.onClose - Function to call when the alert is closed.
 * @returns {React.ReactElement} A styled alert element with an icon, message, and close button.
 */
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
