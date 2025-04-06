import { dbConnect } from '@/lib/dbConnect';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { order } = await request.json();
  await dbConnect();
  const updatedNote = await Note.findOneAndUpdate(
    { _id: params.id, author: session.user.id },
    { order, updatedAt: Date.now() },
    { new: true }
  );
  if (!updatedNote) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, note: updatedNote });
}
