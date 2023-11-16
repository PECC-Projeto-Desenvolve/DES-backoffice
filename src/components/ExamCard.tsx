import React from 'react';
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton
} from '@material-tailwind/react';
import { MoreVertical, Trash } from 'lucide-react';

function ExamCard(): JSX.Element {
  const hoverAnimation = 'shadow-xl shadow-transparent transition-all hover:-translate-y-2 hover:border-blue-gray-100 hover:shadow-blue-gray-900/5 hover:bg-[#eee]';

  return (
    <>
      <div className={`flex h-fit w-full cursor-pointer items-center justify-between rounded-sm border bg-[#fafafa] p-2 ${hoverAnimation}`}>
        <div>
          <Typography variant='lead'>Prova tal</Typography>
          <Typography variant='paragraph'>criada em: <strong>12/09/2023</strong></Typography>
          <Typography variant='paragraph'>atualizada em: <strong>16/09/2023</strong></Typography>
        </div>

        <div>

          <Menu>
            <MenuHandler>
              <IconButton variant="text">
                <MoreVertical />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem>Menu Item 1</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
              <MenuItem>Menu Item 3</MenuItem>
              <hr className="my-3" />
              <MenuItem className='flex items-center justify-center gap-2 text-red-300'>
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

export { ExamCard };
