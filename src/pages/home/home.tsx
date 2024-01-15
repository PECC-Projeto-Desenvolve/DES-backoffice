import { Banner } from '../../components';
import { File, SearchCheck, MapPin, Users2 } from 'lucide-react';

function Home() {

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Banner
          icon={<SearchCheck />}
          title="Processos"
          description={
            'Área para gerenciamento de processos seletivos.'
          }
          path='/process'
        />

        <Banner
          icon={<Users2 />}
          title="Candidatos"
          description={
            'Área para o gerenciamento de candidatos.'
          }
          path='/candidates'
        />

        <Banner
          icon={<MapPin />}
          title="Cidades"
          description={
            'Área para gerenciamento de cidades aptas a receber um processo seletivo'
          }
          path='/'
        />

        <Banner
          icon={<File />}
          title="Provas"
          description={
            'Área de gerenciamento de provas, onde você tem a possibilidade de criar provas e questões'
          }
          path='/exam'
        />
      </div>
    </>
  );
}

export { Home };
