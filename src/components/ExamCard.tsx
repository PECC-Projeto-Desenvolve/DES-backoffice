import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton
} from '@material-tailwind/react';
import { Copy, Edit, MoreVertical, Trash } from 'lucide-react';
import { formatDate } from '../utils/DateFormater';

interface IExamCardProps {
    title: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Renders an exam card component with title, creation, and update dates, and a menu for actions.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the exam.
 * @param {string} props.createdAt - The creation date of the exam.
 * @param {string} props.updatedAt - The last update date of the exam.
 * @returns {JSX.Element} A list item representing an exam card with interactive elements.
 */
function ExamCard({ title, createdAt, updatedAt }: IExamCardProps): JSX.Element {
  const hoverAnimation = 'shadow-xl shadow-transparent transition-all hover:-translate-y-2 hover:border-blue-gray-100 hover:shadow-blue-gray-900/5 hover:bg-[#eee]';

  const menuItems = [
    {
      label: 'Editar',
      icon: <Edit size={20}/>
    },
    {
      label: 'Duplicar',
      icon: <Copy size={20}/>
    },
  ];

  return (
    <>
      <li className={`flex h-fit w-full cursor-pointer items-center justify-between rounded-sm border bg-[#fafafa] p-2 ${hoverAnimation}`}>
        <div>
          <Typography variant='lead'>{title}</Typography>
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
      </li>
    </>
  );
}

export { ExamCard };
