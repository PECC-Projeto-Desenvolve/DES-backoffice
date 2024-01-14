import React from 'react';
import { Button, Card, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { Eye, RotateCw } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';

function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = React.useState([]);

  const [reload, setReload] = React.useState(false);

  const fetchCandidates = () => {
    fetch('http://localhost:3000/userexams')
      .then(response => response.json())
      .then(data => {
        setCandidates(data);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleReload = () => {
    setReload(!reload);

    fetchCandidates();

    if (candidates) {
      setReload(false);
    }
  };

  const handlePreview = (param: string) => {
    navigate(`/candidate/${param}`);
  };

  React.useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <>
      <BackButton/>
      <span className='flex w-full items-center justify-between'>
        <Typography variant='h4'>Candidatos</Typography>

        <Button
          color='green'
          className='flex items-center justify-center gap-4 transition-all'
          onClick={handleReload}
          disabled={reload}
        >
          {!reload ? <RotateCw size={20} className=""/> : <RotateCw size={20} className="animate-spin"/> }
          {!reload && 'Atualizar lista' }
        </Button>
      </span>

      <div className='h-[3rem] w-full'>
        <Typography variant='h5'>Lista de candidatos referentes ao processo tal</Typography>
      </div>

      <Card className="h-full w-full overflow-scroll">
        <table className=" table-auto border-collapse border border-gray-300">
          <thead className="bg-blue-gray-50">
            <tr>
              <th className="border border-gray-300 p-2">Candidato</th>
              <th className="border border-gray-300 p-2">CPF</th>
              <th className="border border-gray-300 p-2">Data e hora da Prova</th>
              <th className="border border-gray-300 p-2">Qtd. Questões</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                <td className="border border-gray-300 p-2 text-center">{candidate.name}</td>
                <td className="border border-gray-300 p-2 text-center">{candidate.document}</td>
                <td className="border border-gray-300 p-2 text-center">{formatDate(candidate.createdAt)}</td>
                <td className="border border-gray-300 p-2 text-center">10</td>
                <td className="border border-gray-300 p-2 text-center">aprovado</td>
                <td className="flex items-center justify-center border border-gray-300 p-2">
                  <Tooltip content='Ver resultado'>
                    <IconButton
                      color='blue'
                      onClick={() => handlePreview(candidate.id)}
                    >
                      <Eye />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export default Candidates;
