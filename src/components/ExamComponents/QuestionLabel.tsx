import { ButtonGroup, IconButton, Typography } from '@material-tailwind/react';
import { Eye, GripVertical, MinusCircle } from 'lucide-react';
import { stringResizer } from '../../utils';

interface IQuestionLabel {
    question: string;
    handlePreview?: () => void;
    handleRemove:() => void;
    index: number;
}

/**
 * Renders a label for a question with action buttons for preview and removal.
 *
 * @param {object} props - Component props.
 * @param {string} props.question - The question text.
 * @param {() => void} [props.handlePreview] - Optional handler function for previewing the question.
 * @param {() => void} props.handleRemove - Handler function for removing the question.
 * @param {number} props.index - Index of the question in a list.
 * @returns {JSX.Element} A list item representing a question with buttons for preview and removal.
 */
function QuestionLabel({ question, handleRemove, index }: IQuestionLabel) {
  return (
    <>
      <li
        className='flex animate-fade-in-down cursor-grab select-none items-center justify-between rounded-md border bg-[#fafafa] px-1 py-2 active:cursor-grabbing'
      >
        <div className='flex items-center gap-1'>
          <GripVertical />
          <p className='flex h-7 w-7 items-center justify-center rounded-full bg-black p-2 text-white'>{index + 1}</p>
        </div>

        <div className='mx-2 w-full'>
          <Typography variant='h6'>
            {stringResizer(question, 50)} ...
          </Typography>
        </div>

        <ButtonGroup>
          <IconButton onClick={() => console.log('preview')} disabled>
            <Eye size={20}/>
          </IconButton>
          <IconButton onClick={handleRemove}>
            <MinusCircle size={20}/>
          </IconButton>
        </ButtonGroup>
      </li>
    </>
  );
}

export { QuestionLabel };
