import { Card, Typography } from '@material-tailwind/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../../../components/BackButton';
import { formatDate } from '../../../utils';

function CadidateDetails() {
  const [candidate, setCandidate] = React.useState([]);
  const [userQuestions, setUserQuestions] = React.useState([]);

  const { id } = useParams();

  const fetchExam = (id: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/userexams/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setCandidate(data);
        if (data && data.questions) {
          setUserQuestions(data.questions);
        } else {
          console.error('Resposta da API não contém "questions"');
        }
      })
      .catch(error => console.error('Erro ao buscar candidato:', error));
  };

  React.useEffect(() => {
    if (id) {
      fetchExam(id);
    }
  }, [id]);

  return (
    <>
      <BackButton />
      <span>
        <Typography variant='small'>Candidato</Typography>
        <Typography variant='h4'>{candidate.name}</Typography>
        <Typography variant='paragraph'>{formatDate(candidate.createdAt)}</Typography>
      </span>

      <div className='h-full w-full bg-red-100'>
        <Card>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-center">Questão</th>
                <th className="border border-gray-300 p-2 text-center">Alternativa do Usuário</th>
                <th className="border border-gray-300 p-2 text-center">Alternativa Correta</th>
                <th className="border border-gray-300 p-2 text-center">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {userQuestions.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center" id='question-id'>{item.questionId}</td>
                  <td className="border border-gray-300 p-2 text-center">{String.fromCharCode(64 + (item.position + 1))}</td>
                  <td className="border border-gray-300 p-2 text-center">{item.id}</td>
                  <td className="border border-gray-300 p-2 text-center">{item.position}</td>
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
