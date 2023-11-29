import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../index.css';

type ItemType = {
  id: string;
  content: string;
};

const defaultList: ItemType[] = [
  { id: 'item-1', content: 'Item 1' },
  // Add more items as needed
];

export default function DragDropList() {
  const [itemList, setItemList] = useState(defaultList);

  const handleDrop = (droppedItem: any) => {
    if (!droppedItem.destination) return;

    const updatedList = Array.from(itemList);
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

    setItemList(updatedList);
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="list-container bg-gray-200 p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {itemList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className="item-container m-4 border border-black bg-white p-6"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
