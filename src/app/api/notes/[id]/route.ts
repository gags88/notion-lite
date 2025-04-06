import { dbConnect } from '@/lib/dbConnect';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const note = await Note.findOne({ _id: params.id, author: session.user.id });
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, note });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { content } = await request.json();
  await dbConnect();
  const note = await Note.findOneAndUpdate({ _id: params.id, author: session.user.id }, { content, updatedAt: Date.now() }, { new: true });
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, note });
}
