import css from './NoteList.module.css'
import { deleteNote, fetchNotes } from '../../services/noteService';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';

interface NoteListProps {
  search: string;
  currentPage: number;
}

export default function NoteList({ search, currentPage }: NoteListProps) {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['notes', currentPage, search],
        queryFn: () => fetchNotes(search, currentPage, 12),
        placeholderData: keepPreviousData,
    });

    const deleteNoteMutation = useMutation({
        mutationFn: (noteId: number) => deleteNote(noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    if (!data?.notes.length) {
        return null;
    }

    return (
        <>
            <ul className={css.list}>
            {data?.notes.map((note: Note) => 
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{ note.title }</h2>
                    <p className={css.content}>{ note.content }</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{ note.tag }</span>
                        <button className={css.button} onClick={() => deleteNoteMutation.mutate(note.id)} >Delete</button>
                    </div>
                    </li>
                )}
            </ul>
            {data?.totalPages || 0}
        </>
    );
}