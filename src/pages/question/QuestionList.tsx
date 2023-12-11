import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { populateQuestions } from '../../store/slices/questionsSlice';
import { Menu, Dialog, IconButton, MenuHandler, MenuItem, MenuList, Typography, Input, DialogHeader } from '@material-tailwind/react';
import { stringResizer } from '../../utils';
import { Eye, MoreVertical, Trash } from 'lucide-react';
import { BackButton } from '../../components/BackButton';


function QuestionList() {
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

  const difficultyColorMap = {
    1: 'border-l-green-400',
    2: 'border-l-orange-400',
    3: 'border-l-red-400',
  };

  const handleOpenQuestionPreview = (index) => {
    if (index) {
      setQuestionToPreview(index);
      setNewQuestionTitle(index.title);
      setNewQuestionStatement(index.statement);
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

    fetch(`http://localhost:3000/questions?${pageString}${filterString}`)
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

  return (
    <>

      <Dialog open={openPreview} handler={handleOpenQuestionPreview} size='xl'>

        <DialogHeader>
          {questionToPreview.title}
        </DialogHeader>

        <div className='flex w-full flex-col gap-4 p-4 '>
          <Input
            label='Título da questão'
            value={newQuestionTitle}
            onFocus={() => {
              setNewQuestionTitle(questionToPreview.title);
            }}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            size='lg'
          />

          <Input
            label='Enunciado da questão'
            value={newQuestionStatement}
            onFocus={() => {
              setNewQuestionStatement(questionToPreview.statement);
            }}
            onChange={(e) => setNewQuestionStatement(e.target.value)}
            size='lg'
          />
        </div>
      </Dialog>

      <div className='relative flex h-full w-full flex-col justify-between rounded border border-white bg-[#D2F1FF] p-4'>
        <BackButton />
        <div className='mb-3 h-[2rem] w-full bg-gray-300'>

        </div>
        <div className='relative grid h-[43rem] w-full grid-cols-4 gap-2 overflow-y-scroll'>
          {questions.map((question, index) => (
            <>
              <div className={`min-h-[7rem] rounded border border-l-8 bg-white p-2 ${difficultyColorMap[question.difficulty]}`} key={index} >
                <span className='flex w-full items-center justify-between'>
                  <Typography variant='h6'>{question.title}</Typography>
                  <div>
                    <Menu>
                      <MenuHandler>
                        <IconButton variant="text">
                          <MoreVertical size={20}/>
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem
                          className='flex items-center gap-4'
                          onClick={() => handleOpenQuestionPreview(question)}
                        >
                          <Eye size={20}/>
                        Visualizar
                        </MenuItem>
                        <MenuItem
                          className='flex items-center gap-4'
                        >
                          <Eye size={20}/>
                        Editar
                        </MenuItem>
                        <hr className="my-3" />
                        <MenuItem className='flex items-center justify-center gap-2 text-red-300' >
                          <Trash size={20}/>
                        Excluir
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </span>
                <Typography variant='paragraph'>{question.statement.length > 49 ? (`${stringResizer(question.statement, 50)} ...`) : (question.statement)}</Typography>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export { QuestionList };
