'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import RichTextSocketEditor from '@/components/RichTextSocketEditor';

export default function SingleNotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<unknown>(null);

  const loadNote = async () => {
    const { data } = await axios.get(`/api/notes/${params.id}`);
    setNote(data.note);
  };

  const saveContent = async (content: string) => {
    await axios.patch(`/api/notes/${params.id}`, { content });
  };

  useEffect(() => {
    loadNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (!note) {
    return <div>Loading...</div>;
  }
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>{note.title}</h1>
      <RichTextSocketEditor noteId={note._id} content={note.content} onChange={saveContent} />
    </div>
  );
}
