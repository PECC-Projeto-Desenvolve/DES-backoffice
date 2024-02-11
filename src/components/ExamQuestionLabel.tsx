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

/**
 * Renders a sortable label for an exam question within a list, including a drag handle, question summary,
 * and a custom button placement area. It uses the `useSortable` hook from `@dnd-kit/sortable` for drag-and-drop
 * functionality and dynamically assigns a border color based on the difficulty level of the question.
 *
 * @param {IExamQuestionLabel} props - The properties for the ExamQuestionLabel component.
 * @param {string} props.id - The unique identifier of the question, used for sorting.
 * @param {string} props.index - The index of the question in the list.
 * @param {number} props.counter - The display number of the question in the list.
 * @param {string} props.question - The text of the question, which will be resized and sanitized before display.
 * @param {string} props.difficulty - The difficulty level of the question, affecting the border color.
 * @param {React.ReactNode} props.buttonPlacement - A React node for placing custom buttons or icons alongside the question.
 * @returns {JSX.Element} A list item element that represents a question label with sortable functionality.
 */
function ExamQuestionLabel({ id, index, question, buttonPlacement, counter, difficulty }: IExamQuestionLabel) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [difficultyColor, setDifficultyColor] = React.useState<string>('');

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
        <div dangerouslySetInnerHTML={{ __html: stringResizer(question, 50) }}/>
      </div>

      {buttonPlacement}
    </li>
  );
}

export { ExamQuestionLabel };
