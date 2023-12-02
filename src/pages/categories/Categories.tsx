import { Button, Chip, Menu, IconButton, Input, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react';
import { Edit, EyeIcon, MoreVertical, Trash } from 'lucide-react';
import React from 'react';

const colors = [
  {
    title: 'Rosa',
    color: 'bg-[#FFD1DC]',
    hex: 'FFD1DC'
  },
  {
    title: 'Verde',
    color: 'bg-[#77DD77]',
    hex: '77DD77'
  },
  {
    title: 'Azul',
    color: 'bg-[#AEC6CF]',
    hex: 'AEC6CF'
  },
  {
    title: 'Amarelo',
    color: 'bg-[#FDFD96]',
    hex: 'FDFD96'
  },
  {
    title: 'Laranja',
    color: 'bg-[#FFB347]',
    hex: 'FFB347'
  },
  {
    title: 'Lilás',
    color: 'bg-[#B39EB5]',
    hex: 'B39EB5'
  },
  {
    title: 'Turquesa',
    color: 'bg-[#A0D6B4]',
    hex: 'A0D6B4'
  },
  {
    title: 'Vermelho',
    color: 'bg-[#FF6961]',
    hex: 'FF6961'
  },
  {
    title: 'Violeta',
    color: 'bg-[#CB99C9]',
    hex: 'CB99C9'
  },
  {
    title: 'Pêssego',
    color: 'bg-[#FADADD]',
    hex: 'FADADD'
  },
  {
    title: 'Limão',
    color: 'bg-[#F0E5B5]',
    hex: 'F0E5B5'
  },
  {
    title: 'Aqua',
    color: 'bg-[#B5E7E0]',
    hex: 'B5E7E0'
  },
  {
    title: 'Lavanda',
    color: 'bg-[#C4A4E0]',
    hex: 'C4A4E0'
  },
  {
    title: 'Creme',
    color: 'bg-[#FFF6BD]',
    hex: 'FFF6BD'
  },
  {
    title: 'Menta',
    color: 'bg-[#B6E5BF]',
    hex: 'B6E5BF'
  },
];

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

function Categories() {
  const [categories, setCategories] = React.useState([]);

  const fetchCategories = () => {
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  };


  React.useEffect(() => {
    fetchCategories();
  }, []);

  const [title, setTitle] = React.useState('');
  const [color, setColor] = React.useState('');
  const [colorName, setColorName] = React.useState('Nenhum');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, color }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      if (response.ok) {
        setTitle('');
        setColor('');
      }

      const responseData = await response.json();
      console.log('Resposta do servidor:', responseData);

      fetchCategories();

    } catch (error) {
      console.error('Falha ao enviar os dados:', error);
    }
  };

  return (
    <>
      <div className='flex h-full w-full flex-col gap-4 overflow-hidden rounded bg-white px-4 py-6 transition-all'>
        <div className='grid h-full w-full grid-cols-2 gap-2 '>
          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border p-4'>

            <span className='w-full'>
              <Typography variant="h4" className='mb-2'>Categorias criadas</Typography>
            </span>
            <div className='flex flex-col gap-2 overflow-y-scroll'>
              {categories.map((category, index) => {
                const bgColor = `bg-[#${category.color}]`;
                return (
                  <>
                    <div className={`w-full ${bgColor} flex animate-fade-in-down items-center justify-between rounded-md border p-2`} >
                      <Typography variant='h6' key={index} className='text-white'>{category.title}</Typography>

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
              })}
            </div>
          </div>

          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border p-4'>
            <span className='w-full'>
              <Typography variant="h4">Nova categoria</Typography>
            </span>

            <Input
              size='lg'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label='Título da categoria'
            />
            <div className='mt-5 flex flex-col gap-2'>

              <Typography variant="h5">Escolha uma cor</Typography>
              <div className='grid w-full grid-cols-5 gap-3 rounded-md border p-5'>

                {colors.map((color, index) => (
                  <>
                    <div className='flex w-full items-center justify-center' onClick={() => {
                      setColor(color.hex),
                      setColorName(color.title);
                    }}>
                      <Chip
                        value={color.title}
                        key={index}
                        className={`w-fit ${color.color} cursor-pointer border text-gray-900 shadow-xl shadow-transparent transition-all hover:-translate-y-1 hover:border-blue-gray-100 hover:shadow-blue-gray-900/5`} />
                    </div>
                  </>
                ))}

              </div>
              <Typography variant='paragraph' className='flex'>Selecionado: <strong className='ml-2'>{colorName}</strong> </Typography>
            </div>

            <Button
              disabled={ title == '' || color == '' ? true : false}
              size='lg'
              className='mt-10'
              onClick={handleSubmit}
            >
                Salvar categoria
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export { Categories };
