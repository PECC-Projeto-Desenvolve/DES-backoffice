import React from 'react';

import {
    Button,
    Card,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Input,
    Option,
    Select,
    Tooltip,
    Typography,
} from '@material-tailwind/react';
import {
    AlertTriangle,
    ArrowUp,
    Eye,
    FileCheck,
    FileSpreadsheet,
    MenuSquare,
    RotateCw,
    Trash,
    CheckCircle,
} from 'lucide-react';
import { BackButton } from '../../components/BackButton';
// import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';
import { getCorrectAnswers } from '../../utils/calculateNote';
import { maskNumbers } from '../../utils/maskNumbers';
import Swal from 'sweetalert2';

/**
 * Renders a Candidates component that displays a list of candidates and their exam details.
 * Includes functionality to delete a candidate, preview candidate results, and reload the candidate list.
 * Utilizes Material Tailwind components for UI elements and Lucide icons for visual cues.
 *
 * @returns {JSX.Element} A comprehensive view that includes a dialog for deleting candidates,
 * a button to go back, and dynamic content showing the total number of exams and candidate details.
 */
function Candidates() {
    //   const navigate = useNavigate();
    const [candidates, setCandidates] = React.useState<any[]>([]);

    const [candidateToDelete, setCandidatesToDelete] =
        React.useState<string>('');
    const [candidateNameToDelete, setCandidatesNameToDelete] =
        React.useState<string>('');
    const [candidateDocToDelete, setCandidatesDocToDelete] =
        React.useState<string>('');

    const [openDelete, setOpenDelete] = React.useState<boolean>(false);

    const [tokenDelete, setTokenDelete] = React.useState<string>('');

    const [reload, setReload] = React.useState<boolean>(false);

    const [sortDirection, setSortDirection] = React.useState<
        'ascending' | 'descending'
    >('ascending');

    const toggleSortDirection = () => {
        setSortDirection((prevDirection) =>
            prevDirection === 'ascending' ? 'descending' : 'ascending'
        );
    };

    const [sortField, setSortField] = React.useState<string | null>(null); // Estado para campo de ordenação

    /**
  Filtro de candidados onde temos um estado para armazenar a data da prova e outro para o termo de busca.
  O estado filteredCandidates é um useMemo que filtra os candidatos únicos e aplica os filtros de busca.
  Função de filtro para candidados repetidos 
  
 */
    const [notaCorte, setNotaCorte] = React.useState<number>(0);
    const [selectedCity, setSelectedCity] = React.useState<string>(''); // Estado para a cidade selecionada
    const [searchTerm, setSearchTerm] = React.useState<string>(''); // Estado para termo de busca
    const [startDate, setStartDate] = React.useState<string>('');
    const [endDate, setEndDate] = React.useState<string>('');

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // Limpa o campo de 'endDate' ao mudar 'startDate' para garantir que o intervalo esteja correto
        if (!newStartDate) {
            setEndDate('');
        }
    };

    // Manipulador para 'endDate'
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };
    const filteredCandidates = React.useMemo(() => {
        const uniqueCandidates = new Map();
    
        candidates.forEach((candidate) => {
            if (!uniqueCandidates.has(candidate.document)) {
                uniqueCandidates.set(candidate.document, candidate);
            }
        });
    
        return Array.from(uniqueCandidates.values()).filter((candidate) => {
            const matchesNameOrCPF =
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.document.includes(searchTerm);
    
            const candidateDate = new Date(candidate.createdAt)
                .toISOString()
                .split('T')[0];
    
            const matchesDate = !endDate
                ? startDate
                    ? candidateDate === startDate
                    : true
                : startDate
                ? candidateDate >= startDate && candidateDate <= endDate
                : candidateDate <= endDate;
    
            const matchesCity = selectedCity
                ? candidate.cityName === selectedCity
                : true;
    
            const matchesNotaCorte = notaCorte === 0 || candidate.score >= notaCorte;
    
            return matchesNameOrCPF && matchesDate && matchesCity && matchesNotaCorte;
        });
    }, [candidates, searchTerm, startDate, endDate, selectedCity, notaCorte]);
    

    const preFilterCandidates = React.useMemo(() => {
        const uniqueCandidates = new Map();

        candidates.forEach((candidate) => {
            if (!uniqueCandidates.has(candidate.document)) {
                uniqueCandidates.set(candidate.document, candidate);
            }
        });

        return Array.from(uniqueCandidates.values());
    }, [candidates]);

    /**
     * Fetches the list of candidates and their exam details from the server.
     * Updates the component's state with the fetched data to display the list of candidates.
     */
    const fetchCandidates = async () => {
        setIsLoading(true); // Inicia o carregamento
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/userexams`
            );
            if (!response.ok) {
                throw new Error('Erro ao buscar candidatos');
            }
            const data = await response.json();

            const candidatesWithCelAndCity = await Promise.all(
                data.map(async (candidate) => {
                    const { cel, cityName } = await fetchCelFromCpf(
                        candidate.document
                    );
                    return { ...candidate, cel, cityName };
                })
            );

            setCandidates(candidatesWithCelAndCity);
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            setIsLoading(false); // Fim do carregamento
        }
    };

    const fetchCelFromCpf = async (cpf: string) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_DES_API_URL}/form/cpf/${cpf}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': `${import.meta.env.VITE_API_KEY}`, // Inclui o token da API no cabeçalho
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        'Não autorizado. Verifique a chave da API.'
                    );
                } else {
                    throw new Error(
                        'Erro ao buscar o número de celular e cidade'
                    );
                }
            }

            const data = await response.json();
            return {
                cel: data.cel || 'Não disponível',
                cityName: data.cityName || 'Desconhecida', // Retorna a cidade ou 'Desconhecida' se não disponível
            };
        } catch (error) {
            console.error('Erro ao buscar o celular e cidade:', error);
            return { cel: 'Erro', cityName: 'Erro' }; // Retorna 'Erro' em caso de falha
        }
    };

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
    //   const handlePreview = (param: string) => {
    //     navigate(`/candidate/${param}`);
    //   };

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
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/userexams/${id}`,
                {
                    method: 'DELETE',
                }
            );

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

    //   const sortedCandidates = [...candidates].sort((a, b) => {

    //     const dateA = new Date(a.createdAt).getTime();
    //     const dateB = new Date(b.createdAt).getTime();

    //     return dateA - dateB;
    //   });

    const sortedCandidates = React.useMemo(() => {
        if (!sortField) return filteredCandidates; // Se sortField for null, retorna a lista filtrada sem ordenação

        return [...filteredCandidates].sort((a, b) => {
            let valueA, valueB;

            // Define os valores a serem comparados com base no campo de ordenação
            switch (sortField) {
                case 'score':
                    valueA = a.score ?? 0;
                    valueB = b.score ?? 0;
                    break;
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'date':
                    valueA = new Date(a.createdAt).getTime();
                    valueB = new Date(b.createdAt).getTime();
                    break;
                default:
                    return 0; // Caso não tenha campo de ordenação definido
            }

            return sortDirection === 'ascending'
                ? valueA > valueB
                    ? 1
                    : -1
                : valueA < valueB
                ? 1
                : -1;
        });
    }, [filteredCandidates, sortDirection, sortField]);

    //definindo o estado de loading
    const [isLoading, setIsLoading] = React.useState(true);

    const confirmNote = async () => {
        const candidatesToSync = candidates.filter(
            (candidate) => candidate.score === null
        );

        for (const candidate of candidatesToSync) {
            await getCorrectAnswers(candidate.id);
        }

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
        Toast.fire({
            icon: 'success',
            title: 'Sincronização realizada com sucesso!',
            text: `O resultado do candidatos foram atualizados com sucesso!`,
        });
    };

    const notaDeCorte = () => {
        Swal.fire({
            title: 'Informe a nova nota de corte',
            input: 'text', // Modificado de "text" para "number"
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            showLoaderOnConfirm: true,
            preConfirm: async (value) => {
                const parsedValue = parseInt(value, 10); // Conversão para inteiro
                if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 40) {
                    return Swal.showValidationMessage(
                        'Insira um valor válido para a nota de corte.'
                    );
                }
                setNotaCorte(parsedValue); // Atualiza o estado da nota de corte
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });
    };

    return (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-screen">
                    <RotateCw
                        size={40}
                        className="animate-spin dark:text-white"
                    />
                    <Typography variant="h4" className="dark:text-white">
                        Carregando...
                    </Typography>
                </div>
            ) : (
                <>
                    <Dialog open={openDelete} handler={handleOpenDelete}>
                        <DialogHeader className="gap-2">
                            <AlertTriangle color="orange" />
                            <Typography variant="h4" color="orange">
                                Ação irreversível
                            </Typography>
                        </DialogHeader>

                        <DialogBody className="-mt-4 flex flex-col items-center">
                            <Typography variant="lead">
                                Ao clicar em confirmar, você estará removendo
                                permanentemente este candidato
                            </Typography>

                            <div className="mb-4 mt-2 w-fit rounded-md bg-[#f4f4f4] p-4">
                                <Typography variant="lead">
                                    {candidateNameToDelete}
                                </Typography>
                                {/*  */}
                                <Typography variant="lead">
                                    {candidateDocToDelete}
                                </Typography>
                            </div>

                            <Input
                                crossOrigin={''}
                                label="Token"
                                value={tokenDelete}
                                type="password"
                                size="lg"
                                onChange={(e) => setTokenDelete(e.target.value)}
                            />
                        </DialogBody>

                        <DialogFooter className="gap-4">
                            <Button
                                color="green"
                                onClick={() => {
                                    setCandidatesToDelete('');
                                    handleOpenDelete();
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                color="red"
                                onClick={() =>
                                    handleConfirmCandidateDelete(
                                        candidateToDelete
                                    )
                                }
                                disabled={tokenDelete != 'LpI0k7pl2lUEX0L8'}
                            >
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </Dialog>

                    <BackButton />

                    <span className="flex w-full items-center justify-between">
                        <Typography variant="h4" className="dark:text-white">
                            Candidatos
                        </Typography>
                    </span>

                    <div className="h-[3rem] w-full">
                        <Typography variant="h5" className="dark:text-white">
                            Lista de candidatos referentes ao processo
                        </Typography>
                    </div>

                    <div className="mb-2 grid min-h-[5rem] w-full grid-cols-4 gap-4">
                        <Card className="h-full w-full p-4">
                            <div className="flex items-center gap-2 text-black">
                                <FileCheck size={20} />
                                <Typography variant="h6" className="m-0">
                                    {' '}
                                    Total de provas{' '}
                                </Typography>
                            </div>
                            <div className="my-2 flex w-full items-center justify-center">
                                <Typography
                                    variant="lead"
                                    className="text-4xl font-bold"
                                    color="black"
                                >
                                    {preFilterCandidates.length}
                                </Typography>
                            </div>
                        </Card>

                        <Card className="h-full w-full p-4">
                            <div className="flex items-center gap-2 text-black">
                                <CheckCircle size={20} />
                                <Typography variant="h6" className="m-0">
                                    {' '}
                                    Total de aprovados
                                </Typography>
                            </div>
                            <div className="my-2 flex w-full items-center justify-center">
                                {notaCorte === 0 ? (
                                    <Typography
                                        variant="lead"
                                        className="text-gray-500 text-center"
                                    >
                                        Defina uma nota de corte para filtrar
                                    </Typography>
                                ) : (
                                    <Typography
                                        variant="lead"
                                        className="text-4xl font-bold"
                                        color="black"
                                    >
                                        {
                                            filteredCandidates.filter(
                                                (candidate) =>
                                                    candidate.score >= notaCorte
                                            ).length
                                        }
                                    </Typography>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-black">
                                <Typography variant="h6" className="m-0">
                                    Nota de corte: <strong>{notaCorte}</strong>
                                </Typography>
                            </div>
                        </Card>

                        <Card
                            className="h-full w-full p-4"
                            children={''}
                        ></Card>
                        <Card
                            className="h-full w-full p-4"
                            children={''}
                        ></Card>
                    </div>

                    <Card className="flex w-full px-2 py-4">
                        <div className="grid grid-cols-5 gap-2">
                            <Input
                                crossOrigin={undefined}
                                label="Buscar por nome ou CPF"
                                className=""
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado ao digitar
                            />
                            <Select
                                label="Buscar por município"
                                className=""
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e)}
                            >
                                {/* Substitua estas opções pelas cidades disponíveis, ou crie dinamicamente */}
                                <Option value="">Todas as cidades</Option>
                                <Option value="Itabira">Itabira</Option>
                                {/* Adicione mais opções de cidades conforme necessário */}
                            </Select>

                            {/* <span className='w-[10rem]'> */}
                            <Input
                                crossOrigin=""
                                label="Data de início"
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                            <Input
                                crossOrigin=""
                                label="Data de fim"
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                disabled={!startDate} // Desabilitado até que startDate tenha valor
                            />
                            <Button
                                onClick={() => {
                                    setStartDate('');
                                    setSearchTerm('');
                                    setSelectedCity('');
                                    setSortField(null); // Limpa o campo de ordenação
                                    setSortDirection('ascending'); // Reseta a direção de ordenação para o padrão
                                    setEndDate('');
                                    setStartDate('');
                                }}
                                className="flex items-center gap-2 whitespace-nowrap"
                                size="sm"
                                color="red"
                            >
                                Limpar Filtros
                            </Button>

                            {/* </span> */}
                        </div>
                    </Card>

                    <div className=" flex flex-col items-end">
                        <span className="flex gap-4">
                            <Button
                                color="gray"
                                className="flex items-center justify-center gap-4 rounded-b-none transition-all"
                                onClick={notaDeCorte}
                            >
                                Definir nota de corte
                            </Button>
                            <Button
                                color="blue-gray"
                                className="flex items-center justify-center gap-4 rounded-b-none transition-all"
                                onClick={handleReload}
                                disabled
                            >
                                <MenuSquare size={20} />
                                Ação em massa
                            </Button>
                            {/*  */}
                            <Button
                                color="blue"
                                className="flex items-center justify-center gap-4 rounded-b-none transition-all"
                                onClick={handleReload}
                                disabled
                            >
                                <FileSpreadsheet size={20} />
                                Baixar CSV
                            </Button>
                            {/*  */}
                            <Button
                                color="green"
                                className="flex items-center justify-center gap-4 rounded-b-none transition-all"
                                onClick={confirmNote}
                            >
                                Sincronizar notas
                            </Button>
                            {/*  */}
                            <Button
                                color="green"
                                className="flex items-center justify-center gap-4 rounded-b-none transition-all"
                                onClick={handleReload}
                                disabled={reload}
                            >
                                {!reload ? (
                                    <RotateCw size={20} className="" />
                                ) : (
                                    <RotateCw
                                        size={20}
                                        className="animate-spin"
                                    />
                                )}
                                {!reload && 'Atualizar lista'}
                            </Button>
                        </span>
                        <Card className="h-full w-full overflow-scroll rounded-r-none">
                            <table className=" table-auto border-collapse border border-gray-300">
                                <thead className="bg-blue-gray-50">
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-center">
                                            <Button
                                                onClick={() => {
                                                    setSortField('name');
                                                    toggleSortDirection();
                                                }}
                                                className="flex items-center justify-center w-full gap-2 whitespace-nowrap text-white"
                                                size="sm"
                                            >
                                                Nome{' '}
                                                {sortField === 'name' && (
                                                    <ArrowUp
                                                        size={18}
                                                        className={`${
                                                            sortDirection ===
                                                            'descending'
                                                                ? 'rotate-180'
                                                                : ''
                                                        } `}
                                                    />
                                                )}
                                            </Button>
                                        </th>
                                        <th className="border border-gray-300 p-2 text-center">
                                            CPF
                                        </th>
                                        <th className="border border-gray-300 p-2 text-center">
                                            Celular
                                        </th>
                                        <th className="border border-gray-300 p-2 text-center">
                                            <Button
                                                onClick={() => {
                                                    setSortField('date');
                                                    toggleSortDirection();
                                                }}
                                                className="flex items-center justify-center w-full gap-2 whitespace-nowrap text-white"
                                                size="sm"
                                            >
                                                Data da Prova{' '}
                                                {sortField === 'date' && (
                                                    <ArrowUp
                                                        size={18}
                                                        className={`${
                                                            sortDirection ===
                                                            'descending'
                                                                ? 'rotate-180'
                                                                : ''
                                                        } `}
                                                    />
                                                )}
                                            </Button>
                                        </th>
                                        <th className="border border-gray-300 p-2 text-center">
                                            <Button
                                                onClick={() => {
                                                    setSortField('score');
                                                    toggleSortDirection();
                                                }}
                                                className="flex items-center justify-center w-full gap-2 whitespace-nowrap text-white"
                                                size="sm"
                                            >
                                                Pontuação{' '}
                                                {sortField === 'score' && (
                                                    <ArrowUp
                                                        size={18}
                                                        className={`${
                                                            sortDirection ===
                                                            'descending'
                                                                ? 'rotate-180'
                                                                : ''
                                                        } `}
                                                    />
                                                )}
                                            </Button>
                                        </th>
                                        <th className="border border-gray-300 p-2 text-center">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 p-2 text-center">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sortedCandidates.map(
                                        (candidate, index) => (
                                            <tr
                                                key={index}
                                                className="even:bg-blue-gray-50/50"
                                            >
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {candidate.name}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {maskNumbers(
                                                        candidate.document
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {candidate.cel}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {formatDate(
                                                        candidate.createdAt
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    <strong>
                                                        {candidate.score == null
                                                            ? '###'
                                                            : candidate.score}
                                                    </strong>{' '}
                                                    / 40
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    #####
                                                </td>
                                                <td className="flex items-center justify-center gap-2 border border-gray-300 p-2">
                                                    {/*  */}
                                                    <Tooltip content="Ver resultado">
                                                        <a
                                                            className="rounded-lg bg-blue-600 p-2 text-white"
                                                            href={`/candidate/${candidate.id}`}
                                                            rel="noreferrer"
                                                        >
                                                            <Eye />
                                                        </a>
                                                    </Tooltip>
                                                    {/*  */}
                                                    <Tooltip content="Excluir candidato">
                                                        <IconButton
                                                            color="red"
                                                            onClick={() => {
                                                                setCandidatesToDelete(
                                                                    candidate.id
                                                                );
                                                                setCandidatesNameToDelete(
                                                                    candidate.name
                                                                );
                                                                setCandidatesDocToDelete(
                                                                    candidate.document
                                                                );
                                                                handleOpenDelete();
                                                            }}
                                                        >
                                                            <Trash />
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </>
            )}
        </>
    );
}

export default Candidates;
