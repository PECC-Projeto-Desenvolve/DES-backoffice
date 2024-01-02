import React from 'react';
import { Button, Dialog } from '@material-tailwind/react';
import { QuestionContainer } from '../ExamComponents/QuestionContainer';


interface QuestionPreviewDialogProps {
  open: boolean;
  handler: () => void;
  questionToPreview: {
    title: string;
    statement: string;
    alternatives: { text: string }[];
  };
}

function QuestionPreviewDialog({ open, handler, questionToPreview }: QuestionPreviewDialogProps) {
  return (
    <Dialog open={open} handler={handler} size='xl' className='p-2'>
      <span className='mb-2 mt-0 flex h-[2rem] w-full items-center justify-end'>
        <Button variant='text' onClick={handler}>Fechar</Button>
      </span>
      <div className='w-full'>
        <QuestionContainer
          title={questionToPreview.title}
          statement={questionToPreview.statement}
          alternativesWrapper={
            <>
              {questionToPreview.alternatives.map((alternative, index) => (
                <div key={index} className='flex w-full cursor-pointer items-center gap-3 rounded-md border-2 border-transparent bg-modal-heading px-2 py-3 text-white transition ease-in-out'>
                  <div className='flex h-8 w-8 select-none items-center justify-center rounded-full bg-white text-black'>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <p>{alternative.text}</p>
                </div>
              ))}
            </>
          }
        />
      </div>
    </Dialog>
  );
}

export default QuestionPreviewDialog;