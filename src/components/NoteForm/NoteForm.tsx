import { ErrorMessage, Field, Formik } from 'formik';
import { createNote, type newNoteData } from '../../services/noteService';
import css from './NoteForm.module.css'
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NoteFormProps {
    onCancel: () => void;
}

const validationShema = Yup.object({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title must be at most 50 characters')
        .required(),
    content: Yup.string()
        .max(500, 'Content must be at most 500 characters'),
    tag: Yup.string()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
        .required(),
});

const initialvalues: newNoteData = {
    title: '',
    content: '',
    tag: 'Todo',
}

export default function NoteForm({ onCancel }: NoteFormProps) {
    const queryClient = useQueryClient();

    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onCancel();
        }
    });

    return (
        <Formik
            initialValues={initialvalues}
            validationSchema={validationShema}
            onSubmit={(values) => {
                createNoteMutation.mutate(values);
            }}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field id="title" type="text" name="title" className={css.input} />
                        <ErrorMessage name="title" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                        id="content"
                        name="content"
                        rows="8"
                        className={css.textarea}
                        />
                        <ErrorMessage name="content" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field as="select" id="tag" name="tag" className={css.select}>
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <ErrorMessage name="tag" className={css.error} />
                    </div>

                    <div className={css.actions}>
                        <button type="button" className={css.cancelButton} onClick={onCancel}>
                        Cancel
                        </button>
                        <button
                        type='submit'
                        className={css.submitButton}
                        disabled={isSubmitting || !isValid || !dirty || createNoteMutation.isPending}
                        >
                        {createNoteMutation.isPending ? 'Creating...' : 'Create Note'}
                        </button>
                    </div>
                </form>
            )}
        </Formik>
    );
}