'use client';


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteForm.module.css';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

export type NoteFormValues = Pick<Note, 'title' | 'content' | 'tag'>;

interface NoteFormProps {
  onCancel: () => void;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};


export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

   const formAction = async (formData: FormData) => {
    const values: NoteFormValues = {
      title: String(formData.get('title') ?? '').trim(),
      content: String(formData.get('content') ?? '').trim(),
      tag: String(
        formData.get('tag') ?? 'Todo'
      ) as NoteFormValues['tag'],
    };

    await mutateAsync(values);
  };
   const handleCancel = () => {
    router.push('/notes/filter/all');
  };

  return (
    <form className={css.form} action={formAction}>
      <label className={css.formGroup}>
        Title

        <input
          className={css.input}
          type="text"
          name="title"
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft?.title} 
          onChange={handleChange}
        />
      </label>

      <label className={css.formGroup}>
        Content

        <textarea
          className={css.textarea}
          name="content"
          maxLength={500}
          defaultValue={draft?.content}
          onChange={handleChange}
        />
      </label>

      <label className={css.formGroup}>
        Tag

        <select
          className={css.select}
          name="tag"
          defaultValue={draft?.tag}
          onChange={handleChange}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </label>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className={css.cancelButton}
        >
          Cancel
        </button>

        <button type="submit" disabled={isPending} className={css.submitButton}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}