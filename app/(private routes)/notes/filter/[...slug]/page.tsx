import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from "next"


const perPage = 12;
type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentSlug = slug[0] ?? 'all';
  const isAllNotes = currentSlug.toLowerCase() === 'all';
  const filterName = isAllNotes ? 'All' : currentSlug;
  const title = `${filterName} notes | NoteHub`;
  const description = isAllNotes
    ? 'View all notes in the NoteHub application.'
    : `View notes filtered by the ${filterName} category.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-kappa-sepia.vercel.app/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${filterName} notes in NoteHub`,
        },
      ],
    },
  };
}

const NotesPage = async ({ params }: Props) => {
  const { slug } = await params;
  const currentSlug = slug[0];
  const tag = currentSlug.toLowerCase() === 'all' ? '' : currentSlug;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, 1],
    queryFn: () => fetchNotes(1, perPage, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag}/>
    </HydrationBoundary>
  );
};

export default NotesPage;