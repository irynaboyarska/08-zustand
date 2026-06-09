import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface FilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedTag = slug[0];

  const tagTitle = selectedTag === 'all' ? 'All notes' : `${selectedTag}`;

  return {
    title: `Notes - ${tagTitle}`,
    description: `Browse ${tagTitle.toLowerCase()} in NoteHub.`,
    openGraph: {
      title: `Notes - ${tagTitle}`,
      description: `Browse ${tagTitle.toLowerCase()} in NoteHub.`,
      url: `https://notehub.com/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${tagTitle} page`,
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const selectedTag = slug[0];

  const tag = selectedTag === 'all' ? undefined : selectedTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes(1, 12, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
