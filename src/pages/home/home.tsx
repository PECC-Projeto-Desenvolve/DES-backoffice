import React from 'react';
import { Banner } from '../../components/Banner';
import { File } from 'lucide-react';

function Home() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Banner
          icon={<File />}
          title="Provas"
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
        />

        <Banner
          icon={<File />}
          title="Provas"
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
        />

        <Banner
          icon={<File />}
          title="Provas"
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
        />

        <Banner
          icon={<File />}
          title="Provas"
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis necessitatibus sunt ad in dolore laborum quae iure praesentium!'
          }
        />
      </div>
    </>
  );
}

export { Home };
