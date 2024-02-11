import { Button, Chip, Dialog, Typography} from '@material-tailwind/react';
import React from 'react';
import { decryptRightAnswer } from '../../utils';
import { QuestionContainer } from '../ExamComponents/QuestionContainer';


interface QuestionPreviewDialogProps {
  open: boolean;
  handler: () => void;
  questionToPreview: number;
}

function QuestionPreviewDialogWithFetch({ open, handler, questionToPreview }: QuestionPreviewDialogProps) {
  const [question, setQuestion] = React.useState({
    title: '',
    statement: '',
    rightAnswer: '',
    alternatives: [],
  });


  const fetchQuestions = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/questions/${id.toString()}`)
      .then(response => response.json())
      .then(data => {

        if(data.alternatives && data.alternatives.length > 0) {
          const sortedAlternatives = data.alternatives.sort((a, b) => a.position - b.position);
          data = {...data, alternatives: sortedAlternatives};
        }
        setQuestion(data);
      })
      .catch(error => console.error('Erro ao buscar questão: ', error));
  };

  React.useEffect(() => {
    if (questionToPreview) {
      fetchQuestions(questionToPreview);
    }
  }, [questionToPreview]);

  return (
    <Dialog open={open} handler={handler} size='xl' className='p-2'>
      <span className='mb-2 mt-0 flex h-[2rem] w-full items-center justify-end'>
        <Button variant='text' color='red' onClick={handler}>Fechar</Button>
      </span>
      <div className='w-full'>
        <QuestionContainer
          title={question.title}
          statement={question.statement}
          alternativesWrapper={
            <>
              {question.alternatives.map((alternative, index) => (
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
          <Typography variant='h6'>Alternativa correta: </Typography> <Chip color='green' value={decryptRightAnswer(question.rightAnswer)}/>
        </span>
      </div>
    </Dialog>
  );
}

export default QuestionPreviewDialogWithFetch;
