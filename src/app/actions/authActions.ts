'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

async function credentialsLogin({ email, password }: { email: string; password: string }) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: error.cause?.err?.message || 'Invalid email or password.' };
    }
    return { message: 'Something went wrong.' };
    // throw error;
  }
}

export async function handleCredentialsSignin({ email, password }: { email: string; password: string }) {
  return credentialsLogin({ email, password });
}

export async function handleRegister({ name, email, password }: { name: string; email: string; password: string }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { message: 'Email already registered.' };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return credentialsLogin({ email, password });
}

export async function handleGithubSignin() {
  await signIn('github', { redirectTo: '/' });
}

export async function handleGoogleSignin() {
  await signIn('google', { redirectTo: '/' });
}

export async function handleSignOut() {
  await signOut();
}
