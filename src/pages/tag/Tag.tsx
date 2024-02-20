import { Card, Chip } from '@material-tailwind/react';
import { BackButton } from '../../components/BackButton';

/**
 * Component representing a Tag display.
 * Renders a back button and a card with a chip indicating a version tag.
 * @returns {React.ReactElement} The Tag component.
 */
function Tag() {
  return (
    <section className='flex h-full w-full flex-col gap-4'>
      <BackButton />
      <Card className='w-fit p-6 '>
        <Chip value="1.0.1" size='lg' color='purple' className='text-xl shadow-lg'/>
      </Card>
    </section>
  );
}

export default Tag;
