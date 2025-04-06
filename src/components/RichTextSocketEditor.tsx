'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/github-dark.css';
import useSocket from '@/hooks/useSocket';
import { useEffect } from 'react';

const lowlight = createLowlight(common);

interface Props {
  content?: string;
  onChange?: (content: string) => void;
  noteId: string;
}

export default function RichTextSocketEditor({ content, onChange, noteId }: Props) {
  const socket = useSocket(noteId);

  const editor = useEditor({
    extensions: [StarterKit, Image, CodeBlockLowlight.configure({ lowlight })],
    content: content || '',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
      socket.emit('note-update', html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!socket || !editor) {
      return;
    }
    socket.on('note-update', (html: string) => {
      if (html !== editor.getHTML()) {
        editor.commands.setContent(html, false);
      }
    });
  }, [socket, editor]);

  return <EditorContent editor={editor} />;
}
