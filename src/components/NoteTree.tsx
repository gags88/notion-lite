'use client';

import Link from 'next/link';

interface Note {
  _id: string;
  title: string;
  parentId?: string | null;
}

interface NoteTreeProps {
  notes: Note[];
  parentId?: string | null;
}

export default function NoteTree({ notes, parentId = null }: NoteTreeProps) {
  const filteredNotes = notes.filter((note) => note.parentId === parentId);
  if (!filteredNotes.length) {
    return null;
  }
  return (
    <ul className='ml-4 border-l pl-2'>
      {filteredNotes.map((note) => (
        <li key={note._id} className='mb-1'>
          <Link href={`/notes/${note._id}`} className='text-blue-600 hover:underline'>
            {note.title}
          </Link>
          <NoteTree notes={notes} parentId={note._id} />
        </li>
      ))}
    </ul>
  );
}
