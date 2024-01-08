import { Button, Chip, Menu, IconButton, Input, MenuHandler, MenuItem, MenuList, Typography, Card } from '@material-tailwind/react';
import { Edit, MoreVertical, Trash } from 'lucide-react';
import { Alert, CategoryDialog } from '../../components';
import React from 'react';
import {
  deleteCategory,
  updateCategory,
  submitCategory,
} from '../../api/category/_index';

import { colors } from '../../data/categoryColors';
import { BackButton } from '../../components/BackButton';

const apiUrl = import.meta.env.VITE_API_URL;

const menuItems = [
  {
    label: 'Editar',
    icon: <Edit size={20}/>
  },
];

function Categories() {
  const [categories, setCategories] = React.useState([]);

  const [title, setTitle] = React.useState('');
  const [color, setColor] = React.useState('');
  const [colorName, setColorName] = React.useState('Nenhum');

  const [openNewNameDialog, setOpenNewNameDialog] = React.useState(false);

  const [categoryIdToEdit, setCategoryIdToEdit] = React.useState('');
  const [categoryNameToEdit, setCategoryNameToEdit] = React.useState('');
  const [categoryColorToEdit, setCategoryColorToEdit] = React.useState('');

  const [newCategoryName, setNewCategoryName] = React.useState('');

  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState<boolean>(false);
  const [customAlertMessage, setCustomAlertMessage] = React.useState<string>('');

  const [customSuccesMessage, setCustomSuccesMessage] = React.useState('');

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  React.useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkTheme(darkMode);
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${apiUrl}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  };

  const handleOpenNewCategoryName = () => {
    setOpenNewNameDialog(!openNewNameDialog);
  };

  const handleDeleteCompleted = () => {
    setCustomSuccesMessage('Categoria deletada com sucesso!');
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);

    fetchCategories();
  };

  const handleUpdateCompleted = () => {
    setCustomSuccesMessage('Categoria atualizada com sucesso!');
    setOpenAlert(true);
    handleOpenNewCategoryName();
    fetchCategories();
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  const handleSubmitNotCompleted = () => {
    setOpenErrorAlert(true);

    setTimeout(() => {
      setOpenErrorAlert(false);
    }, 3000);
  };

  const handleSubmitCompleted = () => {
    setCustomSuccesMessage('Categoria criada com sucesso!');
    setOpenAlert(true);
    setTitle('');
    setColor('');
    fetchCategories();
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  const handleSubmitError = () => {
    setOpenErrorAlert(true);
    setCustomAlertMessage('Atualize a página e tente novamente');
    setTimeout(() => {
      setOpenErrorAlert(false);
    }, 3000);
  };

  return (
    <>
      <CategoryDialog
        open={openNewNameDialog}
        handleOpen={handleOpenNewCategoryName}
        color={categoryColorToEdit}
        categoryName={categoryNameToEdit}
        categoryId={categoryIdToEdit}
        onChange={(e) => setNewCategoryName(e.target.value)}
        value={newCategoryName}
        onConfirm={() =>
          updateCategory({
            id: categoryIdToEdit,
            newName: newCategoryName,
            responseCompleted: handleUpdateCompleted,
          })
        }
      />



      <BackButton />

      <Card className='rounded-md border border-orange-900/80 bg-orange-700/60 p-2'>
        <Typography className='font-bold text-white '>Não é possível no momento atribuir categoria nas questões</Typography>
      </Card>

      <div className='grid h-full w-full grid-cols-2 gap-4 '>
        <div className='relative flex w-full flex-col gap-2 overflow-hidden'>

          {categories.length > 0 ? (
            <>
              <span className='w-full'>
                <Typography variant="h4" className='mb-2 text-black dark:text-white'>Categorias criadas</Typography>
              </span>

              <Input
                crossOrigin={''}
                label='Buscar por categoria'
                size='lg'
                labelProps={{ className: 'dark:text-white text-black' }}
                color={`${isDarkTheme ? 'white' : 'black'}`}
                className='bg-white/80 text-black dark:bg-blue-gray-200/20 dark:text-white'
              />
            </>
          ): (
            <>
              <span className='w-full'>
                <Typography variant="h4" className='mb-2'>Nenhuma categoria criada</Typography>
                <Typography variant="paragraph" className='mb-2'>Use o painel ao lado para criar suas categorias</Typography>
              </span>
            </>
          )}

          <div className='flex flex-col gap-2 overflow-y-scroll'>
            {categories.map((category, index) => {
              return (
                <>
                  <div
                    className={'flex w-full animate-fade-in-down items-center justify-between rounded-md border px-4 py-1'} style={{ backgroundColor: `${category.color}`}}>
                    <Typography variant='paragraph' key={index} className='font-bold uppercase text-white'>{category.title}</Typography>
                    <div>
                      <Menu>
                        <MenuHandler>
                          <IconButton variant="text">
                            <MoreVertical color='white' size={20}/>
                          </IconButton>
                        </MenuHandler>
                        <MenuList>

                          {menuItems.map((item, index) => (

                            <MenuItem
                              className='flex items-center gap-4'
                              key={index}
                              onClick={() => {
                                setCategoryIdToEdit(category.id);
                                setCategoryNameToEdit(category.title);
                                setCategoryColorToEdit(category.color);
                                handleOpenNewCategoryName();
                              }}
                            >
                              {item.icon}
                              {item.label}
                            </MenuItem>

                          )
                          )}

                          <hr className="my-3" />
                          <MenuItem
                            className='flex items-center justify-center gap-2 text-red-300'
                            onClick={() => deleteCategory({ id: category.id, responseCompleted: handleDeleteCompleted })}
                          >
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

        <div className='relative flex w-full flex-col gap-2 overflow-hidden'>
          <span className='w-full'>
            <Typography variant="h4" className='text-black dark:text-white'>Nova categoria</Typography>
          </span>

          <Input
            crossOrigin={''}
            size='lg'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label='Título da categoria'
            labelProps={{ className: 'dark:text-white text-black' }}
            color={`${isDarkTheme ? 'white' : 'black'}`}
            className='bg-white/80 text-black dark:bg-blue-gray-200/20 dark:text-white'
          />
          <div className='mt-5 flex flex-col gap-2'>

            <Typography variant="h5" className='text-black dark:text-white'>Escolha uma cor</Typography>
            <div className=' flex w-full flex-wrap gap-2 rounded-md border bg-white p-5 dark:border-blue-gray-200 dark:bg-blue-gray-200/40'>
              {colors.map((color, index) => (
                <>
                  <div className='flex flex-grow' onClick={() => {
                    setColor(color.hex),
                    setColorName(color.name);
                  }} key={index}>
                    <Chip
                      value={color.name}
                      key={index}
                      className={'w-fit cursor-pointer border text-white shadow-xl shadow-transparent transition-all hover:-translate-y-1 hover:border-blue-gray-100 hover:shadow-blue-gray-900/5 dark:border-blue-gray-200 dark:hover:border-blue-gray-200'}
                      style={{ backgroundColor: `${color.hex}`}}
                    />
                  </div>
                </>
              ))}

            </div>
            <Typography variant='paragraph' className='flex text-black dark:text-white'>Selecionado: <strong className='ml-2'>{colorName}</strong> </Typography>
          </div>

          <Button
            disabled={ title == '' || color == '' ? true : false}
            size='lg'
            className='mt-10'
            onClick={() => submitCategory({
              title: title,
              color: color,
              responseCompleted: handleSubmitCompleted,
              responseNotCompleted: handleSubmitNotCompleted,
              responseError: handleSubmitError
            })}
            color="green"
          >
                Salvar categoria
          </Button>
        </div>
      </div>

      <Alert
        open={openAlert || openErrorAlert}
        success={openAlert}
        onClose={() => {
          setOpenAlert(false);
          setOpenErrorAlert(false);
        }}
        customMessage={customAlertMessage}
        successMessage={customSuccesMessage}
        errorMessage='Erro ao criar categoria'
      />


    </>
  );
}

export { Categories };
