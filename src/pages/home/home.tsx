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
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
          path='process'
        />

        <Banner
          icon={<Users2 />}
          title="Candidatos"
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
          path='candidates'
        />

        <Banner
          icon={<MapPin />}
          title="Cidades"
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
          path='cities'
        />

        <Banner
          icon={<File />}
          title="Provas"
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
          path='exam'
        />
      </div>
    </>
  );
}

export { Home };
