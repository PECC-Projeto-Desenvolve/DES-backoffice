import {
  Button,
  Card,
  CardFooter,
  Typography,
} from '@material-tailwind/react';
import { ClipboardSignature, FilePlus2, SearchCheck, Tags, TextSelect } from 'lucide-react';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Banner, ExamCard, Skeleton } from '../../components';

import { BackButton } from '../../components/BackButton';

/**
 * Component representing the Exam page.
 * @returns {JSX.Element} The Exam component structure.
 */
function Exam(): JSX.Element {
  const [exams, setExams] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  /**
 * Fetches the list of exams from the server and updates the component's state with the fetched data.
 * Sets the loading state to true before starting the fetch operation and to false upon completion or error.
 */
  const fetchExams = () => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/exams`)
      .then(response => response.json())
      .then(data => {
        setExams(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar provas:', error);
        setIsLoading(false);
      });
  };

  /**
 * Invokes `fetchExams` to load the exams when the component mounts.
 * The empty dependency array ensures this effect runs only once after the initial render.
 */
  React.useEffect(() => {
    fetchExams();
  }, []);

  return (
    <>
      <BackButton />

      <div className='grid h-full w-full grid-cols-2 gap-4 '>
        <div className='relative flex w-full flex-col gap-2'>

          {isLoading ? (
            <>
              <Typography variant='h4'>Provas criadas</Typography>
              <section className='flex flex-col gap-2'>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </section>
            </>
          ) : exams.length === 0 ? (
            <Card className='mb-4 p-4'>
              <div>
                <Typography variant='h5' color='black'>Você ainda não tem provas criadas</Typography>
              </div>

              <CardFooter>
                <Button fullWidth color='green' onClick={() => navigate('form')}>Criar prova</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <Typography variant='h4'>Provas criadas</Typography>
              <ul className='relative flex h-full w-full animate-fade-in-down flex-col items-start gap-2 overflow-y-scroll'>
                {exams.map((exam, index) => (
                  <ExamCard
                    key={index}
                    title={exam.title}
                    createdAt={exam.createdAt}
                    updatedAt={exam.updatedAt}
                    difficulty={exam.difficulty}
                    id={exam.id}
                    handleDeleteCompleted={fetchExams}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
        <div className='relative w-full'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1  lg:grid-cols-2'>
            <Banner
              rounded='rounded-lg'
              icon={<TextSelect size={20}/>}
              title="Criar Questões"
              description={
                'Crie questões diversificadas, incluindo múltipla escolha, dissertativas e verdadeiro ou falso, para uma avaliação abrangente.'
              }
              path='/question/form'
            />
            <Banner
              rounded='rounded-lg'
              icon={<FilePlus2 size={20}/>}
              title="Criar Prova"
              description={
                'Desenvolva avaliações personalizadas, selecionando questões e formatando estruturas de prova de acordo com suas necessidades'
              }
              path='/exam/form'
            />
            <Banner
              rounded='rounded-lg'
              icon={<Tags size={20} />}
              title="Gerenciar Categorias"
              description={
                'Organize questões em categorias temáticas, facilitando a busca e a composição de provas mais eficazes.'
              }
              path='/categories'
              disabled
            />
            <Banner
              rounded='rounded-lg'
              icon={<SearchCheck size={20} />}
              title="Gerenciar Processos"
              description={
                'Gerencie processos seletivos, definindo critérios de avaliação e empregando provas para selecionar os melhores candidatos.'
              }
              path='/process'
              disabled
            />
            <Banner
              rounded='rounded-lg'
              icon={<ClipboardSignature size={20} />}
              title="Gerenciar Questões"
              description={
                'Edite, exclua ou revise questões existentes, mantendo o banco de questões atualizado e relevante.'
              }
              path='/questions'
            />
          </div>
        </div>
      </div>

    </>
  );
}

export { Exam };
