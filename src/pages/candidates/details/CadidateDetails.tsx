import { Card, Chip, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { Eye } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../../../components/BackButton';
import QuestionPreviewDialogWithFetch from '../../../components/Dialogs/QuestionPreviewDialogWithFetch';
import { decryptRightAnswer, formatDate, stringResizer } from '../../../utils';

function CadidateDetails() {
  const [candidate, setCandidate] = React.useState([]);
  const [userQuestions, setUserQuestions] = React.useState([]);
  const [questionToPreview, setQuestionToPreview] = React.useState(null);
  const [openQuestionPreview, setOpenQuestionPreview] = React.useState(false);
  const { id } = useParams();

  const fetchQuestionDetails = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${questionId}`);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      const questionData = await response.json();
      return {
        statement: questionData.statement,
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
    if(userAnswer === rightAnser){
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

  return (
    <>
      <BackButton />

      <QuestionPreviewDialogWithFetch
        questionToPreview={questionToPreview && questionToPreview}
        handler={handlePreviewQuestion}
        open={openQuestionPreview}
      />

      <span>
        <Typography variant='small'>Candidato</Typography>
        <Typography variant='h4'>{candidate.name}</Typography>
        <Typography variant='paragraph'>{formatDate(candidate.createdAt)}</Typography>
      </span>

      <div className='h-full w-full'>
        <Card>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-center">Posição</th>
                <th className="border border-gray-300 p-2 text-center">Dificuldade</th>
                <th className="border border-gray-300 p-2 text-center">Enunciado</th>
                <th className="border border-gray-300 p-2 text-center">Alternativa do Usuário</th>
                <th className="border border-gray-300 p-2 text-center">Alternativa Correta</th>
                <th className="border border-gray-300 p-2 text-center">Resultado</th>
                <th className="border border-gray-300 p-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {userQuestions.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {item.difficulty == 1 && <Chip value='fácil' color='green' size='sm' className='text-center'/>}
                    {item.difficulty == 2 && <Chip value='média' color='orange' size='sm' className='text-center'/>}
                    {item.difficulty == 3 && <Chip value='difícil' color='red' size='sm' className='text-center'/>}
                  </td>
                  <td className="flex h-full gap-2 border-t border-gray-300 p-2 text-center">{stringResizer(item.statement, 65)}...</td>
                  <td className="border border-gray-300 p-2 text-center">{String.fromCharCode(64 + (item.position + 1))}</td>
                  <td className="border border-gray-300 p-2 text-center">{decryptRightAnswer(item.rightAnswer)}</td>
                  <td className="border border-gray-300 p-2 text-center">{handleResult(String.fromCharCode(64 + (item.position + 1)), decryptRightAnswer(item.rightAnswer) )}</td>
                  <td className="border border-gray-300 p-2 text-center">
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
