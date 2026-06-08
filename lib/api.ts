import axios from "axios";
import type { Note } from "../types/note";

interface FetchNotesResponse{
    notes: Note[];
    totalPages: number;
}

interface CreateNoteRequest {
  title: string;
  content: string;
  tag: string;
}

 export const fetchNotes = async (page: number, perPage: number, search?: string, tag?: string,): Promise<FetchNotesResponse> => {
    const response = await axios.get<FetchNotesResponse>(`https://notehub-public.goit.study/api/notes`, {
        params: {
          page,
          perPage,
          search,
          ...(tag ? { tag } : {}),
        },

        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
        }
    });
    return response.data;
}

export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  const response = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    note,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
      },
    },
  );

  return response.data;
};

export const deleteNote = async(id: string): Promise<Note> => {
    const response = await axios.delete<Note>(`https://notehub-public.goit.study/api/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
        }
    })

    return response.data
}

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
      },
    }
  );

  return response.data;
};