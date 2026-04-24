'use client';

import Centerblock from '@centerblock/Centerblock';
import { useEffect, useState } from 'react';
import { fetchSelectionTracks } from '@/services/tracks/tracksService';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useParams } from 'next/navigation';
import styles from '../../main/page.module.css';
import Navigation from '@navigation/Navigation';
import Sidebar from '@sidebar/Sidebar';
import Bar from '@bar/Bar';
import AudioPlayer from '@/components/AudioPlayer';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>('Подборка');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlaylist = async () => {
      const cleanId = Array.isArray(id) ? id[0] : id;
      if (!cleanId) return;

      try {
        setLoading(true);
        const { name, tracks } = await fetchSelectionTracks(cleanId);
        setPlaylistTitle(name);
        setTracks(tracks);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setTracks([]);
        setPlaylistTitle('Подборка');
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock
            tracks={tracks}
            loading={loading}
            error={error}
            title={playlistTitle}
          />
          <Sidebar />
        </main>
        <Bar />
        <AudioPlayer playlist={tracks} />
      </div>
    </div>
  );
}
