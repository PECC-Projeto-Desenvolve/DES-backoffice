import { Button, Card, Chip, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { Eye, Table } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../../../components/BackButton';
import QuestionPreviewDialogWithFetch from '../../../components/Dialogs/QuestionPreviewDialogWithFetch';
import { decryptRightAnswer, formatDate, stringResizer } from '../../../utils';

import { CSVLink } from 'react-csv';

function CadidateDetails() {
  const [candidate, setCandidate] = React.useState({
    name: '',
    document: '',
    createdAt: '',
  });
  const [userQuestions, setUserQuestions] = React.useState([]);
  const [questionToPreview, setQuestionToPreview] = React.useState(null);
  const [openQuestionPreview, setOpenQuestionPreview] = React.useState(false);
  const { id } = useParams();

  const fetchQuestionDetails = async (questionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/${questionId}`);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      const questionData = await response.json();
      return {
        statement: questionData.statement,
        title: questionData.title,
        image: questionData.image,
        rightAnswer: questionData.rightAnswer,
        difficulty: questionData.difficulty
      };

    } catch (error) {
      console.error('Erro ao buscar detalhes da questão:', error);
      return null;
    }
  };

  const fetchExam = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/userexams/${id}`);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      const data = await response.json();
      setCandidate(data);

      if (data && data.questions) {
        const questionsDetails = await Promise.all(
          data.questions.map((q) => fetchQuestionDetails(q.questionId))
        );
        setUserQuestions(data.questions.map((q, index) => ({
          ...q,
          statement: questionsDetails[index] ? questionsDetails[index].statement : 'Detalhe indisponível',
          title: questionsDetails[index] ? questionsDetails[index].title : 'Título indisponível',
          image: questionsDetails[index] ? questionsDetails[index].image : 'Imagem indisponível',
          rightAnswer: questionsDetails[index] ? questionsDetails[index].rightAnswer : 'Resposta indisponível',
          difficulty: questionsDetails[index] ? questionsDetails[index].difficulty : 'Dificuldade indisponível'
        })));
      } else {
        console.error('Resposta da API não contém "questions"');
      }
    } catch (error) {
      console.error('Erro ao buscar candidato:', error);
    }
  };

  const handleResult = (userAnswer, rightAnser) => {
    if(String.fromCharCode(64 + (userAnswer + 1)) === decryptRightAnswer(rightAnser)){
      return ('✅');
    }

    return ('❌');
  };

  React.useEffect(() => {
    if (id) {
      fetchExam(id);
    }
  }, [id]);

  const handlePreviewQuestion = () => {
    setOpenQuestionPreview(!openQuestionPreview);
  };

  const csvData = userQuestions.map((item, index) => ({
    NomeDoCandidato: candidate.name,
    DocumentoDoCandidato: candidate.document,
    Posicao: index + 1,
    Nível: item.difficulty === 1 ? 'fácil' : item.difficulty === 2 ? 'média' : 'difícil',
    AlternativaDoUsuario: String.fromCharCode(64 + (item.position + 1)),
    AlternativaCorreta: decryptRightAnswer(item.rightAnswer),
    Resultado: handleResult(item.posiiton, item.rightAnswer)
  }));


  return (
    <>
      <BackButton />

      <QuestionPreviewDialogWithFetch
        questionToPreview={questionToPreview && questionToPreview}
        handler={handlePreviewQuestion}
        open={openQuestionPreview}
      />

      <div className='h-full w-full'>
        <div className='flex w-full items-end justify-between'>
          <span className='mb-6'>
            <Typography variant='small' className='dark:text-white'>Candidato</Typography>
            {candidate.name && <Typography variant='h4' className='dark:text-white'>{candidate.name}</Typography>}
            {candidate.createdAt && <Typography variant='paragraph' className='dark:text-white'>{formatDate(candidate.createdAt)}</Typography>}
          </span>

          <CSVLink
            data={csvData}
            filename={'dados-candidato.csv'}
            target="_blank"
          >
            <Button className='flex items-center gap-4 rounded-bl-none rounded-br-none' color='cyan'>Exportar CSV <Table size={20} /></Button>
          </CSVLink>
        </div>
        <Card className='overflow-hidden rounded-tr-none'>
          <table className="min-w-full border-collapse ">
            <thead className="h-[3rem] border-b bg-blue-900/20">
              <tr className='text-blue-gray-900'>
                <th className="p-2 text-center">Posição</th>
                <th className="p-2 text-center">Nível</th>
                <th className="p-2 text-center">Título</th>
                <th className="p-2 text-center">Alternativa do Usuário</th>
                <th className="p-2 text-center">Alternativa Correta</th>
                <th className="p-2 text-center">Resultado</th>
                <th className="p-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {userQuestions.map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-b`}>
                  <td className="  p-2 text-center">{index + 1}</td>
                  <td className="  p-2">
                    {item.difficulty == 1 && <Chip value='fácil' color='green' size='sm' className='text-center'/>}
                    {item.difficulty == 2 && <Chip value='média' color='orange' size='sm' className='text-center'/>}
                    {item.difficulty == 3 && <Chip value='difícil' color='red' size='sm' className='text-center'/>}
                  </td>
                  <td className="p-2 text-center">{stringResizer(item.title, 65)}</td>
                  <td className="p-2 text-center">{item.position == 8 ? ('####') : String.fromCharCode(64 + (item.position + 1))}</td>
                  <td className="p-2 text-center">{decryptRightAnswer(item.rightAnswer)}</td>
                  <td className="p-2 text-center">{handleResult(item.position, item.rightAnswer)}</td>
                  <td className="p-2 text-center">
                    <Tooltip content="Ver questão">
                      <IconButton color='blue' onClick={() => {
                        setQuestionToPreview(item.questionId);
                        handlePreviewQuestion();
                      }}>
                        <Eye size={20}/>
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}

export default CadidateDetails;
