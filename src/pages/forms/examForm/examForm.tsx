import React from 'react';
import { Button, Dialog, Option, IconButton, Input, Select, Tooltip, Typography, Chip, ButtonGroup } from '@material-tailwind/react';
import { QuestionCard } from '../../../components/QuestionCard';
import { Eraser, Eye, GripVertical, MinusCircle, PlusCircleIcon, Search } from 'lucide-react';
import { stringResizer } from '../../../utils/StringResizer';

import DND from '../../../assets/dnd-placeholder.svg';
import { useNavigate } from 'react-router-dom';
import ExitConfirmationDialog from '../../../components/ExitConfirmationDialog';

import { useSelector, useDispatch } from 'react-redux';
import { populateQuestions } from '../../../store/slices/questionsSlice';


function ExamForm(): JSX.Element {
//   const [questions, setQuestions] = React.useState([]);
  const [questionOrder, setQuestionOrder] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [search, setSearch] = React.useState<string>('');
  const [questionToPreview, setQuestionToPreview] = React.useState([]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const questions = useSelector((state) => state.question.questions);
  const dispatch = useDispatch();



  React.useEffect(() => {
    console.log(questions);
  }, [questions]);

  const navigate = useNavigate();

  const handleOpenQuestionPreview = (index) => {
    setOpenPreview(!openPreview);
  };


  const handleOnDrag = (e: React.DragEvent, widgetType: string) => {
    e.dataTransfer.setData('widgetType', widgetType);
  };

  const handleOnDrop = (e: React.DragEvent) => {
    const widgetType = e.dataTransfer.getData('widgetType') as string;
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
      .then(data => {
        dispatch(populateQuestions(data));
      })
      .catch(error => console.error('Erro ao buscar questões:', error));
  }, []);

  return (
    <>
      <ExitConfirmationDialog
        handleBack={handleBack}
        handleOpen={handleOpen}
        open={open}
      />

      <Dialog open={openPreview} handler={handleOpenQuestionPreview} size='xl'>
        <div className='w-full'>
          {questionToPreview}
          {/* <QuestionPreviewContainer question={questions[1]} /> */}
        </div>
      </Dialog>

      <div className='flex h-screen w-screen flex-col gap-4 overflow-hidden rounded bg-white px-8 py-6 transition-all'>
        <div className='grid h-full max-h-[93%] w-full grid-cols-2 gap-2 '>
          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border px-2 py-4'>
            <span className='flex w-full items-center justify-between p-3'>
              <Typography variant='h4'>Corpo da prova</Typography>

              <ButtonGroup>
                {/* <Button>One</Button> */}
                {/* <Button>Two</Button> */}
                <Button
                  disabled={questionOrder.length > 0 ? false : true}
                  className='flex items-center gap-2'
                  onClick={() => {
                    setQuestionOrder([]);
                  }}
                >
                  <Eraser />
                    Limpar
                </Button>
              </ButtonGroup>
            </span>
            <ul
              className='grid w-full grid-cols-1 gap-4 overflow-y-scroll'
              onDrop={handleOnDrop}
              onDragOver={handleDragOver}
            >
              {questionOrder.length > 0 ? (
                <>

                </>
              ): (
                <li className='flex h-full w-full select-none flex-col items-center gap-4 rounded-md bg-blue-gray-50/50 p-4'>
                  <Typography variant='h5'>
                    clique na questão, arraste e solte aqui
                  </Typography>
                  <img src={DND} className='pointer-events-none animate-fade-in-down select-none'/>
                </li>
              )}
              {questionOrder.map((question, index) => (
                <li
                  key={index}
                  className='flex animate-fade-in-down cursor-grab select-none items-center justify-between rounded-md border bg-[#fafafa] px-1 py-2 active:cursor-grabbing'
                >
                  <div className='flex items-center gap-1'>
                    <GripVertical />
                    <p className='flex h-7 w-7 items-center justify-center rounded-full bg-black p-2 text-white'>{index + 1}</p>
                  </div>

                  <div className='mx-2 w-full'>
                    <Typography variant='h6'>
                      {stringResizer(question, 50)} ...
                    </Typography>
                  </div>

                  <ButtonGroup>
                    <IconButton onClick={() => handleOpenQuestionPreview(index)}>
                      <Eye size={20}/>
                    </IconButton>
                    <IconButton onClick={() => handleRemoveQuestion(index)}>
                      <MinusCircle size={20}/>
                    </IconButton>
                  </ButtonGroup>
                </li>


              ))}

              {questionOrder.length > 0 ? (
                <>
                  <Tooltip content="clique na questão, arraste e solte aqui">
                    <div className='flex h-[4rem] w-full flex-col items-center justify-center rounded-sm bg-green-400'>
                      <PlusCircleIcon size={24} color='white'/>
                    </div>
                  </Tooltip>
                </>
              ): (
                <>
                </>
              )}

            </ul>
          </div>

          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border px-2 py-4'>
            <div className=' p-2'>
              <Typography variant='h4' className='mb-1'>Selecione a questão</Typography>

              <div className='flex w-full gap-2'>
                <Input
                  label={'Buscar'}
                  icon={<Search size={20}/>}
                  size='lg'
                  onChange={(event) => setSearch(event.target.value)}
                />
                <Select label="Buscar por categoria" size='lg'>
                  <Option>
                    <Chip value="categoria" className='w-fit'/>
                  </Option>
                  <Option>
                    <Chip value="categoria" className='w-fit'/>
                  </Option>
                  <Option>
                    <Chip value="categoria" className='w-fit'/>
                  </Option>
                  <Option>
                    <Chip value="categoria" className='w-fit'/>
                  </Option>
                  <Option>
                    <Chip value="categoria" className='w-fit'/>
                  </Option>
                  <Option>
                    <Chip value="categoria" className='w-fit'/>
                  </Option>

                </Select>
              </div>
            </div>
            <div className='relative z-30 mt-2 flex h-full max-h-full w-full flex-col items-start gap-2 overflow-y-scroll'>

              {questions.filter((question) => {
                const isQuestionInOrdered = questionOrder.some(
                  orderedQuestion => orderedQuestion === question.statement
                );

                return !isQuestionInOrdered && (search.toLocaleLowerCase() === '' ? true : question.statement.toLocaleLowerCase().includes(search));
              }).map((question, index) => (

                <QuestionCard
                  key={index}
                  statement={question.statement}
                  createdAt={question.createdAt}
                  updatedAt={question.updatedAt}
                  onDragStart={(e) => handleOnDrag(e, question.statement)}
                />

              ))}
            </div>
          </div>
        </div>
        <div className='flex h-fit w-full items-end justify-end gap-4 rounded-md transition-all'>
          <Button variant='outlined' onClick={handleOpen} size='lg'>Cancelar</Button>
          <Button size='lg' >Próximo</Button>
        </div>
      </div>
    </>
  );
}

export { ExamForm };
