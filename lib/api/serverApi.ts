import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import { nextServer } from './api';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}



const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
};

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: {
    page: number;
    perPage: number;
    search?: string;
    tag?: string;
  } = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (tag?.trim() && tag.toLowerCase() !== 'all') {
    params.tag = tag;
  }

  const cookieHeader = await getCookieHeader();

  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const fetchNoteById = async (
  id: string
): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

type CheckSessionResponse = {
  success: boolean;
};

export const checkSession = async () => {
  const cookieStore = await cookies();

  const response =
    await nextServer.get<CheckSessionResponse>(
      '/auth/session',
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

  return response;
};

export const getMe = async () => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};