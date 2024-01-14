import React from 'react';
import { Button, Card, IconButton, Typography } from '@material-tailwind/react';
import { Eye, RotateCw } from 'lucide-react';
import { BackButton } from '../../components/BackButton';

function Candidates() {
  const [candidates, setCandidates] = React.useState([
    { nome: 'Átila', cpf: '12345678910', dataProva: '26/01/1998', qtdQuestoes: 30, status: 'aprovado' },
    { nome: 'Átila', cpf: '12345678910', dataProva: '26/01/1998', qtdQuestoes: 30, status: 'aprovado' },
    { nome: 'Átila', cpf: '12345678910', dataProva: '26/01/1998', qtdQuestoes: 30, status: 'aprovado' },
    { nome: 'Átila', cpf: '12345678910', dataProva: '26/01/1998', qtdQuestoes: 30, status: 'aprovado' },
  ]);

  const [reload, setReload] = React.useState(false);

  const handleReload = () => {
    setReload(!reload);
    setTimeout(() => {
      setReload(false);
    }, 1000);
  };

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
              <th className="border border-gray-300 p-2">Data da Prova</th>
              <th className="border border-gray-300 p-2">Qtd. Questões</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                <td className="border border-gray-300 p-2 text-center">{candidate.nome}</td>
                <td className="border border-gray-300 p-2 text-center">{candidate.cpf}</td>
                <td className="border border-gray-300 p-2 text-center">{candidate.dataProva}</td>
                <td className="border border-gray-300 p-2 text-center">{candidate.qtdQuestoes}</td>
                <td className="border border-gray-300 p-2 text-center">{candidate.status}</td>
                <td className="flex items-center justify-center border border-gray-300 p-2">
                  <IconButton>
                    <Eye />
                  </IconButton>
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
