import React from 'react';
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from '@material-tailwind/react';
import { EyeIcon, MoreVertical, Trash } from 'lucide-react';
import {
  stringResizer,
  formatDate,
  decryptRightAnswer,
} from '../utils';

interface IQuestionCardProps {
    id?: string | number;
    statement: string;
    rightAnswer: string;
    createdAt: string;
    updatedAt?: string;
    difficulty: string | number;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
    handleOpenView: (question: any) => void;
    handleDeleteQuestion: (question: any) => void;
}

/**
 * Renders a `QuestionCard` component displaying a question's statement, difficulty level, and creation date.
 * It includes an interactive menu for viewing or deleting the question. The component is draggable for reordering.
 *
 * @param {IQuestionCardProps} props - Properties passed to the component.
 * @param {string|number} [props.id] - The unique identifier for the question. Optional.
 * @param {string} props.statement - The statement of the question.
 * @param {string} props.rightAnswer - The encrypted answer to the question.
 * @param {string} props.createdAt - The date the question was created.
 * @param {string} [props.updatedAt] - The date the question was last updated. Optional.
 * @param {string|number} props.difficulty - The difficulty level of the question.
 * @param {Function} props.onDragStart - Function to handle drag start events.
 * @param {Function} props.handleOpenView - Function to handle the action of viewing the question details.
 * @param {Function} props.handleDeleteQuestion - Function to handle the action of deleting the question.
 * @returns {JSX.Element} A draggable and interactive card representing a question.
 */
function QuestionCard({createdAt, statement, rightAnswer, difficulty, onDragStart, handleOpenView, handleDeleteQuestion}: IQuestionCardProps): JSX.Element {

  const [color, setColor] = React.useState<string>('');

  const getDifficultyColor = (difficulty) => {
    let selectedColor;

    switch(difficulty) {
    case 1:
      selectedColor = 'bg-green-500';
      break;
    case 2:
      selectedColor = 'bg-orange-500';
      break;
    case 3:
      selectedColor = 'bg-red-500';
      break;
    default:
      selectedColor = 'bg-gray-600';
    }

    setColor(selectedColor);
  };

  const hoverAnimation = 'shadow-xl shadow-transparent transition-all hover:-translate-y-1 hover:border-blue-gray-100 dark:hover:border-white hover:shadow-blue-gray-900/5 hover:bg-[#fafafa]';

  const menuItems = [
    {
      label: 'Vizualizar',
      icon: <EyeIcon size={20}/>
    },
  ];

  React.useEffect(() => {
    getDifficultyColor(difficulty);
  },);

  return (
    <>
      <div
        className={`z-50 flex h-fit w-full cursor-grab items-center justify-between rounded-md border bg-white active:cursor-grabbing dark:border-blue-gray-400 dark:bg-blue-gray-200/30 ${hoverAnimation} animate-fade-in-down`}
        onDragStart={onDragStart}
        draggable
      >
        <div className={`flex h-full w-fit items-center justify-center rounded-l-md border-r-blue-gray-300 px-2 ${color}`}>
          <p className='flex h-5 w-5 items-center justify-center rounded-full border bg-white text-sm ' >{decryptRightAnswer(rightAnswer)}</p>
        </div>

        <div className='w-full py-1 pl-4'>
          <Typography variant='small' className='-mb-1 text-black dark:text-white'>Enunciado:</Typography>
          {/* <Typography variant='h6' className='text-black dark:text-white'>{statement.length > 49 ? (`${stringResizer(statement, 50)} ...`) : (statement)}</Typography> */}
          <div dangerouslySetInnerHTML={{ __html: stringResizer(statement, 50) }}/>
          <div className='flex gap-2'>
            <Typography variant='paragraph' className='text-black dark:text-white'>criada em: <strong>{formatDate(createdAt)}</strong></Typography>
            {/* <Typography variant='paragraph'>atualizada em: <strong>{formatDate(updatedAt)}</strong></Typography> */}
          </div>
        </div>


        <div>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" className='text-black dark:text-white'>
                <MoreVertical />
              </IconButton>
            </MenuHandler>
            <MenuList>

              {menuItems.map((item, index) => (
                <MenuItem
                  className='flex items-center gap-4'
                  key={index}
                  onClick={item.label == 'Vizualizar' && handleOpenView}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              )
              )}

              <hr className="my-3" />
              <MenuItem className='flex items-center justify-center gap-2 text-red-300' onClick={handleDeleteQuestion}>
                <Trash size={20}/>
                    Excluir
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </>
  );
}

export { QuestionCard };
