import axios from "axios"
import type { Note } from "../types/note";

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const API_URL = 'https://notehub-public.goit.study/api/notes';

interface notesResponce {
    notes: Note[];
    page: number
    totalPages: number;
}

export interface newNoteData {
    title: string;
    content: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

export const fetchNotes = async (search?: string, page = 1, perPage = 12): Promise<notesResponce> => {
    const response = await axios.get<notesResponce>(API_URL, {
        params: {
            ...(search ? { search } : {}),
            page,
            perPage,
        },
        headers: {
            Authorization: `Bearer ${API_KEY}`
        },
    });

    console.log('Response fetch:', response.data);

    return response.data;
}

export const createNote = async (noteData: newNoteData): Promise<Note> => {
    const response = await axios.post(API_URL, noteData, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        },
    });

    console.log('Response create:', response.data);

    return response.data;
}

export const deleteNote = async (noteId: number): Promise<Note>  => {
    const response = await axios.delete(`${API_URL}/${noteId}`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        },
    });

    return response.data;
}