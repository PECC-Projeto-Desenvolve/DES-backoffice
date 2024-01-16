import React from 'react';
import '../../../components/init';
import {
  Input,
  Textarea,
  Select,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  Option,
  Chip,
  Switch,
} from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  EyeIcon,
  Trash2,
  UploadCloud
} from 'lucide-react';

import { QuestionContainer, Alert, AlternativeInput } from '../../../components';
import { BackButton } from '../../../components/BackButton';

const apiUrl = import.meta.env.VITE_API_URL;

function QuestionForm() {
  const [alternatives, setAlternatives] = React.useState(Array(5).fill(''));
  const [categories, setCategories] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [statement, setStatement] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');

  const [imageSrc, setImageSrc] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState<boolean>(false);
  const [customAlertMessage, setCustomAlertMessage] = React.useState<string>('');
  const [selectedCheckbox, setSelectedCheckbox] = React.useState(null);

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const [key, setKey] = React.useState(0);

  const [isSwitchActive, setIsSwitchActive] = React.useState(false);


  React.useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkTheme(darkMode);
  }, []);

  const fetchCategories = () => {
    fetch(`${apiUrl}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  };

  const [open, setOpen] = React.useState(false);

  const handleCheckboxChange = (index) => {
    if (selectedCheckbox === index) {
      setSelectedCheckbox(null);
    } else {
      setSelectedCheckbox(index);
    }
  };

  const handleOpen = () => setOpen(!open);

  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = value;
    setAlternatives(newAlternatives);
  };


  const handleBack = () => {
    navigate(-1);
  };

  const remountComponent = () => {
    setKey(prevKey => prevKey + 1);
  };


  const onDrop = React.useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onAreaClick = () => {
    fileInputRef.current.click();
  };

  const onDeleteImgSrc = () => {
    setImageSrc(null);
  };

  const handleTitleChange = (event) => {
    setTitle(event);
  };

  const handleStatementChange = (event) => {
    setStatement(event);
  };

  const handleSubmit = async () => {
    if (!title.trim() || alternatives.some(alt => !alt.trim())) {
      setOpenErrorAlert(true);
      setCustomAlertMessage('Os campos devem ser preenchidos!');
      setTimeout(() => {
        setOpenErrorAlert(false);
      }, 3000);
      return;
    }

    const questionData = {
      title,
      statement,
      alternatives,
      rightAnswer: selectedCheckbox.toString(),
      difficulty: Number(difficulty),
      image: imageSrc,
    };

    try {
      const response = await fetch(`${apiUrl}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        setOpenErrorAlert(true);

        setTimeout(() => {
          setOpenErrorAlert(false);
        }, 3000);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      if (response.ok) {
        setOpenAlert(true);
        setTimeout(() => {
          setOpenAlert(false);
          setAlternatives(Array(5).fill(''));
          remountComponent();
          setTitle('');
          setImageSrc('');
          setStatement('');
          setDifficulty('');
          setSelectedCheckbox(null);
        }, 1000);
      }

    } catch (error) {
      setOpenErrorAlert(true);
      setCustomAlertMessage('Atualize a página e tente novamente');
      setTimeout(() => {
        setOpenErrorAlert(false);
      }, 3000);
      console.error('Falha ao salvar a questão:', error);
    }
  };

  const handleSwitchChange = (event) => {
    setIsSwitchActive(event.target.checked);
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen} size='xl'>
        <div className='w-full'>
          <QuestionContainer
            alternatives={alternatives}
            statement={statement}
            title={title}
            imageSrc={imageSrc}
          />
        </div>
      </Dialog>

      <BackButton />

      <div className=' relative grid h-[80vh] w-full gap-6 px-2 pb-8 xl:grid-cols-2'>
        <div className='flex w-full flex-col gap-4'>
          <Typography variant='h4' className='text-black dark:text-white'>Corpo da questão</Typography>

          <Input
            crossOrigin={''}
            label="Título"
            size='lg'
            onChange={event => handleTitleChange(event.target.value)}
            value={title}
            labelProps={{ className: 'dark:text-white text-black' }}
            color={`${isDarkTheme ? 'white' : 'black'}`}
            className='bg-white/80 text-black dark:bg-blue-gray-200/20 dark:text-white'
          />

          <span>
            <Select
              disabled
              label="Categoria"
              onFocus={() => fetchCategories()}
              labelProps={{ className: 'dark:text-white text-black' }}
              size='lg'
              className='bg-white/80 dark:bg-blue-gray-200/20'
            >
              {categories.map((category, index) => (
                <Option key={index} value={category.title}>
                  <Chip value={category.title} style={{ backgroundColor: `${category.color}`}} className='w-fit text-white'/>
                </Option>
              ))}
            </Select>
            <Typography variant='small' className='mt-2 flex items-center gap-2 text-blue-gray-800 dark:text-blue-gray-200'>
              <AlertCircle size={14}/>
                Funcionalidade em desenvolvimento
            </Typography>
          </span>


          <Select
            label="Dificuldade"
            size='lg'
            value={difficulty}
            onChange={(value) => setDifficulty(value)}
            labelProps={{ className: 'dark:text-white text-black' }}
            className='bg-white/80 dark:bg-blue-gray-200/20'
          >
            <Option value="1" index={1}>
              <Chip value="Fácil" className='w-fit' color='green'/>
            </Option>
            <Option value="2" index={2}>
              <Chip value="Médio" className='w-fit' color='orange'/>
            </Option>
            <Option value="3" index={3}>
              <Chip value="Difícil" className='w-fit' color='red'/>
            </Option>
          </Select>

          <span className='mb-4'>
            <Textarea
              label='Enunciado'
              size='lg'
              resize={true}
              onChange={event => handleStatementChange(event.target.value)}
              value={statement}
              labelProps={{ className: 'text-white' }}
              color='blue-gray'
              onFocus={() => setIsFocused(true)}
              rows={4}
              disabled={isSwitchActive}
              className={` ${isFocused ? 'border-blue-900 ' : 'border-gray-300'} bg-white text-blue-gray-200 dark:bg-blue-gray-200/20 dark:text-white`}
            />

            <Switch
              crossOrigin={''}
              color="blue"
              label={
                <div>
                  <Typography color="blue-gray" className="font-medium">
            Desabilitar Enunciado
                  </Typography>
                  <Typography variant="small" color="gray" className="font-normal">
            Caso você esteja usando uma imagem para representar o enunciado, marque esta opção
                  </Typography>
                </div>
              }
              containerProps={{
                className: '-mt-5',
              }}
              checked={isSwitchActive}
              onChange={handleSwitchChange}
            />

          </span>
          <>
            {imageSrc ? (
              <>
                <div className='flex items-center justify-between rounded border border-gray-500/50 px-6 py-2'>
                  <img src={imageSrc} alt="Uploaded" className="max-h-[8rem] rounded" />

                  <Tooltip content="Excluir imagem">
                    <IconButton color="red" onClick={onDeleteImgSrc}>
                      <Trash2 />
                    </IconButton>
                  </Tooltip>
                </div>
              </>
            ) : (
              <>
                <div
                  className="cursor-pointer rounded border-2 border-dashed border-black p-4 text-center transition-all dark:border-white"
                  onClick={onAreaClick}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onDrop}>
                  <div className='flex items-center justify-center gap-3'>
                    <UploadCloud className='text-black dark:text-white'/>
                    <Typography className='text-black dark:text-white' variant='paragraph'> Arraste e solte a imagem aqui ou clique para selecionar </Typography>
                  </div>
                  <input
                    type="file"
                    onChange={onFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              </>
            )}
          </>
        </div>
        <div className='flex w-full flex-col'>
          <Typography variant='h4' className='mb-4 text-black dark:text-white'>Alternativas</Typography>

          <div className='flex flex-col gap-4' key={key}>
            {alternatives.map((alternative, index) => (
              <AlternativeInput
                isDarkTheme={isDarkTheme}
                key={`alternative-${index}`}
                label={index}
                value={alternative.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                checkboxProps={{
                  checked: selectedCheckbox === index,
                  onChange: () => handleCheckboxChange(index),
                  disabled: selectedCheckbox !== null && selectedCheckbox !== index
                }}
              />
            ))}

          </div>
          <div>
          </div>

        </div>

        <div className='absolute bottom-0 col-span-2 flex h-fit w-full flex-col gap-4 p-4'>
          <Alert
            open={openAlert || openErrorAlert}
            success={openAlert}
            onClose={() => {
              setOpenAlert(false);
              setOpenErrorAlert(false);
            }}
            customMessage={customAlertMessage}
            successMessage='Questão criada com sucesso!'
            errorMessage='Erro ao criar questão'
          />
          <hr className='w-full border border-[#c4c4c4]/50'/>
          <div className='flex h-fit w-full justify-between gap-4'>
            <Button className='flex items-center gap-4' onClick={handleOpen} color='blue'>
              <EyeIcon size={20} /> Pré vizualizar
            </Button>
            <div className='flex h-full gap-4'>
              <Button variant='outlined' onClick={handleBack} className='' color='red'>Cancelar</Button>
              <Button onClick={handleSubmit} className='' color='green'>Salvar</Button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export { QuestionForm };
