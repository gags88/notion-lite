import { dbConnect } from '@/lib/dbConnect';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { title, content } = await request.json();
  await dbConnect();
  const note = await Note.create({
    title,
    content,
    author: session.user.id,
  });
  return NextResponse.json({ success: true, note });
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const notes = await Note.find({ author: session.user.id }).sort({ updatedAt: -1 });
  return NextResponse.json({ success: true, notes });
}
