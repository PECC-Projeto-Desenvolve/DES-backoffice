import { Button, Input, Typography, CardFooter, Card, Dialog, CardBody } from '@material-tailwind/react';

interface ICategoryDialog {
    open: boolean;
    color: string;
    categoryName: string;
    categoryId: string;
    value: string;
    onChange: (e: any) => void;
    onConfirm: () => void;
    handleOpen: () => void;
}

/**
 * Renders a dialog for editing the name of a category.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.open - Determines if the dialog is open.
 * @param {string} props.color - Background color for the category display.
 * @param {string} props.categoryName - The current name of the category.
 * @param {string} props.categoryId - The ID of the category.
 * @param {string} props.value - The new name input value for the category.
 * @param {(e: any) => void} props.onChange - Handler for changes in the input field.
 * @param {() => void} props.onConfirm - Function to call when the confirm button is clicked.
 * @param {() => void} props.handleOpen - Function to toggle the dialog's open state.
 * @returns {JSX.Element} A dialog component with inputs and actions for updating a category's name.
 */
function CategoryDialog({ open, color, categoryName, categoryId, value, onChange, handleOpen, onConfirm }: ICategoryDialog) {
  return (
    <>

      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Novo nome para a categoria
            </Typography>

            <div className='w-full rounded-md border p-2'>

              <div className='w-full rounded-md p-2' style={{ backgroundColor: `${color}`}}>
                <Typography variant='h6' className='text-white'>{categoryName.toUpperCase()}</Typography>
              </div>

              <Typography variant='small' className='mt-1'>id: <strong>{categoryId}</strong></Typography>
            </div>


            <Input label="Nome da categoria" size="lg" onChange={onChange} value={value}/>

          </CardBody>
          <CardFooter  className="flex gap-2 pt-0">
            <Button variant="outlined" onClick={handleOpen} fullWidth>
                Cancelar
            </Button>

            <Button
              onClick={onConfirm} fullWidth color='green'>
                Confirmar
            </Button>

          </CardFooter>
        </Card>
      </Dialog></>
  );
}

export { CategoryDialog};
