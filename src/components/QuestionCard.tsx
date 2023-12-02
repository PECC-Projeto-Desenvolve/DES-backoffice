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
import { stringResizer } from '../utils/StringResizer';
import { formatDate } from '../utils/DateFormater';
import { decryptRightAnswer } from '../utils/cryptoUtils';

interface IQuestionCardProps {
    id: string | number;
    statement: string;
    rightAnswer: string;
    createdAt: string;
    updatedAt: string;
    difficulty: string | number;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
}

function QuestionCard({createdAt, updatedAt, statement, rightAnswer, id, difficulty, onDragStart}: IQuestionCardProps): JSX.Element {

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
        className={`z-50 flex h-fit w-full cursor-grab items-center justify-between rounded-md border bg-[#fff] active:cursor-grabbing ${hoverAnimation}`}
        onDragStart={onDragStart}
        draggable
      >
        <div className={`flex h-full w-fit items-center justify-center rounded-l-md border-r-blue-gray-300 px-2 ${color}`}>
          <p className='flex h-5 w-5 items-center justify-center rounded-full border bg-white text-sm'>{decryptRightAnswer(rightAnswer)}</p>
        </div>

        <div className='w-full py-1 pl-4'>
          <Typography variant='small' className='-mb-1'>Enunciado:</Typography>
          <Typography variant='h6'>{stringResizer(statement, 50)}...</Typography>

          <div className='mt-2 flex gap-3'>
            <Typography variant='paragraph'>criada em: <strong>{formatDate(createdAt)}</strong></Typography>
            <Typography variant='paragraph'>atualizada em: <strong>{formatDate(updatedAt)}</strong></Typography>
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
                  disabled
                >
                  {item.icon}
                  {item.label}
                </MenuItem>

              )
              )}

              <hr className="my-3" />
              <MenuItem className='flex items-center justify-center gap-2 text-red-300' disabled>
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
