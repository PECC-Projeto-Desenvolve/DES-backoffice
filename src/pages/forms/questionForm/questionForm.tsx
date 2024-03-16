import React from 'react';
import '../../../components/init';
import { Input, Select, Typography, Button, IconButton, Tooltip, Dialog, Option, Chip, Switch, DialogBody, DialogFooter } from '@material-tailwind/react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, EyeIcon, Trash2, UploadCloud, Loader } from 'lucide-react';

import { QuestionContainer, Alert, AlternativeInput } from '../../../components';
import { BackButton } from '../../../components/BackButton';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import storage from '../../../../firebaseConfig';

/**
 * Component for creating and managing a form to create or edit a question.
 * @returns {JSX.Element} The QuestionForm component.
 */
function QuestionForm() {
  const [alternatives, setAlternatives] = React.useState(Array(5).fill(''));
  const [categories, setCategories] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState<string>('');
  const [statement, setStatement] = React.useState<string>('');
  const [difficulty, setDifficulty] = React.useState<string>('');
  const [imageSrc, setImageSrc] = React.useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = React.useState(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fileInputRef = React.useRef(null);

  const [newStatement, setNewStatement] = React.useState<string>('');

  const [open, setOpen] = React.useState<boolean>(false);
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [openErrorAlert, setOpenErrorAlert] = React.useState<boolean>(false);

  const [customAlertMessage, setCustomAlertMessage] = React.useState<string>('');

  const [isDarkTheme, setIsDarkTheme] = React.useState<boolean>(false);

  const [key, setKey] = React.useState<number>(0);

  const [isSwitchActive, setIsSwitchActive] = React.useState<boolean>(false);
  const [isStatementActive, setIsStatementActive] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [ false] }],
      ['bold', 'italic'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic',
    'list', 'bullet',
  ];

  /**
 * Updates the state with the new statement text from the rich text editor.
 *
 * @param {string} value - The updated statement text.
 */
  const handleTextChange = (value: string) => {
    setStatement(value);
  };

  /**
 * Updates the state with the new statement text from the expanded window rich text editor.
 *
 * @param {string} value - The updated statement text from the expanded window.
 */
  const handleWindowTextChange = (value: string) => {
    setNewStatement(value);
  };

  /**
 * Fetches the list of question categories from the server and updates the categories state.
 */
  const fetchCategories = () => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  };

  /**
 * Handles the change event for the checkbox selection of alternatives, allowing for only one selection.
 *
 * @param {number} index - The index of the selected checkbox.
 */
  const handleCheckboxChange = (index) => {
    if (selectedCheckbox === index) {
      setSelectedCheckbox(null);
    } else {
      setSelectedCheckbox(index);
    }
  };

  /**
 * Toggles the open state of the dialog.
 */
  const handleOpen = () => setOpen(!open);

  /**
 * Updates the alternatives state with changes from input fields.
 *
 * @param {number} index - The index of the alternative being changed.
 * @param {string} value - The new value of the alternative.
 */
  const handleInputChange = (index, value) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = value;
    setAlternatives(newAlternatives);
  };

  /**
 * Resizes an image file to fit within specified maximum width and height dimensions while maintaining aspect ratio.
 * The resized image is converted to a data URL and passed to a callback function.
 *
 * @param {File} file - The image file to be resized.
 * @param {number} maxWidth - The maximum allowed width of the image.
 * @param {number} maxHeight - The maximum allowed height of the image.
 * @param {Function} callback - A callback function that receives the resized image as a data URL.
 */
  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      if (typeof result === 'string') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL(file.type));
        };
        img.src = result;
      } else {
        console.error('FileReader result is not a string');
      }
    };
    reader.readAsDataURL(file);
  };

  /**
 * Navigates the user back to the previous page in the browser's history stack.
 */
  const handleBack = () => {
    navigate(-1);
  };

  /**
 * Increments the key state to force the re-rendering of a component.
 * This technique is useful for triggering a component to reinitialize its state or effects.
 */
  const remountComponent = () => {
    setKey(prevKey => prevKey + 1);
  };

  /**
 * Handles the drop event for uploading an image, resizing the image before setting it to state.
 *
 * @param {React.DragEvent} event - The drop event containing the file to be uploaded.
 */
  const onDrop = React.useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === 'string') {
          resizeImage(file, 800, 800, (resizedImage) => {
            setImageSrc(resizedImage);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  /**
 * Handles the file input change for uploading an image, resizing the image before setting it to state.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event containing the file to be uploaded.
 */
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === 'string') {
          resizeImage(file, 800, 800, (resizedImage) => {
            setImageSrc(resizedImage);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /**
 * Triggers the click event on the hidden file input when the upload area is clicked.
 */
  const onAreaClick = () => {
    fileInputRef.current.click();
  };

  /**
 * Clears the current image source from the state.
 */
  const onDeleteImgSrc = () => {
    setImageSrc(null);
  };

  /**
 * Updates the title state with the new value from the input field.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the title input field.
 */
  const handleTitleChange = (event) => {
    setTitle(event);
  };

  /**
 * Saves the statement from the expanded window editor to the main form state and closes the expanded window.
 *
 * @param {string} value - The statement text to save.
 */
  const handleSaveStatementFromWindow = (value) => {
    setStatement(value);
    setTimeout(() => {
      setIsStatementActive(false);
    }, 500);
  };

  const uploadImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {console.log(snapshot);},
        (error) => {
          console.error('Upload error: ', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  /**
 * Converte um Data URL para um objeto File.
 *
 * @param {string} dataUrl - O Data URL a ser convertido.
 * @param {string} filename - O nome do arquivo a ser criado.
 * @returns {File} O objeto File criado a partir do Data URL.
 */
  function dataUrlToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  /**
 * Validates input fields and submits the question form data to the server.
 */
  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (isSwitchActive) {
      setStatement('');
    }

    if (!title.trim() || alternatives.some(alt => !alt.trim())) {
      setOpenErrorAlert(true);
      setCustomAlertMessage('Os campos devem ser preenchidos!');
      setTimeout(() => {
        setOpenErrorAlert(false);
      }, 3000);
      return;
    }

    let imageUrl: string = '';

    if (imageSrc) {
      const safeTitle = title.toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const filename = `${safeTitle}.png`;
      const file = dataUrlToFile(imageSrc, filename);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      imageUrl = await uploadImage(file);
    }

    const questionData = {
      title,
      statement,
      alternatives,
      rightAnswer: selectedCheckbox.toString(),
      difficulty: Number(difficulty),
      image: imageUrl,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions`, {
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

    } catch (error) {
      setOpenErrorAlert(true);
      setCustomAlertMessage('Atualize a página e tente novamente');
      setTimeout(() => {
        setOpenErrorAlert(false);
      }, 3000);
      console.error('Falha ao salvar a questão:', error);
    } finally {
      setOpenAlert(true);
      setAlternatives(Array(5).fill(''));
      remountComponent();
      setTitle('');
      setImageSrc('');
      setStatement('');
      setDifficulty('');
      setSelectedCheckbox(null);
      setIsSwitchActive(false);
      setIsSubmitting(false);

      setTimeout(() => {
        setOpenAlert(false);
      }, 1000);
    }
  };

  /**
 * Toggles the switch state indicating whether the statement should be disabled, and clears the statement if disabled.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event for the switch.
 */
  const handleSwitchChange = (event) => {
    setIsSwitchActive(event.target.checked);
    setStatement('');
  };

  /**
 * Toggles the visibility of the expanded window for editing the statement in a larger view.
 */
  const handleOpenStatementWindow = () => {
    setNewStatement(statement);
    setIsStatementActive(!isStatementActive);
  };

  React.useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkTheme(darkMode);
  }, []);

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

      <Dialog open={isStatementActive} handler={handleOpenStatementWindow} size="xl">
        <DialogBody className=''>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={newStatement}
            onChange={(value) => handleWindowTextChange(value)}
            className="my-custom-quill-window-editor"
          />
        </DialogBody>
        <DialogFooter className='gap-4'>
          <Button color='red' onClick={() => setIsStatementActive(false)}>Fechar</Button>
          <Button color='green' onClick={() => handleSaveStatementFromWindow(newStatement)}>salvar</Button>
        </DialogFooter>
      </Dialog>

      <BackButton />

      <div className='relative flex h-[80vh] w-full flex-col gap-6 overflow-hidden lg:justify-between'>
        <div className='flex flex-col gap-6 overflow-y-scroll lg:flex-row'>
          <div className='flex w-full flex-col gap-4'>
            <Typography variant='h4' className='text-black dark:text-white'>Corpo da questão</Typography>

            <div className='flex flex-col gap-4'>
              <Input
                crossOrigin={''}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            </div>

            <div>
              <div className={`h-fit transition-opacity ${!isSwitchActive ? 'opacity-100' : 'opacity-0'} flex flex-col`}>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={statement}
                  onChange={(value) => handleTextChange(value)}
                  className="my-custom-quill-editor bg-white"
                />

                <Button
                  size='sm'
                  className='mt-2 bg-blue-gray-200 text-blue-gray-800'
                  onClick={handleOpenStatementWindow}
                >Ampliar janela de enunciado</Button>
              </div>

              <div className='mt-2'>
                <Switch
                  className=''
                  crossOrigin={''}
                  color="blue"
                  label={
                    <div>
                      <Typography className="font-medium text-blue-gray-800 dark:text-blue-gray-100">
            Desabilitar Enunciado
                      </Typography>
                      <Typography variant="small" className="font-normal dark:text-blue-gray-200">
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
              </div>
            </div>
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

            <div className='mb-4 flex flex-col gap-4' key={key}>
              {alternatives.map((alternative, index) => (
                <AlternativeInput
                  disabled={isSubmitting}
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
        </div>

        <div className='flex h-fit w-full flex-col gap-4 p-4'>
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
              <Button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className=''
                color='green'
              >
                {isSubmitting ? (<Loader className='animate-spin' />) : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { QuestionForm };
