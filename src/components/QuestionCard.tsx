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

interface IQuestionCardProps {
    statement: string;
    createdAt: string;
    updatedAt: string;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
}

function QuestionCard({createdAt, updatedAt, statement, onDragStart}: IQuestionCardProps): JSX.Element {
  const hoverAnimation = 'shadow-xl shadow-transparent transition-all hover:-translate-y-2 hover:border-blue-gray-100 hover:shadow-blue-gray-900/5 hover:bg-[#eee] ';

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

  return (
    <>
      <div
        className={`flex h-fit w-full cursor-grab items-center justify-between rounded-md border bg-[#fafafa] p-2 active:cursor-grabbing ${hoverAnimation} `}
        onDragStart={onDragStart}
        draggable
      >
        <div className='w-full'>
          <Typography variant='small'>Enunciado:</Typography>
          <div className='h-5 w-full max-w-xl overflow-hidden overflow-ellipsis whitespace-nowrap'>
            <Typography variant='h6'>{stringResizer(statement, 50)}...</Typography>
          </div>
          <Typography variant='paragraph'>criada em: <strong>{formatDate(createdAt)}</strong></Typography>
          <Typography variant='paragraph'>atualizada em: <strong>{formatDate(updatedAt)}</strong></Typography>
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
