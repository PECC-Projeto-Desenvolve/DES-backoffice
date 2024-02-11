import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { populateQuestions } from '../../store/slices/questionsSlice';
import { Menu, Dialog, IconButton, MenuHandler, MenuItem, MenuList, Typography, Input, DialogHeader, Button, DialogFooter, Select, Option } from '@material-tailwind/react';
import { formatDate, stringResizer } from '../../utils';
import { Ban, Edit, ExternalLink, Eye, MoreVertical, SaveIcon, Trash } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuestionList() {
  const modules = {
    toolbar: [
      [{ header: [ false] }],
      ['bold', 'italic'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic',
    'list', 'bullet',
  ];

  const handleTextChange = (value: string) => {
    setNewQuestionStatement(value);
  };

  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = React.useState<boolean>(false);
  const [questionToPreview, setQuestionToPreview] = React.useState({
    id: '',
    title: '',
    statement: '',
    difficulty: '',
    alternatives: [],
    rightAnswer: ''
  });

  const [newQuestionTitle, setNewQuestionTitle] = React.useState<string>('');
  const [newQuestionStatement, setNewQuestionStatement] = React.useState<string>('');
  const [newQuestionAlternatives, setNewQuestionAlternatives] = React.useState<any[]>([]);
  const [newAlternativeText, setNewAlternativeText] = React.useState<string>(null);
  const [editingItem, setEditingItem] = React.useState(null);
  const [questionId, setQuestionId] = React.useState<number>(0);
  const [editinAlternative, setEditinAlternative] = React.useState<boolean>(false);

  const difficultyColorMap = {
    1: 'border-l-green-400 dark:border-l-green-600',
    2: 'border-l-orange-400 dark:border-l-orange-600',
    3: 'border-l-red-400 dark:border-l-red-600',
  };

  const fetchAlternatives = (questionId: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/alternatives/${questionId}`)
      .then(response => response.json())
      .then(data => {
        setNewQuestionAlternatives(data);
      })
      .catch(error => console.error('Erro ao buscar questões:', error));
  };

  const handleOpenQuestionPreview = (question) => {
    fetchAlternatives(question.id);

    if (question) {
      setQuestionToPreview(question);
      setNewQuestionTitle(question.title);
      setNewQuestionStatement(question.statement);
      setQuestionId(question.id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const questions = useSelector((state) => state.question.questions);
  const dispatch = useDispatch();

  const fetchQuestions = () => {
    fetch(`${import.meta.env.VITE_API_URL}/questions?limit=200`)
      .then(response => response.json())
      .then(data => {
        dispatch(populateQuestions(data));
      })
      .catch(error => console.error('Erro ao buscar questões:', error));
  };

  React.useEffect(() => {
    fetchQuestions();
  }, []);

  React.useEffect(() => {
    if (!openPreview){
      setNewQuestionTitle('');
      setNewQuestionStatement('');
    }
  }, []);

  const updateQuestion = async (questionId: string | number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newTitle: newQuestionTitle,
          newStatement: newQuestionStatement,
        }),
      });

      if (response.ok) {
        fetchQuestions();
        setOpenPreview(false);

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: 'success',
          title: `Questão '${questionId}' salva com sucesso! `,
          text: '',
        });

      } else {
        console.error('Erro ao atualizar a questão:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao atualizar a questão:', error);
    }
  };

  const updateAlternative = async (alternativeId: string | number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/alternatives/${alternativeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newText: newAlternativeText,
        }),
      });

      if (response.ok) {
        const updatedAlternatives = newQuestionAlternatives.map((alternative) => {
          if (alternative.id === alternativeId) {
            return { ...alternative, text: newAlternativeText };
          }
          return alternative;
        });

        setNewQuestionAlternatives(updatedAlternatives);

        setNewAlternativeText(null);
        setEditingItem(null);
      }

    } catch (error) {
      console.error('Erro ao atualizar a alternativa:', error);
    }
  };

  return (
    <>
      <Dialog
        open={openPreview}
        handler={handleOpenQuestionPreview} size='lg'
        dismiss={{
          enabled: false,
        }}
      >

        <DialogHeader>
          {questionToPreview.title}
        </DialogHeader>

        <div className='flex w-full flex-col gap-4 p-4 '>
          <Input
            crossOrigin={''}
            label='Título da questão'
            value={newQuestionTitle}
            onFocus={() => {
              setNewQuestionTitle(questionToPreview.title);
            }}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            size='lg'
          />

          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={newQuestionStatement}
            onChange={(value) => handleTextChange(value)}
            className="my-custom-quill-editor bg-white"
          />

          <span className='flex gap-4'>
            <Select label='Dificuldade' disabled>
              <Option value="1">Opa</Option>
            </Select>
            <Select label='Alternativa correta' disabled>
              <Option value="1">Opa</Option>
            </Select>
          </span>

          {
            [...newQuestionAlternatives]
              .sort((a, b) => a.position - b.position)
              .map((alternative, index) => (
                <div key={index} className={`flex w-full items-center justify-between rounded-md px-4 py-2 ${editingItem !== alternative.position ? 'bg-gray-200' : 'bg-gray-100'}`}>
                  <span className='mr-2 w-full transition-all'>
                    {
                      editingItem === alternative.position ?
                        <Input
                          crossOrigin={''}
                          value={newAlternativeText}
                          onChange={(e) => setNewAlternativeText(e.target.value)}
                          autoFocus
                          labelProps={{
                            className: 'hidden',
                          }}
                          className="!border !border-gray-300 bg-white text-gray-900 transition-all focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                        /> :
                        <Typography variant='paragraph'>
                          {alternative.text}
                        </Typography>
                    }
                  </span>
                  {
                    editingItem === alternative.position ?
                      <>
                        <IconButton
                          size='sm'
                          className='mr-2 min-h-[2rem] min-w-[2rem]'
                          color='blue'
                          onClick={() => {
                            updateAlternative(alternative.id);
                          }}
                        >
                          <SaveIcon size={16}/>
                        </IconButton>
                        <IconButton
                          size='sm'
                          className='min-h-[2rem] min-w-[2rem]'
                          color='red'
                          onClick={() => {
                            setNewAlternativeText(null);
                            setEditingItem(null);
                            setEditinAlternative(false);
                          }}
                        >
                          <Ban size={16}/>
                        </IconButton>
                      </>
                      :
                      <IconButton
                        size='sm'
                        className='min-h-[2rem] min-w-[2rem]'
                        color='green'
                        disabled={editingItem !== null}
                        onClick={() => {
                          setNewAlternativeText(alternative.text);
                          setEditingItem(alternative.position);
                          setEditinAlternative(true);
                        }}
                      >
                        <Edit size={16}/>
                      </IconButton>
                  }
                </div>
              ))
          }
        </div>

        <DialogFooter>
          <span className='flex gap-2'>
            <Button size='sm' color='red' onClick={() => setOpenPreview(false)}>Fechar</Button>
            <Button size='sm' color='green' onClick={() => updateQuestion(questionId)} disabled={editinAlternative}>Salvar</Button>
          </span>
        </DialogFooter>
      </Dialog>

      <div className='mb-3  flex w-full justify-between'>
        <BackButton />
        <Button
          color='blue'
          className='flex items-center justify-center gap-4'
          onClick={() => navigate('/question/form')} size='sm'
        >
            Criar questão <ExternalLink size={18}/>
        </Button>
      </div>

      <div className='relative flex h-full w-full flex-col justify-between'>

        <div className='relative grid  w-full grid-cols-2 gap-2 overflow-y-scroll'>
          {questions.map((question, index) => (
            <>
              <div className={`flex items-center rounded border border-l-8 bg-white p-2 dark:bg-white/30 ${difficultyColorMap[question.difficulty]}`} key={index} >
                <span className='ml-2 flex w-full flex-col'>
                  <Typography variant='h6' className='dark:text-white'>{question.title}</Typography>

                  <div  dangerouslySetInnerHTML={{ __html: stringResizer(question.statement, 50) }} className="dark:text-white"/>

                  <Typography variant='small' className='font-bold dark:text-blue-gray-200'><span className='font-normal'>Criado em: </span>{formatDate(question.createdAt)}</Typography>
                </span>
                <div>
                  <Menu>
                    <MenuHandler>
                      <IconButton variant="text" className='dark:text-white'>
                        <MoreVertical size={20}/>
                      </IconButton>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem
                        className='flex items-center gap-4'
                        onClick={() => {
                          handleOpenQuestionPreview(question);
                          setOpenPreview(!openPreview);
                        }}
                      >
                        <Eye size={20}/>
                        Visualizar / Editar
                      </MenuItem>

                      <hr className="my-3" />
                      <MenuItem className='flex items-center justify-center gap-2 text-red-300' disabled>
                        <Trash size={20}/>
                        Excluir
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export { QuestionList };
