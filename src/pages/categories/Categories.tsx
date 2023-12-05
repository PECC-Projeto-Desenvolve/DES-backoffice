import { Button, Chip, Menu, IconButton, Input, MenuHandler, MenuItem, MenuList, Typography, CardFooter, Card, Dialog, CardBody } from '@material-tailwind/react';
import { Edit, MoreVertical, Trash } from 'lucide-react';
import { Alert } from '../../components';
import React from 'react';

const colors = [
  {name: 'Preto', hex:'#000000'},
  {name: 'Azul Royal', hex:'#4169E1'},
  {name: 'Vermelho Escarlate', hex:'#FF2400'},
  {name: 'Verde Floresta', hex:'#228B22'},
  {name: 'Amarelo Ouro', hex:'#FFD700'},
  {name: 'Roxo', hex:'#800080'},
  {name: 'Laranja', hex:'#FFA500'},
  {name: 'Rosa Choque', hex:'#FF69B4'},
  {name: 'Azul Turquesa', hex:'#30D5C8'},
  {name: 'Vinho', hex:'#722F37'},
  {name: 'Verde Limão', hex:'#32CD32'},
  {name: 'Magenta', hex:'#FF00FF'},
  {name: 'Ciano', hex:'#00FFFF'},
  {name: 'Marrom', hex:'#A52A2A'},
  {name: 'Azul Marinho', hex:'#000080'},
  {name: 'Coral', hex:'#FF7F50'},
  {name: 'Verde Oliva', hex:'#808000'},
  {name: 'Roxo Berinjela', hex:'#4B0082'},
  {name: 'Teal', hex:'#008080'},
  {name: 'Bordô', hex:'#800000'},

];


const menuItems = [
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



  const deleteCategory = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar a categoria');
      }

      if (response.ok) {
        setCustomSuccesMessage('Categoria deletada com sucesso!');
        setOpenAlert(true);
        setTimeout(() => {
          setOpenAlert(false);
        }, 3000);
      }

      fetchCategories();

      console.log('Categoria deletada com sucesso');
    } catch (error) {
      console.error('Erro ao deletar a categoria:', error);
    }
  };


  React.useEffect(() => {
    fetchCategories();
  }, []);

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

  const [customSuccesDeleteMessage, setCustomSuccesDeleteMessage] = React.useState('');

  const [customSuccesMessage, setCustomSuccesMessage] = React.useState('');

  const handleOpenNewCategoryName = () => {
    setOpenNewNameDialog(!openNewNameDialog);
  };

  const updateCategory = async (id: string, newName: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (response.ok) {
        setCustomSuccesMessage('Categoria atualizada com sucesso!');
        setOpenAlert(true);
        handleOpenNewCategoryName();
        fetchCategories();
        setTimeout(() => {
          setOpenAlert(false);
        }, 3000);
      }

      const data = await response.json();
      console.log('Category updated successfully:', data);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };


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
        setOpenErrorAlert(true);

        setTimeout(() => {
          setOpenErrorAlert(false);
        }, 3000);

        throw new Error(`Erro HTTP: ${response.status}`);
      }

      if (response.ok) {
        setCustomSuccesMessage('Categoria criada com sucesso!');
        setOpenAlert(true);
        setTitle('');
        setColor('');

        setTimeout(() => {
          setOpenAlert(false);
        }, 3000);
      }

      const responseData = await response.json();
      console.log('Resposta do servidor:', responseData);

      fetchCategories();

    } catch (error) {
      setOpenErrorAlert(true);
      setCustomAlertMessage('Atualize a página e tente novamente');
      setTimeout(() => {
        setOpenErrorAlert(false);
      }, 3000);
      console.error('Falha ao enviar os dados:', error);
    }
  };

  return (
    <>
      <Dialog
        size="xs"
        open={openNewNameDialog}
        handler={handleOpenNewCategoryName}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Novo nome para a categoria
            </Typography>

            <div className='w-full rounded-md border p-2'>

              <div className='w-full rounded-md p-2' style={{ backgroundColor: `${categoryColorToEdit}`}}>
                <Typography variant='h6' className='text-white'>{categoryNameToEdit.toUpperCase()}</Typography>
              </div>

              <Typography variant='small' className='mt-1'>id: <strong>{categoryIdToEdit}</strong></Typography>
            </div>


            <Input label="Nome da categoria" size="lg" onChange={(e) => setNewCategoryName(e.target.value)} value={newCategoryName}/>

          </CardBody>
          <CardFooter  className="flex gap-2 pt-0">
            <Button variant="outlined" onClick={handleOpenNewCategoryName} fullWidth>
                Cancelar
            </Button>

            <Button onClick={() => updateCategory(categoryIdToEdit, newCategoryName)} fullWidth color='green'>
                Confirmar
            </Button>

          </CardFooter>
        </Card>
      </Dialog>


      <div className='flex h-full w-full flex-col gap-4 overflow-hidden rounded bg-white px-4 py-6 transition-all'>
        <div className='grid h-full w-full grid-cols-2 gap-2 '>
          <div className='relative flex w-full flex-col gap-2 overflow-hidden rounded-md border p-4'>

            {categories.length > 0 ? (
              <>
                <span className='w-full'>
                  <Typography variant="h4" className='mb-2'>Categorias criadas</Typography>
                </span>

                <Input label='Buscar por categoria' size='lg' />
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
                              onClick={() => deleteCategory(category.id)}
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
              <div className=' flex w-full flex-wrap gap-2 rounded-md border p-5'>

                {colors.map((color, index) => (
                  <>
                    <div className='flex flex-grow' onClick={() => {
                      setColor(color.hex),
                      setColorName(color.name);
                    }} key={index}>
                      <Chip
                        value={color.name}
                        key={index}
                        className={'w-fit cursor-pointer border text-white shadow-xl shadow-transparent transition-all hover:-translate-y-1 hover:border-blue-gray-100 hover:shadow-blue-gray-900/5'}
                        style={{ backgroundColor: `${color.hex}`}}
                      />
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

      </div>
    </>
  );
}

export { Categories };
