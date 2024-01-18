import { Typography } from '@material-tailwind/react';
import React from 'react';

interface IQuestionContainerProps {
    alternatives?: Array<string>;
    title?: string;
    statement: string;
    imageSrc?: string;
    alternativesWrapper?: React.ReactNode;
}

const addClassToStrong = (htmlString, className) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const processNode = (node) => {
    if (node.nodeType === 1) {
      // Se for um elemento
      if (node.tagName.toLowerCase() === 'strong') {
        node.classList.add(className);
      } else {
        // Recursivamente processa os filhos do elemento
        for (const child of node.childNodes) {
          processNode(child);
        }
      }
    }
  };

  // Processa o corpo do documento
  for (const child of doc.body.childNodes) {
    processNode(child);
  }

  return doc.body.innerHTML;
};

/**
 * Renders a container for displaying a question, its alternatives, and an optional image.
 *
 * @param {object} props - Component props.
 * @param {Array<string>} props.alternatives - List of alternative answers for the question.
 * @param {string} [props.title] - Optional title for the question.
 * @param {string} props.statement - The statement of the question.
 * @param {string} props.imageSrc - Source URL of the optional image associated with the question.
 * @param {React.ReactNode} props.alternativesWrapper - Custom alternatives
 * @returns {JSX.Element} A section containing the question title, statement, image (if present), and alternatives.
 */
function QuestionContainer({ alternatives, title, statement, imageSrc, alternativesWrapper }: IQuestionContainerProps): JSX.Element {
  const formattedStatement = addClassToStrong(statement, 'font-bold');

  return (
    <>
      <section className="w-full overflow-hidden rounded-lg border border-border bg-modal-bg shadow-lg">
        <div className="flex h-20 w-full select-none items-center justify-between bg-modal-heading px-8">
          <p className="select-none text-2xl text-white">{title}</p>
        </div>

        <div className="w-full space-y-8 p-8">
          <div className="select-none text-white" style={{ whiteSpace: 'pre-wrap', fontFamily: 'Poppins'}} dangerouslySetInnerHTML={{ __html: formattedStatement }} />
        </div>

        {imageSrc &&
        <div className='mb-6 flex w-full cursor-pointer flex-col items-center justify-center px-[20rem]'>
          <img src={imageSrc} alt="Uploaded" className="max-w-[28rem] rounded-lg" />
          <Typography color='white'>Clique na imagem para ampliar</Typography>
        </div>
        }

        <div className='mb-8 flex w-full flex-col gap-4 px-8'>
          {alternatives && alternatives.map((label, index) => (
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
          {alternativesWrapper}
        </div>
      </section>
    </>
  );
}

export { QuestionContainer};
