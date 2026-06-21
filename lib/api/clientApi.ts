import type { Note } from '@/types/note';
import { nextServer } from './api';
import type { User } from '@/types/user';


interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type RegisterRequest = {
  email: string;
  password: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};



type CreateNoteData = Pick<Note, 'title' | 'content' | 'tag'>;

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

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
  if (search.trim() !== '') {
    params.search = search;
  }

  if (tag && tag.trim() !== '' && tag.toLowerCase() !== 'all') {
    params.tag = tag;
  }
  const response = await nextServer.get<FetchNotesResponse>(
    '/notes',
    {
      params,
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );

  return response.data;
};

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response = await nextServer.post<Note>(
    '/notes',
    note,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );

  return response.data;
};

export const deleteNote = async (id: Note['id']): Promise<Note> => {
  const response = await nextServer.delete<Note>(
    `/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );

  return response.data;
};

export const fetchNoteById = async (id: Note['id']): Promise<Note> => {
  const response = await nextServer.get<Note>(
    `/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );

  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
}

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};

interface UpdateMeRequest {
  username: string;
}

type UpdateMeResponse =
  | User
  | {
      user: User;
    };

export const updateMe = async (
  data: UpdateMeRequest
): Promise<User> => {
  const response = await nextServer.patch<UpdateMeResponse>(
    '/users/me',
    data
  );

  if ('user' in response.data) {
    return response.data.user;
  }

  return response.data;
};