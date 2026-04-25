'use client';

import { useEffect, useState } from 'react';
import styles from './layout.module.css';
import Bar from '@bar/Bar';
import Navigation from '@navigation/Navigation';
import Sidebar from '@sidebar/Sidebar';
import AudioPlayer from '@/components/AudioPlayer';
import {
  fetchAllSelections,
  fetchTracks,
} from '@/services/tracks/tracksService';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tracks, setTracks] = useState<TypesTrack[]>([]);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const fetchedTracks = await fetchTracks();
        setTracks(fetchedTracks);
        await fetchAllSelections();
      } catch (error) {
        console.error('Ошибка загрузки треков:', error);
      }
    };

    loadTracks();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />

          {children}

          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
        <AudioPlayer playlist={tracks} />
      </div>
    </div>
  );
}
