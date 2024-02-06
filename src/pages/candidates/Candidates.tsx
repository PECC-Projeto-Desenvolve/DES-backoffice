import React from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import { AlertTriangle, Eye, FileCheck, RotateCw, Trash } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';

function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = React.useState([]);
  const [candidateToDelete, setCandidatesToDelete] = React.useState('');
  const [candidateNameToDelete, setCandidatesNameToDelete] = React.useState('');
  const [candidateDocToDelete, setCandidatesDocToDelete] = React.useState('');
  const [openDelete, setOpenDelete] = React.useState(false);

  const [tokenDelete, setTokenDelete] = React.useState('');

  const [reload, setReload] = React.useState(false);

  const fetchCandidates = () => {
    fetch(`${import.meta.env.VITE_API_URL}/userexams`)
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

  const handleOpenDelete = () => {
    setOpenDelete(!openDelete);
    setTokenDelete('');
  };

  const handleConfirmCandidateDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/userexams/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar a candidato');
      }

      handleOpenDelete();
      setCandidatesToDelete('');

      setTimeout(() => {
        fetchCandidates();
      }, 500);

      console.log('Candidato deletada com sucesso');
    } catch (error) {
      console.error('Erro ao deletar a candidato:', error);
    }
  };

  React.useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <>
      <Dialog
        open={openDelete}
        handler={handleOpenDelete}
      >
        <DialogHeader className='gap-2' >
          <AlertTriangle color='orange'/>
          <Typography variant='h4' color='orange'>
            Ação irreversível
          </Typography>
        </DialogHeader>

        <DialogBody className='-mt-4 flex flex-col items-center'>
          <Typography variant='lead'>
    Ao clicar em confirmar, você estará removendo permanentemente este candidato
          </Typography>

          <div className='mb-4 mt-2 w-fit rounded-md bg-[#f4f4f4] p-4'>
            <Typography variant='lead'>
              {candidateNameToDelete}
            </Typography>
            {/*  */}
            <Typography variant='lead'>
              {candidateDocToDelete}
            </Typography>
          </div>

          <Input
            crossOrigin={''}
            label='Token'
            value={tokenDelete}
            type="password"
            size='lg'
            onChange={(e) => setTokenDelete(e.target.value)}
          />
        </DialogBody>

        <DialogFooter className='gap-4'>
          <Button
            color='green'
            onClick={() => {
              setCandidatesToDelete('');
              handleOpenDelete();
            }}
          >
            Cancelar
          </Button>

          <Button
            color='red'
            onClick={() => handleConfirmCandidateDelete(candidateToDelete)}
            disabled={tokenDelete != 'LpI0k7pl2lUEX0L8'}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </Dialog>

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
        <Typography variant='h5'>Lista de candidatos referentes ao processo</Typography>
      </div>

      <div className='mb-2 grid min-h-[5rem] w-full grid-cols-4 gap-4'>
        <Card className='h-full w-full p-4'
        >
          <div className='flex items-center gap-2 text-black'>
            <FileCheck size={20}  />
            <Typography variant='h6' className='m-0'> Total de provas </Typography>
          </div>
          <div className='my-2 flex w-full items-center justify-center'>
            <Typography variant='lead' className='text-4xl font-bold' color='black'>
              {candidates.length}
            </Typography>
          </div>
        </Card>

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
                <td className="border border-gray-300 p-2 text-center">###</td>
                <td className="border border-gray-300 p-2 text-center">#####</td>
                <td className="flex items-center justify-center gap-2 border border-gray-300 p-2">
                  <Tooltip content='Excluir candidato'>
                    <IconButton
                      color='red'
                      onClick={() => {
                        setCandidatesToDelete(candidate.id);
                        setCandidatesNameToDelete(candidate.name);
                        setCandidatesDocToDelete(candidate.document);
                        handleOpenDelete();
                      }}
                    >
                      <Trash />
                    </IconButton>
                  </Tooltip>
                  {/*  */}
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
