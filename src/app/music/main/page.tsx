'use client';

import { useEffect, useState } from 'react';
import Centerblock from '@components/Centerblock/Centerblock';
import { fetchTracks } from '@services/tracks/tracksService';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

export default function MusicMainPage() {
  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const data = await fetchTracks();
        setTracks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Ошибка загрузки треков:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, []);

  return <Centerblock tracks={tracks} loading={loading} title="Треки" />;
}
