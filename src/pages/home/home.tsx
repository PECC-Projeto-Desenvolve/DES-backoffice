import React from 'react';
import { Banner } from '../../components/Banner';
import { File, SearchCheck, MapPin, Users2 } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { populateQuestions } from '../../store/slices/questionsSlice';

function Home() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const questions = useSelector((state) => state.question.questions);
  const dispatch = useDispatch();



  React.useEffect(() => {
    console.log(questions);
  }, [questions]);


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

      <div>
        <button onClick={() => {
          dispatch(populateQuestions([{
            id: 2,
            title: 'hue',
            statement: 'ashushuasushaus'
          }]));
        }}>hue</button>
      </div>
    </>
  );
}

export { Home };
