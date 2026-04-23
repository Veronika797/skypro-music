'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Bar from '@bar/Bar';
import Navigation from '@navigation/Navigation';
import Sidebar from '@sidebar/Sidebar';
import { fetchTracks } from '@/services/tracks/tracksService';
import AudioPlayer from '@/components/AudioPlayer';
import Centerblock from '@/components/Centerblock/Centerblock';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

export default function Home() {
  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const fetchedTracks = await fetchTracks();
        setTracks(fetchedTracks);
      } catch (error) {
        console.error('Ошибка загрузки треков:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />

          <Centerblock tracks={tracks} loading={loading} />

          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
        <AudioPlayer playlist={tracks} />
      </div>
    </div>
  );
}
