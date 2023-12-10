import {
  Typography,
} from '@material-tailwind/react';
import { FilePlus2, SearchCheck, Tags, TextSelect } from 'lucide-react';

import React from 'react';
import { Banner, ExamCard } from '../../components';

import { BackButton } from '../../components/BackButton';

function Exam(): JSX.Element {
  const [exams, setExams] = React.useState([]);

  const fetchExams = () => {
    fetch('http://localhost:3000/exams')
      .then(response => response.json())
      .then(data => setExams(data))
      .catch(error => console.error('Erro ao buscar provas:', error));
  };

  React.useEffect(() => {
    fetchExams();
  }, []);

  return (
    <>
      <div className='flex h-full w-full flex-col gap-2 overflow-hidden rounded bg-white p-4 transition-all'>

        <BackButton />

        <div className='grid h-full w-full grid-cols-2 gap-2 '>
          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border px-2 py-4'>
            {exams.length == 0 ? (
              <>
                <span className='w-full'>
                  <Typography variant="h4">Você ainda não possui provas criadas</Typography>
                </span>
              </>
            ):(
              <>
                <span className='w-full'>
                  <Typography variant="h4">Provas criadas</Typography>
                </span>
                <ul className='relative flex h-full w-full animate-fade-in-down flex-col items-start gap-2 overflow-y-scroll'>
                  {
                    exams.map((exam, index) => (
                      <>
                        <ExamCard
                          key={index}
                          title={exam.title}
                          createdAt={exam.createdAt}
                          updatedAt={exam.updatedAt}
                          difficulty={exam.difficulty}
                          id={exam.id}
                          handleDeleteCompleted={() => fetchExams()}
                        />
                      </>

                    ))
                  }
                </ul>
              </>
            )}

          </div>
          <div className='relative w-full rounded-md border px-2 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <Banner
                rounded='rounded-sm'
                icon={<TextSelect size={20}/>}
                title="Criar Questões"
                description={
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
                }
                path='/question/form'
              />
              <Banner
                rounded='rounded-sm'
                icon={<FilePlus2 size={20}/>}
                title="Criar Prova"
                description={
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
                }
                path='/exam/form'
              />
              <Banner
                rounded='rounded-sm'
                icon={<Tags size={20} />}
                title="Gerenciar Categorias"
                description={
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
                }
                path='/categories'
              />
              <Banner
                rounded='rounded-sm'
                icon={<SearchCheck size={20} />}
                title="Gerenciar Processos"
                description={
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
                }
                path='/process'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Exam };
