'use client';

import Centerblock from '@centerblock/Centerblock';
import { useAppSelector } from '@/store/store';
import { useState, useEffect } from 'react';

export default function MyPlaylistPage() {
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Centerblock
      tracks={favoriteTracks}
      loading={loading}
      title="Мой плейлист"
    />
  );
}
