'use client';

import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import axios from 'axios';

export default function NotesPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);

  const saveNote = async () => {
    await axios.post('/api/notes', { title, content });
    setTitle('');
    setContent('');
    loadNotes();
  };

  const loadNotes = async () => {
    const { data } = await axios.get('/api/notes');
    setNotes(data.notes);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className='p-6'>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Note Title'
        className='mb-4 w-full border-b-2 p-2 text-xl outline-none'
      />
      <RichTextEditor content={content} onChange={setContent} />
      <button onClick={saveNote} className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'>
        Save Note
      </button>

      <div className='mt-10'>
        {notes.map((note) => (
          <div key={note._id} className='mb-4 rounded-lg border p-4'>
            <h2 className='text-lg font-semibold'>{note.title}</h2>
            <div className='prose mt-2' dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}
