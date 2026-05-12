'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Centerblock from '@components/Centerblock/Centerblock';
import { fetchTracks } from '@services/tracks/tracksService';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

const PLAYLIST_NAMES: Record<string, string> = {
  '2': 'Плейлист дня',
  '3': '100 танцевальных хитов',
  '4': 'Инди-заряд',
};

export default function CategoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const title = PLAYLIST_NAMES[id] || 'Плейлист';

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const data = await fetchTracks();
        setTracks(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, [id]);

  return <Centerblock tracks={tracks} loading={loading} title={title} />;
}
