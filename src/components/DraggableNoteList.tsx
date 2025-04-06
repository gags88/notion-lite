'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DraggableNoteList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get('/api/notes').then(({ data }) => setNotes(data.notes));
  }, []);

  const onDragEnd = (result: unknown) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setNotes(items);
    // Save new order to backend
    items.forEach((item, idx) => {
      axios.patch(`/api/notes/${item._id}/order`, { order: idx });
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='notes'>
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {notes.map((note: unknown, index) => (
              <Draggable key={note._id} draggableId={note._id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className='mb-2 p-2 border rounded bg-gray-50'
                  >
                    {note.title}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
