import { create } from 'zustand';
import { NoteFormValues } from '@/components/NoteForm/NoteForm';
import { persist } from 'zustand/middleware';

type NoteDraftStore = {
    draft: NoteFormValues;
    setDraft: (draft: NoteFormValues) => void;
    clearDraft: () => void;
};

const initialDraft: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) => set(() => ({ draft: note })),
            clearDraft: () => set(() => ({ draft: initialDraft })),
        }),
        {
            name: 'note-draft-storage', 
            partialize: (state) => ({ draft: state.draft }),
        },
    ),
);    