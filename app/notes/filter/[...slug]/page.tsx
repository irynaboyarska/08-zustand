import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface FilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
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
