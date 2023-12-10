import { Typography } from '@material-tailwind/react';
import { GripVertical } from 'lucide-react';
import React from 'react';
import { stringResizer } from '../utils';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface IExamQuestionLabel {
    id: string;
    index: string
    counter: number;
    question: string;
    difficulty: string;
    buttonPlacement: React.ReactNode
}

function ExamQuestionLabel({ id, index, question, buttonPlacement, counter, difficulty }: IExamQuestionLabel) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [difficultyColor, setDifficultyColor] = React.useState('');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const difficultyColorMap = {
    '1': 'border-l-green-400',
    '2': 'border-l-orange-400',
    '3': 'border-l-red-400',
  };

  React.useEffect(() => {
    setDifficultyColor(difficultyColorMap[difficulty] || 'default-color-class');
  }, [difficulty]);

  return (
    <li
      key={index}
      ref={setNodeRef} style={style} {...attributes}
      className={`-z-50 mb-2 flex animate-fade-in-down select-none items-center justify-between rounded-md border border-l-[0.8rem] bg-[#fafafa] ${difficultyColor} px-1 py-1 pr-2 transition-shadow active:shadow-xl`}
    >
      <div className='m-1 -ml-1 flex h-full cursor-grab items-center rounded-sm p-1 py-2 hover:bg-gray-200 active:cursor-grabbing active:bg-gray-300'
        {...listeners}
      >
        <GripVertical />
      </div>
      <p className='flex h-6 w-6 items-center justify-center rounded-full bg-black p-2 text-sm text-white'>{counter + 1}</p>

      <div className='mx-2 w-full'>
        <Typography variant='h6'>
          {stringResizer(question, 50)} ...
        </Typography>
      </div>

      {buttonPlacement}
    </li>
  );
}

export { ExamQuestionLabel };
