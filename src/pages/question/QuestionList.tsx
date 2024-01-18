import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { populateQuestions } from '../../store/slices/questionsSlice';
import { Menu, Dialog, IconButton, MenuHandler, MenuItem, MenuList, Typography, Input, DialogHeader, Button, DialogFooter } from '@material-tailwind/react';
import { formatDate, stringResizer } from '../../utils';
import { ExternalLink, Eye, MoreVertical, Trash } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const apiUrl = import.meta.env.VITE_API_URL;

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
  const [openPreview, setOpenPreview] = React.useState(false);
  const [questionToPreview, setQuestionToPreview] = React.useState({
    title: '',
    statement: '',
    difficulty: '',
    alternatives: [],
    rightAnswer: ''
  });

  const [newQuestionTitle, setNewQuestionTitle] = React.useState('');
  const [newQuestionStatement, setNewQuestionStatement] = React.useState('');
  const [newQuestionAlternatives, setNewQuestionAlternatives] = React.useState([]);

  const [questionId, setQuestionId] = React.useState(0);

  const difficultyColorMap = {
    1: 'border-l-green-400 dark:border-l-green-600',
    2: 'border-l-orange-400 dark:border-l-orange-600',
    3: 'border-l-red-400 dark:border-l-red-600',
  };

  const handleOpenQuestionPreview = (index) => {
    fetch(`${apiUrl}/alternatives/${index.id}`)
      .then(response => response.json())
      .then(data => {
        setNewQuestionAlternatives(data);
      })
      .catch(error => console.error('Erro ao buscar questões:', error));

    if (index) {
      setQuestionToPreview(index);
      setNewQuestionTitle(index.title);
      setNewQuestionStatement(index.statement);
      setQuestionId(index.id);
    }

    setOpenPreview(!openPreview);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const questions = useSelector((state) => state.question.questions);
  const dispatch = useDispatch();

  const fetchQuestions = (page?: string, filter?: string) => {
    const pageString = page ? `&page=${page}` : '';
    const filterString = filter ? `&filter=${filter}` : '';

    fetch(`${apiUrl}/questions?${pageString}${filterString}`)
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
      const response = await fetch(`${apiUrl}/questions/${questionId}`, {
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

  return (
    <>

      <Dialog open={openPreview} handler={handleOpenQuestionPreview} size='xl'>

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

          {newQuestionAlternatives.map((alternative, index) => (
            <Input
              disabled
              crossOrigin={''}
              key={index}
              label='Título da questão'
              value={alternative.text}
              onFocus={() => {
                setNewQuestionAlternatives(questionToPreview.alternatives);
              }}
              onChange={(e) => setNewQuestionAlternatives[index](e.target.value)}
              size='lg'
            />
          ))}
        </div>

        <DialogFooter>
          <span className='flex gap-2'>
            <Button size='sm' color='red' onClick={() => setOpenPreview(false)}>Fechar</Button>
            <Button size='sm' color='green' onClick={() => updateQuestion(questionId)}>Salvar</Button>
          </span>
        </DialogFooter>
      </Dialog>


      <div className='mb-3  flex w-full justify-between'>
        <BackButton />
        <Button color='blue' className='flex items-center justify-center gap-4' onClick={() => navigate('/question/form')} size='sm'>Criar questão <ExternalLink size={18}/> </Button>
      </div>

      <div className='relative flex h-full w-full flex-col justify-between'>

        <div className='relative grid  w-full grid-cols-2 gap-2 overflow-y-scroll'>
          {questions.map((question, index) => (
            <>
              <div className={`flex items-center rounded border border-l-8 bg-white p-2 dark:bg-blue-gray-200/20 ${difficultyColorMap[question.difficulty]}`} key={index} >
                <span className='ml-2 flex w-full flex-col'>
                  <Typography variant='h6' className='dark:text-white'>{question.title}</Typography>


                  <div  dangerouslySetInnerHTML={{ __html: stringResizer(question.statement, 50) }}/>
                  {/* <Typography variant='paragraph' className='dark:text-white'>{question.statement.length > 49 ? (`${stringResizer(question.statement, 50)} ...`) : (question.statement)}</Typography> */}

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
                        onClick={() => handleOpenQuestionPreview(question)}
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
