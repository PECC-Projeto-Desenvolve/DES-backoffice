import { Button, Chip, Dialog, Typography } from '@material-tailwind/react';
import { decryptRightAnswer } from '../../utils';
import { QuestionContainer } from '../ExamComponents/QuestionContainer';

interface Alternative {
    text: string;
    position: number; // Adicionando a propriedade 'position'
  }

interface QuestionPreviewDialogProps {
  open: boolean;
  handler: () => void;
  questionToPreview: {
    title: string;
    statement: string;
    image: string;
    rightAnswer: string;
    alternatives: Alternative[];
  };
}

function QuestionPreviewDialog({ open, handler, questionToPreview }: QuestionPreviewDialogProps) {
  const sortedAlternatives = [...questionToPreview.alternatives].sort((a, b) => a.position - b.position);


  return (
    <Dialog open={open} handler={handler} size='xl' className='p-2'>
      <span className='mb-2 mt-0 flex h-[2rem] w-full items-center justify-end'>
        <Button variant='text' color='red' onClick={handler}>Fechar</Button>
      </span>
      <div className='w-full'>
        <QuestionContainer
          title={questionToPreview.title}
          statement={questionToPreview.statement}
          imageSrc={questionToPreview.image}
          alternativesWrapper={
            <>
              {sortedAlternatives.map((alternative, index) => (
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

      <div className='p-2'>
        <span className='flex items-center gap-2'>
          <Typography variant='h6'>Alternativa correta: </Typography> <Chip color='green' value={decryptRightAnswer(questionToPreview.rightAnswer)}/>
        </span>
      </div>
    </Dialog>
  );
}

export default QuestionPreviewDialog;
