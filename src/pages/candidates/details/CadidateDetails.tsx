import { Button, Card, Chip, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { Eye, Table, UserCheck } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../../../components/BackButton';
import QuestionPreviewDialogWithFetch from '../../../components/Dialogs/QuestionPreviewDialogWithFetch';
import { decryptRightAnswer, formatDate, stringResizer } from '../../../utils';

import { CSVLink } from 'react-csv';
import Swal from 'sweetalert2';

/**
 * Displays detailed information about a candidate's exam attempt, including their answers, question details,
 * and the ability to preview each question. It also supports exporting the exam data to a CSV file.
 * Utilizes Material Tailwind components and custom hooks for fetching data and managing state.
 *
 * @returns {JSX.Element} A comprehensive view of a candidate's exam attempt, including personal information,
 * question responses, and export functionality.
 */
function CadidateDetails() {
  const [candidate, setCandidate] = React.useState({
    name: '',
    document: '',
    createdAt: '',
  });
  //   const [candidateId, setCandidateId] = React.useState<string>('');
  const [userQuestions, setUserQuestions] = React.useState<any[]>([]);
  const [questionToPreview, setQuestionToPreview] = React.useState(null);
  const [openQuestionPreview, setOpenQuestionPreview] = React.useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState<number>(0);
  const { id } = useParams();

  /**
 * Asynchronously fetches the details of a question from the server using its unique identifier.
 * It constructs the request URL using an environment variable for the API base URL.
 *
 * @async
 * @param {string} questionId - The unique identifier of the question to fetch details for.
 * @returns {Promise<Object|null>} The question details including statement, title, image, right answer, and difficulty
 * on success; otherwise, returns null if an error occurs during the fetch operation.
 */
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

  /**
 * Asynchronously fetches exam details for a specific candidate by their exam ID. It retrieves the candidate's information
 * and the details of each question in the exam, including handling cases where question details are not available.
 * Utilizes an environment variable for the API base URL and updates component state with the fetched data.
 *
 * @async
 * @param {string} id - The unique identifier of the candidate's exam to fetch.
 */
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

        const updatedQuestions = data.questions.map((q, index) => ({
          ...q,
          statement: questionsDetails[index] ? questionsDetails[index].statement : 'Detalhe indisponível',
          title: questionsDetails[index] ? questionsDetails[index].title : 'Título indisponível',
          image: questionsDetails[index] ? questionsDetails[index].image : 'Imagem indisponível',
          rightAnswer: questionsDetails[index] ? questionsDetails[index].rightAnswer : 'Resposta indisponível',
          difficulty: questionsDetails[index] ? questionsDetails[index].difficulty : 'Dificuldade indisponível'
        }));

        setUserQuestions(updatedQuestions);

        const correctAnswers = updatedQuestions.reduce((acc, question) => acc + (handleResult(question.position, question.rightAnswer) === '✅' ? 1 : 0), 0);

        setCorrectAnswersCount(correctAnswers);
      } else {
        console.error('Resposta da API não contém "questions"');
      }
    } catch (error) {
      console.error('Erro ao buscar candidato:', error);
    }
  };

  /**
 * Determines the result of a user's answer to a question by comparing it against the correct answer.
 * The user's answer is represented by a numeric index, which is converted to a corresponding letter
 * (e.g., 0 to A, 1 to B, etc.). The correct answer is decrypted before comparison.
 *
 * @param {number} userAnswer - The numeric index of the user's selected answer option.
 * @param {string} rightAnser - The encrypted string of the correct answer option.
 * @returns {string} A string indicating whether the user's answer is correct (✅) or incorrect (❌).
 */
  const handleResult = (userAnswer: number, rightAnser: string) => {
    if(String.fromCharCode(64 + (userAnswer + 1)) === decryptRightAnswer(rightAnser)){
      return ('✅');
    }

    return ('❌');
  };

  /**
 * Executes the `fetchExam` function to retrieve exam details for a specific ID when the component mounts or when the `id` changes.
 * This effect ensures that the component fetches and updates the exam information relevant to the current `id`.
 */
  React.useEffect(() => {
    if (id) {
      fetchExam(id);
    }
  }, [id]);

  /**
 * Toggles the visibility state of the question preview dialog. It inverses the current state
 * to show or hide the preview based on user interaction.
 */
  const handlePreviewQuestion = () => {
    setOpenQuestionPreview(!openQuestionPreview);
  };

  /**
 * Maps user questions to a format suitable for CSV export, including details such as the candidate's name,
 * document, question position, difficulty level, user's answer, correct answer, and the result of the comparison.
 * The difficulty is translated into human-readable form, and answers are converted from numeric indexes to letters.
 */
  const csvData = userQuestions.map((item, index) => ({
    NomeDoCandidato: candidate.name,
    DocumentoDoCandidato: candidate.document,
    Posicao: index + 1,
    Nível: item.difficulty === 1 ? 'fácil' : item.difficulty === 2 ? 'média' : 'difícil',
    AlternativaDoUsuario: String.fromCharCode(64 + (item.position + 1)),
    AlternativaCorreta: decryptRightAnswer(item.rightAnswer),
    Resultado: handleResult(item.posiiton, item.rightAnswer)
  }));

  const syncCandidate = async (candidateDocument: string) => {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': `${import.meta.env.VITE_API_KEY}`
        }
      };

      const response = await fetch(`${import.meta.env.VITE_DES_API_URL}/form/cpf/${candidateDocument}`, options);
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      const data = await response.json();

      const patchOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'api-key': `${import.meta.env.VITE_API_KEY}`
        },
        body: JSON.stringify({ score: correctAnswersCount })
      };

      const patchResponse = await fetch(`${import.meta.env.VITE_DES_API_URL}/form/${data.id}/prova`, patchOptions);

      if (!patchResponse.ok) {
        throw new Error('Erro na atualização do score do candidato');
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleSyncScore = async () => {
    if (!id) {
      console.error('ID do candidato não disponível');
      return;
    }

    syncCandidate(candidate.document);

    try {
      const patchOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newScore: correctAnswersCount })
      };

      const response = await fetch(`http://localhost:3000/userexams/${id}/score`, patchOptions);

      if (!response.ok) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: 'error',
          title: 'Falha ao realizar sincronização!',
          text: 'Erro na atualização do score do candidato',
        });

        throw new Error('Erro na atualização do score do candidato');

      }

      if (response.ok) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: 'success',
          title: 'Sincronização realizada com sucesso!',
          text: `O resultado do candidato ${candidate.name} foram atualizados com sucesso!`,
        });
      }

      console.log('Score do candidato atualizado com sucesso.');

    } catch (error) {
      console.error('Erro ao sincronizar o score:', error);
    }
  };

  const handleSync = () => {
    if (!candidate.document) {
      return;
    }

    handleSyncScore();
  };

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
          <span className='mb-4 w-full'>
            <Typography variant='small' className='dark:text-white'>Candidato</Typography>

            <div className='flex items-center gap-4'>
              {candidate.name && <Typography variant='h4' className='dark:text-white'>{candidate.name}</Typography>}
              <Chip
                color='blue'
                value={
                  <span className='flex items-center gap-2'>
                    <Typography
                      variant="small"
                      color="white"
                      className="font-medium capitalize leading-none"
                    >
                    Total de acertos: {' '}
                    </Typography>
                    <Typography variant='small'>{correctAnswersCount} /</Typography>
                    <Typography variant='small'>{userQuestions.length}</Typography>
                  </span>
                }
              />

              {/* <Tooltip content={'Nota do candidato sincronizada'}>
                <Chip color='light-green'
                  value={
                    <BadgeCheck />
                  }
                />
              </Tooltip> */}
            </div>

            {candidate.createdAt && <Typography variant='paragraph' className='dark:text-white'>{formatDate(candidate.createdAt)}</Typography>}

            <div className='mt-2 w-full rounded-md bg-blue-200/40 px-4 py-2 shadow-sm'>
              <Typography className='font-bold text-blue-gray-900 dark:text-white'>O botão de sincronizar serve para sincronizar a nota do candidato para caso a nota não esteja no banco de dados principal. Evite cliques ecessivos.</Typography>
            </div>
          </span>
        </div>
        <div className='flex w-full items-end justify-end'>
          <Button
            className='mr-3 flex items-center gap-4 whitespace-nowrap rounded-bl-none rounded-br-none'
            color='light-green'
            onClick={handleSync}
          >
            Sincronizar
            <UserCheck size={20} />
          </Button>

          <CSVLink
            data={csvData}
            filename={'dados-candidato.csv'}
            target="_blank"
          >
            <Button className='flex items-center gap-4 whitespace-nowrap rounded-bl-none rounded-br-none' color='cyan'>Exportar CSV <Table size={20} /></Button>
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
