'use client';

import Centerblock from '@centerblock/Centerblock';
import { useEffect, useState } from 'react';
import { fetchCategoryTracks } from '@/services/tracks/tracksService';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fetchCategoryTracks(id as string);
        setTracks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, [id]);

  if (loading) return <div>Загрузка треков подборки...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return <Centerblock tracks={tracks} loading={loading} error={error} />;
}
