import React from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import { AlertTriangle, Eye, FileCheck, FileSpreadsheet, MenuSquare, RotateCw, Trash } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';

/**
 * Renders a Candidates component that displays a list of candidates and their exam details.
 * Includes functionality to delete a candidate, preview candidate results, and reload the candidate list.
 * Utilizes Material Tailwind components for UI elements and Lucide icons for visual cues.
 *
 * @returns {JSX.Element} A comprehensive view that includes a dialog for deleting candidates,
 * a button to go back, and dynamic content showing the total number of exams and candidate details.
 */
function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = React.useState<any[]>([]);

  const [candidateToDelete, setCandidatesToDelete] = React.useState<string>('');
  const [candidateNameToDelete, setCandidatesNameToDelete] = React.useState<string>('');
  const [candidateDocToDelete, setCandidatesDocToDelete] = React.useState<string>('');

  const [openDelete, setOpenDelete] = React.useState<boolean>(false);

  const [tokenDelete, setTokenDelete] = React.useState<string>('');

  const [reload, setReload] = React.useState<boolean>(false);

  /**
 * Fetches the list of candidates and their exam details from the server.
 * Updates the component's state with the fetched data to display the list of candidates.
 */
  const fetchCandidates = () => {
    fetch(`${import.meta.env.VITE_API_URL}/userexams`)
      .then(response => response.json())
      .then(data => {
        setCandidates(data);
      })
      .catch((error) => console.error('Error:', error));
  };

  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API_URL}/userexams`);
  //       if (!response.ok) {
  //         throw new Error('Erro ao buscar candidatos');
  //       }
  //       const candidatesData = await response.json();

  //       const scorePromises = candidatesData.map(async (candidate) => {
  //         try {
  //           const cpfResponse = await fetch(`http://a81810609ea6e4d2d92049c3603105d0-2068008776.us-east-1.elb.amazonaws.com/form/cpf/${candidate.document}`, {
  //             method: 'GET',
  //             headers: {
  //               'Content-Type': 'application/json',
  //               'api-key': `${import.meta.env.VITE_API_KEY}`,
  //             },
  //           });

  //           if (!cpfResponse.ok) {
  //             throw new Error('Erro ao buscar dados do candidato');
  //           }
  //           const cpfData = await cpfResponse.json();

  //           const score = cpfData.score ? cpfData.score : null;

  //           return { ...candidate, score };
  //         } catch (error) {
  //           console.error('Erro ao buscar score do candidato:', error);
  //           return { ...candidate, score: null };
  //         }
  //       });

  //       const updatedCandidates = await Promise.all(scorePromises);

  //       setCandidates(updatedCandidates);
  //     } catch (error) {
  //       console.error('Erro geral:', error);
  //     }
  //   };
  /**
 * Toggles the reload state to initiate the fetching of candidates data again.
 * It calls `fetchCandidates` to refresh the list of candidates and resets the reload state afterwards.
 */
  const handleReload = () => {
    setReload(!reload);

    fetchCandidates();

    if (candidates) {
      setReload(false);
    }
  };

  /**
 * Navigates to the detail view of a specific candidate identified by their unique ID.
 *
 * @param {string} param - The unique identifier for the candidate.
 */
  const handlePreview = (param: string) => {
    navigate(`/candidate/${param}`);
  };

  /**
 * Toggles the visibility of the delete confirmation dialog and resets the deletion token input field.
 */
  const handleOpenDelete = () => {
    setOpenDelete(!openDelete);
    setTokenDelete('');
  };

  /**
 * Asynchronously sends a request to delete a candidate by their unique identifier.
 * Upon successful deletion, it closes the delete confirmation dialog, clears the candidate to delete state,
 * and refreshes the list of candidates after a brief delay.
 *
 * @param {string} id - The unique identifier of the candidate to be deleted.
 */
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

  const sortedCandidates = [...candidates].sort((a, b) => {

    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return dateA - dateB;
  });

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
        <Typography variant='h4' className='dark:text-white'>Candidatos</Typography>


      </span>

      <div className='h-[3rem] w-full'>
        <Typography variant='h5' className='dark:text-white'>Lista de candidatos referentes ao processo</Typography>
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

        <Card className='h-full w-full p-4'>

        </Card>
        <Card className='h-full w-full p-4'>

        </Card>
        <Card className='h-full w-full p-4'>

        </Card>

      </div>

      <div className=' flex flex-col items-end'>
        <span className='flex gap-4'>
          <Button
            color='blue-gray'
            className='flex items-center justify-center gap-4 rounded-b-none transition-all'
            onClick={handleReload}
            disabled
          >
            <MenuSquare size={20}/>
            Ação em massa
          </Button>
          {/*  */}
          <Button
            color='blue'
            className='flex items-center justify-center gap-4 rounded-b-none transition-all'
            onClick={handleReload}
            disabled
          >
            <FileSpreadsheet size={20}/>
            Baixar CSV
          </Button>
          {/*  */}
          <Button
            color='green'
            className='flex items-center justify-center gap-4 rounded-b-none transition-all'
            onClick={handleReload}
            disabled={reload}
          >
            {!reload ? <RotateCw size={20} className=""/> : <RotateCw size={20} className="animate-spin"/> }
            {!reload && 'Atualizar lista' }
          </Button>
        </span>
        <Card className="h-full w-full overflow-scroll rounded-r-none">
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
              {sortedCandidates.map((candidate, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50">
                  <td className="border border-gray-300 p-2 text-center">{candidate.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{candidate.document}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatDate(candidate.createdAt)}</td>
                  <td className="border border-gray-300 p-2 text-center"><strong>{candidate.score == null ? '###' : candidate.score}</strong> / 40</td>
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
      </div>
    </>
  );
}

export default Candidates;
