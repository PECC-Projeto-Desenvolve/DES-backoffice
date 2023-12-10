import React from 'react';
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from '@material-tailwind/react';
import { Edit, EyeIcon, MoreVertical, Trash } from 'lucide-react';
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
    updatedAt: string;
    difficulty: string | number;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
    handleOpenView: (question: any) => void;
    handleDeleteQuestion: (question: any) => void;
}

/**
 * Renders a draggable question card with details such as statement, right answer, and timestamps.
 * This component utilizes Material Tailwind components and custom utilities for styling and functionality.
 *
 * @component
 * @param {Object} props
 * @param {string|number} [props.id] - Unique identifier for the question.
 * @param {string} props.statement - The statement of the question.
 * @param {string} props.rightAnswer - Encrypted right answer for the question.
 * @param {string} props.createdAt - Timestamp of when the question was created.
 * @param {string} props.updatedAt - Timestamp of when the question was last updated.
 * @param {string|number} props.difficulty - Difficulty level of the question.
 * @param {Function} props.onDragStart - Function to handle the drag start event.
 * @param {Function} props.handleOpenView - Function to handle opening the question view.
 * @returns {JSX.Element} The QuestionCard component.
 */
function QuestionCard({createdAt, updatedAt, statement, rightAnswer, difficulty, onDragStart, handleOpenView, handleDeleteQuestion}: IQuestionCardProps): JSX.Element {

  const [color, setColor] = React.useState('');

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

  const hoverAnimation = 'shadow-xl shadow-transparent transition-all hover:-translate-y-1 hover:border-blue-gray-100 hover:shadow-blue-gray-900/5 hover:bg-[#fafafa]';

  const menuItems = [
    {
      label: 'Vizualizar',
      icon: <EyeIcon size={20}/>
    },
    {
      label: 'Editar',
      icon: <Edit size={20}/>
    },
  ];

  React.useEffect(() => {
    getDifficultyColor(difficulty);
  },);

  return (
    <>
      <div
        className={`z-50 flex h-fit w-full cursor-grab items-center justify-between rounded-md border bg-[#fff] active:cursor-grabbing ${hoverAnimation} animate-fade-in-down`}
        onDragStart={onDragStart}
        draggable
      >
        <div className={`flex h-full w-fit items-center justify-center rounded-l-md border-r-blue-gray-300 px-2 ${color}`}>
          <p className='flex h-5 w-5 items-center justify-center rounded-full border bg-white text-sm'>{decryptRightAnswer(rightAnswer)}</p>
        </div>

        <div className='w-full py-1 pl-4'>
          <Typography variant='small' className='-mb-1'>Enunciado:</Typography>
          <Typography variant='h6'>{statement.length > 49 ? (`${stringResizer(statement, 50)} ...`) : (statement)}</Typography>

          <div className='flex gap-2'>
            <Typography variant='paragraph'>criada em: <strong>{formatDate(createdAt)}</strong></Typography>
            {/* <Typography variant='paragraph'>atualizada em: <strong>{formatDate(updatedAt)}</strong></Typography> */}
          </div>
        </div>


        <div>
          <Menu>
            <MenuHandler>
              <IconButton variant="text">
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
