'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation';
import { fetchNotes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Link from 'next/link';


import css from './NotesPage.module.css';

const perPage = 12;
type NotesClientProps = {
  tag: string;
};

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data, isFetching } = useQuery({
    queryKey: ['notes', search, page, tag],
    queryFn: () => fetchNotes(page, perPage, search, tag),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        )}

        <Link
        href="/notes/action/create"
        className={css.button}
        >
          Create note +
        </Link>
      </header>

      {isFetching && <p className={css.loading}>Loading...</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

      
        
      
    </div>
  );
}