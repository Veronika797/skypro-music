'use client';

import { useEffect, useState, ReactNode } from 'react';
import styles from './layout.module.css';
import Bar from '@components/Bar/Bar';
import Navigation from '@components/Navigation/Navigation';
import Sidebar from '@components/Sidebar/Sidebar';
import AudioPlayer from '@components/AudioPlayer';
import { fetchTracks } from '@services/tracks/tracksService';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

export default function MusicLayout({
  children,
}: {
  children:
    | ReactNode
    | ((props: { tracks: TypesTrack[]; loading: boolean }) => ReactNode);
}) {
  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setLoading(true);
        const fetchedTracks = await fetchTracks();
        setTracks(fetchedTracks);
        setLoading(false);
      } catch {
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

          {typeof children === 'function'
            ? children({ tracks, loading })
            : children}

          <Sidebar loading={loading} />
        </main>
        <Bar />
        <footer className="footer"></footer>
        <AudioPlayer playlist={tracks} />
      </div>
    </div>
  );
}
