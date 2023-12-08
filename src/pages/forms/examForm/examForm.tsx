import React from 'react';
import { Button, Dialog, Option, IconButton, Input, Select, Typography, Chip, ButtonGroup, DialogHeader, DialogBody, DialogFooter, Tooltip } from '@material-tailwind/react';
import { BadgeHelp, Eye, MinusCircle, PlusCircleIcon, Search } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { ExitConfirmationDialog, QuestionCard, Skeleton } from '../../../components';

import { useSelector, useDispatch } from 'react-redux';
import { populateQuestions } from '../../../store/slices/questionsSlice';

import DNDHelper from '../../../assets/gifs/drag-n-drop-helper.gif';

import { ExamQuestionLabel } from '../../../components/ExamQuestionLabel';

import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import DND from '../../../assets/dnd-placeholder.svg';


function ExamForm(): JSX.Element {
//   const [questions, setQuestions] = React.useState([]);
  const [questionOrder, setQuestionOrder] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);

  const [firstStepCompleted, setFirstStepCompleted] = React.useState(0);
  const [search, setSearch] = React.useState<string>('');
  const [questionToPreview, setQuestionToPreview] = React.useState([]);
  const [openHelpDialog, setOpenHelpDialog] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState('');

  const [categories, setCategories] = React.useState([]);
  //   const [searchCategories, setSearchCategories] = React.useState('');

  //   const [items, setItems] = React.useState(questionOrder);


  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const questions = useSelector((state) => state.question.questions);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleOpenQuestionPreview = (index) => {
    setQuestionToPreview(index);
    setOpenPreview(!openPreview);
  };

  const handleOnDrag = (e: React.DragEvent, widgetType: string) => {
    e.dataTransfer.setData('widgetType', widgetType);

  };

  const handleOnDrop = (e: React.DragEvent) => {
    setSearch('');
    setDifficulty('');

    const widgetType = e.dataTransfer.getData('widgetType') as string;
    setQuestionOrder([...questionOrder, widgetType]);
  };

  const handleRemoveQuestion = (indexToRemove) => {
    setQuestionOrder(questionOrder.filter((_, index) => index !== indexToRemove));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuestionOrder((prev) => {
        const oldIndex = prev.findIndex(item => item === active.id);
        const newIndex = prev.findIndex(item => item === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
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

  const handleOpenHelpDialog = () => {
    setOpenHelpDialog(!openHelpDialog);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  React.useEffect(() => {
    if (firstStepCompleted == 1) {
      fetch('http://localhost:3000/questions')
        .then(response => response.json())
        .then(data => {
          dispatch(populateQuestions(data));
        })
        .catch(error => console.error('Erro ao buscar questões:', error));
    }
  }, [firstStepCompleted]);

  React.useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  }, []);

  return (
    <>
      <ExitConfirmationDialog
        handleBack={handleBack}
        handleOpen={handleOpen}
        open={open}
      />

      <Dialog open={openPreview} handler={handleOpenQuestionPreview} size='xl'>
        <DialogHeader>Preview</DialogHeader>
        <div className='w-full'>
          {questionToPreview}
        </div>

      </Dialog>

      <Dialog open={openHelpDialog} handler={handleOpenHelpDialog} size='lg'>
        <DialogHeader>Tutorial</DialogHeader>

        <div className='flex w-full items-center justify-center py-6'>
          <img src={DNDHelper} className='rounded-lg border'/>
        </div>

        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleOpenHelpDialog}>
            <span>OK</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={firstStepCompleted == 0} handler={handleOpenQuestionPreview} size='md'>
        <DialogHeader className='-mb-4'>Criação de prova</DialogHeader>
        <DialogBody>
          <Typography className='mb-4'>
            Seja bem vindo(a) à criação
          </Typography>

          <div className='flex flex-col gap-2'>
            <Input
              label={'Título'}
              icon={<Search size={20}/>}
              size='lg'
            />
            <Select label="Nível da prova" size='lg'>
              <Option>
                <Chip value="Fácil" className='w-fit' color='green'/>
              </Option>
              <Option>
                <Chip value="Médio" className='w-fit' color='orange'/>
              </Option>
              <Option>
                <Chip value="Difícil" className='w-fit' color='red'/>
              </Option>
            </Select>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={() => setFirstStepCompleted(1)}>
            <span>Avançar</span>
          </Button>
        </DialogFooter>
        {/* <QuestionPreviewContainer question={questions[1]} /> */}
      </Dialog>

      <div className='flex h-screen w-screen flex-col gap-4 overflow-hidden rounded bg-white px-8 py-6 transition-all'>
        <div className='grid h-full max-h-[93%] w-full grid-cols-2 gap-2 '>
          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border px-2 py-4'>
            <span className='flex w-full items-center justify-between p-3'>
              <div className='flex items-baseline gap-4'>
                <Typography variant='h4'>Corpo da prova</Typography>

                <Typography variant='paragraph'>{questionOrder.length} / <strong>45</strong></Typography>
              </div>

              <Button
                disabled={questionOrder.length > 0 ? false : true}
                size='sm'
                variant='text'
                onClick={() => {
                  setQuestionOrder([]);
                }}
              >
                    Limpar questões
              </Button>

            </span>

            <ul className='relative h-full w-full overflow-y-scroll'
              onDrop={handleOnDrop}
              onDragOver={handleDragOver}
            >
              {/* <SortableListComponent /> */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={questionOrder} strategy={verticalListSortingStrategy}>
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
                    <ExamQuestionLabel
                      id={question}
                      index={question}
                      counter={index}
                      key={index}
                      question={question}
                      buttonPlacement={
                        <ButtonGroup>
                          <IconButton onClick={() => handleOpenQuestionPreview(questionOrder[index])}>
                            <Eye size={20}/>
                          </IconButton>
                          <IconButton onClick={() => handleRemoveQuestion(index)}>
                            <MinusCircle size={20}/>
                          </IconButton>
                        </ButtonGroup>
                      }
                    />
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
                </SortableContext>
              </DndContext>
            </ul>

          </div>

          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border px-2 py-4'>
            <div className=' p-2'>
              <div className='mb-2 flex w-full items-center justify-between'>
                <Typography variant='h4' className='mb-1'>Selecione a questão</Typography>

                <Button size='sm' variant='text' onClick={() => setDifficulty(null)}>
                    Limpar filtros</Button>
              </div>


              <div className='flex items-center gap-2'>
                <Input
                  label={'Buscar'}
                  icon={<Search size={20}/>}
                  size='lg'
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <Select label="Categoria" size='lg'>

                  {categories.filter((category) => (
                    <>
                      <Option key={category.id} value="1" className=' bg-white'>
                        <Chip value={category.title} className='w-fit text-black' style={{ backgroundColor: `#${category.color}`}}/>
                      </Option>
                    </>
                  ))}
                </Select>

                <div>
                  <Select
                    label="Dificuldade"
                    size='lg'
                    value={difficulty}
                    onChange={(value) => setDifficulty(value)}
                  >
                    <Option value="1" index={1}>
                      <Chip value="Fácil" className='w-fit' color='green'/>
                    </Option>
                    <Option value="2" index={2}>
                      <Chip value="Médio" className='w-fit' color='orange'/>
                    </Option>
                    <Option value="3" index={3}>
                      <Chip value="Difícil" className='w-fit' color='red'/>
                    </Option>
                  </Select>
                </div>

              </div>
            </div>
            <div className='relative z-30 mt-2 flex h-full max-h-full w-full flex-col items-start gap-2 overflow-y-scroll'>
              {firstStepCompleted == 0 ? (
                <Skeleton />
              ):(
                <>
                  {questions.filter((question) => {
                    const isQuestionInOrdered = questionOrder.some(
                      orderedQuestion => orderedQuestion === question.statement
                    );

                    const matchesDifficulty = Number(difficulty) === 0 || question.difficulty === Number(difficulty);

                    const matchesSearch = !isQuestionInOrdered &&
                (search.toLocaleLowerCase() === '' || question.statement.toLocaleLowerCase().includes(search));

                    return matchesDifficulty && matchesSearch;
                  })
                    .sort((a, b) => a.difficulty - b.difficulty)
                    .map((question, index) => (
                      <QuestionCard
                        key={index}
                        id={question.id}
                        difficulty={question.difficulty}
                        rightAnswer={question.rightAnswer}
                        statement={question.statement}
                        createdAt={question.createdAt}
                        updatedAt={question.updatedAt}
                        onDragStart={(e) => handleOnDrag(e, question.statement)}
                      />

                    ))}
                </>
              )}

            </div>
          </div>
        </div>
        <div className='flex h-fit w-full items-end justify-between rounded-md'>
          <div>
            <Button variant='outlined' onClick={handleOpenHelpDialog} className='flex items-center gap-2'>
            Ajuda
              <BadgeHelp size={20}/>
            </Button>
          </div>
          <div className='flex gap-4'>
            <Button variant='outlined' onClick={handleOpen}>Cancelar</Button>
            <Button>Próximo</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export { ExamForm };
