import React from 'react';
import { Button, Card, Input, Typography } from '@material-tailwind/react';
import { BackButton } from '../../components/BackButton';
import { StateAndCountySelector } from '../../components/StateAndCountySelector';
import { ArrowUp, FileCheck } from 'lucide-react';

function NewCandidates() {

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const pathWithoutQuery = url.pathname;
    window.history.pushState({}, '', pathWithoutQuery);
  }, []);

  return (
    <>
      <BackButton path='/home'/>
      <section>
        <Card className='w-full bg-white/80 p-4'>
          <StateAndCountySelector />
        </Card>
      </section>

      <span className='flex w-full items-center justify-between'>
        <Typography variant='h4' className='dark:text-white'>Candidatos</Typography>
      </span>

      <div className='h-[3rem] w-full'>
        <Typography variant='h5' className='dark:text-white'>Lista de candidatos referentes ao processo</Typography>
      </div>

      <div className='-mt-4 mb-2 grid min-h-[5rem] w-full grid-cols-4 gap-4'>
        <Card className='h-full w-full p-4'
        >
          <div className='flex items-center gap-2 text-black'>
            <FileCheck size={20}  />
            <Typography variant='h6' className='m-0'> Total de provas </Typography>
          </div>
          <div className='my-2 flex w-full items-center justify-center'>
            <Typography variant='lead' className='text-4xl font-bold' color='black'>
              {/* {candidates.length} */}300
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

      <Card className='flex w-full p-4'>
        <div className='flex gap-2'>
          <Input crossOrigin={undefined} label='Buscar por nome' className=''/>
          {/* <span className='w-[10rem]'> */}
          <Input
            crossOrigin={undefined}
            label='Data de prova'
            className='w-full'
            type='date'
            disabled
          />
          {/* </span> */}
          <Button disabled className='flex items-center gap-2 whitespace-nowrap' size='sm' color='orange'>Ordernar pontuação: Crescente <ArrowUp size={18}/> </Button>
        </div>
      </Card>
    </>
  );
}

export default NewCandidates;
