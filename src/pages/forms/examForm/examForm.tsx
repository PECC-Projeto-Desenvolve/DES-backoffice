import React from 'react';
import { Button, Dialog, Option, IconButton, Input, Select, Typography, Chip, ButtonGroup, DialogHeader, DialogBody, DialogFooter, Tooltip } from '@material-tailwind/react';
import { BadgeHelp, Eye, MinusCircle, PlusCircleIcon, Search } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { ExitConfirmationDialog, QuestionCard, Skeleton, QuestionContainer } from '../../../components';

import { useSelector, useDispatch } from 'react-redux';
import { populateQuestions } from '../../../store/slices/questionsSlice';

import DNDHelper from '../../../assets/gifs/drag-n-drop-helper.gif';

import { ExamQuestionLabel } from '../../../components/ExamQuestionLabel';

import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import DND from '../../../assets/dnd-placeholder.svg';
import { deleteQuestion } from '../../../api/question/delete';
import { submitExam } from '../../../api/exam/submit';


function ExamForm(): JSX.Element {
  const [questionOrder, setQuestionOrder] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [openExamCompletedDialog, setOpenExamCompletedDialog] = React.useState(false);

  const [firstStepCompleted, setFirstStepCompleted] = React.useState(0);
  const [search, setSearch] = React.useState<string>('');

  const [questionToPreview, setQuestionToPreview] = React.useState({
    title: '',
    statement: '',
    difficulty: '',
    alternatives: [],
    rightAnswer: ''
  });

  const [openHelpDialog, setOpenHelpDialog] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState('');

  const [categories, setCategories] = React.useState([]);
  //   const [selectedCategory, setSelectedCategory] = React.useState('');

  const [examTitle, setExamTitle] = React.useState('');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const questions = useSelector((state) => state.question.questions);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleOpenQuestionPreview = (index) => {
    if (index) {
      setQuestionToPreview(index);
    }
    setOpenPreview(!openPreview);
  };
  const handleExamSubmitCompleted = () => {
    setOpenExamCompletedDialog(!openExamCompletedDialog);
  };

  const handleDeleteQuestion = (questionId: number) => {
    deleteQuestion({ id: questionId, responseCompleted: () => fetchQuestions() });
  };

  const handleOnDrag = (e: React.DragEvent, widgetType: string) => {
    e.dataTransfer.setData('widgetType', JSON.stringify(widgetType));
  };

  const handleOnDrop = (e: React.DragEvent) => {
    setSearch('');
    setDifficulty('');

    const widgetType = e.dataTransfer.getData('widgetType') as string;

    setQuestionOrder([...questionOrder, JSON.parse(widgetType)]);
  };

  const handleRemoveQuestion = (indexToRemove) => {
    setQuestionOrder(questionOrder.filter((_, index) => index !== indexToRemove));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestionOrder((prev) => {
        const oldIndex = prev.findIndex(item => item.id === active.id);
        const newIndex = prev.findIndex(item => item.id === over.id);

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

  const fetchQuestions = (page?: string, filter?: string) => {
    const pageString = page ? `&page=${page}` : '';
    const filterString = filter ? `&filter=${filter}` : '';

    fetch(`http://localhost:3000/questions?${pageString}${filterString}`)
      .then(response => response.json())
      .then(data => {
        dispatch(populateQuestions(data));
      })
      .catch(error => console.error('Erro ao buscar questões:', error));
  };

  const getQuestionIds = () => {
    return questionOrder.map(question => question.id.toString());
  };

  React.useEffect(() => {
    if (firstStepCompleted == 1) {
      fetchQuestions();
    }
  }, [firstStepCompleted]);

  React.useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  }, []);

  React.useEffect(() => {
  }, [questionOrder]);



  return (
    <>
      <ExitConfirmationDialog
        handleBack={handleBack}
        handleOpen={handleOpen}
        open={open}
      />

      <Dialog open={openExamCompletedDialog} handler={handleExamSubmitCompleted}>
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
          <Button variant="gradient" color="green" onClick={() => {
            setQuestionOrder([]);
            setExamTitle('');
            setFirstStepCompleted(0);
          }}>
            <span>Sim</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openPreview} handler={handleOpenQuestionPreview} size='xl'>
        <div className='w-full'>
          <QuestionContainer
            title={questionToPreview.title}
            statement={questionToPreview.statement}
            alternativesWrapper={
              <>
                {questionToPreview.alternatives.map((alternative, index) => (
                  <>
                    <div className='flex w-full cursor-pointer items-center gap-3 rounded-md border-2 border-transparent bg-modal-heading px-2 py-3 text-white transition ease-in-out'>
                      <div className='flex h-8 w-8 select-none items-center justify-center rounded-full bg-white text-black'>
                        {String.fromCharCode(64 + (index + 1))}
                      </div>
                      <p key={index}>{alternative.text}</p>
                    </div>
                  </>
                ))}
              </>
            }
          />
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
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />
            <Select label="Nível da prova" size='lg' disabled>
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
          <Button
            variant="gradient"
            color="green"
            onClick={() => setFirstStepCompleted(1)}
            disabled={examTitle == '' && true}
          >
            <span>Avançar</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <div className='flex h-screen w-screen flex-col gap-4 overflow-hidden rounded bg-white px-8 py-6 transition-all'>
        <div className='grid h-full max-h-[93%] w-full grid-cols-1 gap-2 lg:grid-cols-2 '>
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
                      id={question.id}
                      index={question.id}
                      counter={index}
                      key={index}
                      question={question.statement}
                      difficulty={question.difficulty.toString()}
                      buttonPlacement={
                        <ButtonGroup>
                          <IconButton onClick={() => {
                            handleOpenQuestionPreview(questionOrder[index]);
                          }}>
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
                        <div className='mt-4 flex h-[3rem] w-full flex-col items-center justify-center rounded-sm bg-green-400'>
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
                <Typography variant='h4' className='mb-1'>Selecione a questão
                  {/* <IconButton variant='text' className='ml-2' onClick={() => fetchQuestions()}>
                    <RefreshCcw size={20}/>
                  </IconButton> */}
                </Typography>

                <Button
                  size='sm'
                  variant='text'
                  onClick={() => {
                    setDifficulty(null);
                    fetchQuestions();
                  }}
                >
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

                <Select
                  label="Categoria"
                  //   onChange={(event) => setSelectedCategory(event)}
                  size='lg'
                  disabled
                >
                  {categories.map((category, index) => (
                    <Option key={index} value={category.title} className=' bg-white'>
                      <Chip value={category.title} className='w-fit text-white' style={{ backgroundColor: `${category.color}`}}/>
                    </Option>
                  ))}
                </Select>

                <div>
                  <Select
                    label="Dificuldade"
                    size='lg'
                    value={difficulty}
                    onChange={(value) => {
                      setDifficulty(value);
                      //   setSelectedCategory(null);
                      fetchQuestions('0', value);
                    }}
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
            <div className='relative z-30 mt-2 flex h-full max-h-full w-full flex-col items-start gap-2 overflow-y-scroll transition-all'>
              {firstStepCompleted == 0 ? (
                <Skeleton />
              ):(
                <>
                  {questions.filter((question) => {
                    const isQuestionInOrdered = questionOrder.some(
                      orderedQuestion => orderedQuestion.statement === question.statement
                    );

                    const matchesSearch = !isQuestionInOrdered &&
                (search.toLocaleLowerCase() === '' || question.statement.toLocaleLowerCase().includes(search));

                    return matchesSearch;
                  })
                    .map((question, index) => (
                      <QuestionCard
                        key={index}
                        id={question.id}
                        difficulty={question.difficulty}
                        rightAnswer={question.rightAnswer}
                        statement={question.statement}
                        createdAt={question.createdAt}
                        updatedAt={question.updatedAt}
                        handleDeleteQuestion={() => handleDeleteQuestion(question.id)}
                        handleOpenView={() =>
                          handleOpenQuestionPreview(question)
                        }
                        onDragStart={(e) => {
                          handleOnDrag(e, question);
                        }}
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
            <Button
              onClick={
                () =>
                  submitExam({
                    title: examTitle,
                    questionIds: getQuestionIds(),
                    responseCompleted() {
                      handleExamSubmitCompleted();
                    },})} disabled={questionOrder.length >= 5 ? false : true}>Salvar prova</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export { ExamForm };
