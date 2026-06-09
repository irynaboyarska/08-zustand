'use client';
import { useState } from 'react';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

type FormErrors = Partial<Record<keyof NoteFormValues, string>>;

const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Maximum number of characters 50')
    .required('Title is required'),
  content: Yup.string().max(500, 'Maximum number of characters 500'),
  tag: Yup.string()
    .required('Tag is required')
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']),
});

export const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const formAction = async (formData: FormData) => {
    const values: NoteFormValues = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as NoteTag,
    };

    try {
      await NoteSchema.validate(values, { abortEarly: false });

      setErrors({});
      createMutation.mutate(values);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const formErrors: FormErrors = {};

        error.inner.forEach(err => {
          if (err.path) {
            formErrors[err.path as keyof NoteFormValues] = err.message;
          }
        });

        setErrors(formErrors);
      }
    }
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={event =>
            setDraft({
              ...draft,
              title: event.target.value,
            })
          }
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={event =>
            setDraft({
              ...draft,
              content: event.target.value,
            })
          }
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={event =>
            setDraft({
              ...draft,
              tag: event.target.value as NoteTag,
            })
          }
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>
      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={createMutation.isPending}>
          Create note
        </button>
      </div>
    </form>
  );
};
