import React from 'react';

interface IQuestionContainerProps {
    alternatives: Array<string>;
    title?: string;
    statement: string;
    imageSrc: string;
}

function QuestionContainer({ alternatives, title, statement, imageSrc }: IQuestionContainerProps): JSX.Element {
  const [estadoMudou, setEstadoMudou] = React.useState(false);

  React.useEffect(() => {
    // Define 'estadoMudou' como true se 'imageSrc' não estiver vazio
    setEstadoMudou(!!imageSrc);
  }, [imageSrc]); // Dependência de 'imageSrc'

  return (
    <>
      <section className="w-full overflow-hidden rounded-lg border border-border bg-modal-bg shadow-lg">
        <div className="flex h-20 w-full select-none items-center justify-between bg-modal-heading px-8">
          <p className="select-none text-2xl text-white">{title}</p>
        </div>

        <div className="w-full space-y-8 p-8">
          <p className="select-none text-white">
            {statement}
          </p>
        </div>

        {estadoMudou ? (
          <div className='flex w-full items-center justify-center'>
            <img src={imageSrc} alt="Uploaded" className="mb-6 max-h-[12rem] rounded" />
          </div>
        ) : (
          <>
          </>
        )}

        <div className='mb-8 flex w-full flex-col gap-4 px-8'>
          {alternatives.map((label, index) => (
            <>
              <div className='flex w-full cursor-pointer items-center gap-3 rounded-md border-2 border-transparent bg-modal-heading px-2 py-3 text-white transition ease-in-out'>
                <div className='flex h-8 w-8 select-none items-center justify-center rounded-full bg-white text-black'>
                  {String.fromCharCode(64 + (index + 1))}
                </div>
                <p key={index} >
                  {label}
                </p>
              </div>
            </>
          ))}
        </div>
      </section>
    </>
  );
}

export { QuestionContainer};
