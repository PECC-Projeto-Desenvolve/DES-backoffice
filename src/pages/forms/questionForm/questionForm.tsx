import React from 'react';
import {
  Input,
  Textarea,
  Select,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Alert
} from '@material-tailwind/react';
import { AlternativeInput } from '../../../components/AlternativeInput';
import { useNavigate } from 'react-router-dom';
import { Check, Trash2, UploadCloud } from 'lucide-react';

function QuestionForm() {
  const [alternatives, setAlternatives] = React.useState(Array(5).fill(''));
  const [title, setTitle] = React.useState('');
  const [statement, setStatement] = React.useState('');

  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = value;
    setAlternatives(newAlternatives);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const [imageSrc, setImageSrc] = React.useState(null);
  const fileInputRef = React.useRef(null);

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
    const questionData = {
      title,
      statement,
      alternatives,
      rightAnswer: '',
    };

    try {
      const response = await fetch('http://localhost:3000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      if (response.ok) {
        //   handleBack;
        setOpenAlert(true);
      }

    } catch (error) {
      console.error('Falha ao salvar a questão:', error);
    }

  };

  React.useEffect(() => {
    if (setOpenAlert) {
      setTimeout(() => {
        setOpenAlert(false);
        setAlternatives(Array(5).fill(''));
        setTitle('');
        setStatement('');
      }, 3000);
    }
  }, [openAlert]);

  return (
    <>
      <div className='flex h-full w-full flex-col items-center justify-center rounded bg-white'>

        <div className='-mt-2 grid h-full w-full gap-6 px-6 pt-10 xl:grid-cols-2'>
          <div className='flex  w-full flex-col gap-4'>

            <Typography variant='h4'>Corpo da questão</Typography>

            <Input label="Título" size='lg' onChange={event => handleTitleChange(event.target.value)} value={title}/>


            <Select label="Área de conhecimendo" size='lg' disabled>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </Select>

            <Textarea label='Enunciado' size='lg' onChange={event => handleStatementChange(event.target.value)} value={statement}/>

            <>
              {imageSrc ? (
                <>
                  <div className='flex items-center justify-between rounded border border-gray-500/50 px-6 py-2'>
                    <img src={imageSrc} alt="Uploaded" className="max-h-[10rem] rounded" />

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
                    className="cursor-pointer rounded border-2 border-dashed border-gray-300 p-4 text-center transition-all hover:border-gray-500"
                    onClick={onAreaClick}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={onDrop}>
                    <div className='flex items-center justify-center gap-3'>
                      <UploadCloud />
                      <Typography variant='paragraph'> Arraste e solte a imagem aqui ou clique para selecionar </Typography>
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
            <Typography variant='h4' className='mb-4'>Alternativas</Typography>


            <div className=' flex flex-col gap-2'>
              {['A', 'B', 'C', 'D', 'E'].map((label, index) => (
                <>
                  <AlternativeInput
                    key={label}
                    label={label}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                </>
              ))}
              {alternatives}
            </div>

            <div>
            </div>

          </div>
        </div>
        <div className='flex h-fit w-full flex-col gap-4 p-4 '>
          <>
            <Alert
              open={openAlert}
              color="green"
              className='shadow-2xl'
              icon={<Check />}
              animate={{
                mount: { y: 0 },
                unmount: { y: 100 },
              }}
              action={
                <Button
                  variant="text"
                  color="white"
                  size="sm"
                  className="!absolute right-3 top-3"
                  onClick={() => setOpenAlert(false)}
                >
            Close
                </Button>
              }
            >
       Questão salva com sucesso!
            </Alert>
          </>
          <hr className='w-full border-gray-300'/>
          <div className='flex h-fit w-full justify-end gap-4'>
            <Button variant='outlined' onClick={handleBack}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export { QuestionForm };
