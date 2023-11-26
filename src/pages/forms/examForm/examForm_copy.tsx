import React from 'react';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import { QuestionCard } from '../../../components/QuestionCard';
import { AlertTriangle, MinusCircle, PlusCircleIcon, Search } from 'lucide-react';
import { stringResizer } from '../../../utils/StringResizer';

import DND from '../../../assets/dnd-placeholder.svg';
import { useNavigate } from 'react-router-dom';

function ExamForm(): JSX.Element {
  const [questions, setQuestions] = React.useState([]);
  const [questionOrder, setQuestionOrder] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleOnDrag = (e: React.DragEvent, widgetType: string) => {
    e.dataTransfer.setData('widgetType', widgetType);
  };

  const handleOnDrop = (e: React.DragEvent) => {
    const widgetType = e.dataTransfer.getData('widgetType') as string;
    console.log('widgetType', widgetType);
    setQuestionOrder([...questionOrder, widgetType]);
  };

  const handleRemoveQuestion = (indexToRemove) => {
    setQuestionOrder(questionOrder.filter((_, index) => index !== indexToRemove));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpen = () => {
    if (questionOrder.length > 0) {
      setOpen(!open);
    } else if (questionOrder.length === 0) {
      navigate(-1);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  React.useEffect(() => {
    fetch('http://localhost:3000/questions')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Erro ao buscar questões:', error));
  }, []);

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


      <div className='relative grid h-screen w-full grid-cols-2 flex-col gap-4 rounded bg-white p-4'>
        <div className='relative flex h-full w-full flex-col gap-2 overflow-scroll rounded-md border px-2 py-6'>
          <Typography variant='h4'>Corpo da prova</Typography>

          <div
            className='relative flex h-fit max-h-[35rem] w-full flex-col gap-2 overflow-y-scroll rounded-md border p-2 transition-all'
            onDrop={handleOnDrop}
            onDragOver={handleDragOver}
          >
            {questionOrder.length > 0 ? (
              <>

              </>
            ): (
              <div className='flex h-full w-full select-none flex-col items-center gap-4 rounded-md bg-blue-gray-50/50 p-4'>
                <Typography variant='h5'>
                    clique na questão, arraste e solte aqui
                </Typography>
                <img src={DND} className='pointer-events-none select-none'/>
              </div>
            )}
            {questionOrder.map((question, index) => (
              <>
                <div
                  key={index}
                  className='flex animate-fade-in-down select-none items-center justify-between rounded-md border bg-gray-100 p-2'
                >
                  {index}
                  <Typography variant='h6'>
                    {stringResizer(question, 50)}...
                  </Typography>

                  <IconButton onClick={() => handleRemoveQuestion(index)}>
                    <MinusCircle size={20}/>
                  </IconButton>
                </div>

              </>
            ))}
            {questionOrder.length > 0 ? (
              <>
                <Tooltip content="clique na questão, arraste e solte aqui">
                  <div className='flex h-[4rem] w-full flex-col items-center justify-center rounded-sm bg-green-100'>
                    <PlusCircleIcon size={24} />
                  </div>
                </Tooltip>
              </>
            ): (
              <>
              </>
            )}
          </div>
        </div>

        <div className='flex h-full w-full flex-col gap-2 rounded-md border px-2 py-6'>
          <Typography variant='h4' className='mb-2'>Selecione a questão</Typography>

          <Input label={'Buscar'} icon={<Search size={20}/>} size='lg' />
          <div className='relative z-30 mt-2 flex h-full max-h-full flex-col gap-3'>

            {questions.map((question, index) => (
              <>
                <QuestionCard
                  key={index}
                  statement={question.statement}
                  createdAt={question.createdAt}
                  updatedAt={question.updatedAt}
                  onDragStart={(e) => handleOnDrag(e, question.statement)}
                />
              </>
            ))}
          </div>
        </div>
        <div className='col-span-2 -mb-16 flex h-[3rem] w-full items-end justify-end gap-4 rounded-md'>
          <Button variant='outlined' onClick={handleOpen}>Cancelar</Button>
          <Button>Salvar</Button>
        </div>
      </div>
    </>
  );
}

export { ExamForm };
