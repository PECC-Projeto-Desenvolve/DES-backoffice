import { Dialog, DialogHeader, DialogFooter, Button } from '@material-tailwind/react';
import DNDHelper from '../../assets/gifs/drag-n-drop-helper.gif';

interface HelpDialogProps {
  open: boolean;
  handler: () => void;
}

function HelpDialog({ open, handler }: HelpDialogProps) {
  return (
    <Dialog open={open} handler={handler} size='lg'>
      <DialogHeader>Tutorial</DialogHeader>
      <div className='flex w-full items-center justify-center py-6'>
        <img src={DNDHelper} className='rounded-lg border'/>
      </div>
      <DialogFooter>
        <Button variant="gradient" color="green" onClick={handler}>
          <span>OK</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default HelpDialog;
