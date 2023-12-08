import React from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Item {
  id: number;
  title: string;
  description: string;
}

const SortableListComponent = () => {
  const initialValue: Item[] = [
    { id: 1, title: 'First Item', description: 'This is the first item.' },
    { id: 2, title: 'Second Item', description: 'This is the second item.' },
    { id: 3, title: 'Third Item', description: 'This is the third item.' },
    { id: 4, title: 'Fourth Item', description: 'This is the fourth item.' },
    { id: 5, title: 'Fifth Item', description: 'This is the fifth item.' },
    { id: 6, title: 'Sixth Item', description: 'This is the sixth item.' },
    { id: 7, title: 'Seventh Item', description: 'This is the seventh item.' },
    { id: 8, title: 'Eighth Item', description: 'This is the eighth item.' },
    { id: 9, title: 'Ninth Item', description: 'This is the ninth item.' },
    { id: 10, title: 'Tenth Item', description: 'This is the tenth item.' },
    { id: 11, title: 'Eleventh Item', description: 'This is the eleventh item.' },
    { id: 12, title: 'Twelfth Item', description: 'This is the twelfth item.' },
    { id: 13, title: 'Thirteenth Item', description: 'This is the thirteenth item.' },
    { id: 14, title: 'Fourteenth Item', description: 'This is the fourteenth item.' },
    { id: 15, title: 'Fifteenth Item', description: 'This is the fifteenth item.' },
    { id: 16, title: 'Sixteenth Item', description: 'This is the sixteenth item.' },
    { id: 17, title: 'Seventeenth Item', description: 'This is the seventeenth item.' },
    { id: 18, title: 'Eighteenth Item', description: 'This is the eighteenth item.' },
    { id: 19, title: 'Nineteenth Item', description: 'This is the nineteenth item.' },
    { id: 20, title: 'Twentieth Item', description: 'This is the twentieth item.' }
  ];

  const [items, setItems] = React.useState(initialValue);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex(item => item.id === active.id);
        const newIndex = prev.findIndex(item => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <ul className="m-0 flex list-none flex-col gap-2 overflow-x-hidden overflow-y-scroll">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} title={item.title} description={item.description} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

const SortableItem = ({ id, title, description }: Item) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} className="flex w-full gap-4 rounded-md border bg-white p-2 transition-shadow active:z-50 active:shadow-xl">
      <div {...listeners} className="flex cursor-grab items-center justify-center rounded p-1 hover:bg-gray-100">
        <GripVertical />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </li>
  );
};

export default SortableListComponent;
