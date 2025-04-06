'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import RichTextEditor from '@/components/RichTextEditor';
import NoteTree from '@/components/NoteTree';

export default function NotesPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [parentId, setParentId] = useState('');
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    const { data } = await axios.get('/api/notes');
    setNotes(data.notes);
  };

  const saveNote = async () => {
    await axios.post('/api/notes', { title, content, parentId: parentId || null });
    setTitle('');
    setContent('');
    setParentId('');
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='border p-4 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>Create a Note</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Note Title'
          className='mb-4 w-full border-b-2 p-2 text-lg outline-none'
        />
        <select value={parentId} onChange={(e) => setParentId(e.target.value)} className='mb-4 w-full border-b-2 p-2 outline-none'>
          <option value=''>No Parent (Top Level)</option>
          {notes.map((note: unknown) => (
            <option key={note?._id} value={note._id}>
              {note.title}
            </option>
          ))}
        </select>
        <RichTextEditor content={content} onChange={setContent} />
        <button onClick={saveNote} className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'>
          Save Note
        </button>
      </div>
      <div className='border p-4 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>My Notes</h2>
        <NoteTree notes={notes} />
      </div>
    </div>
  );
}
