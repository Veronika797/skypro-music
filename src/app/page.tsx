'use client';

import styles from '@/app/page.module.css';
import Bar from '@bar/Bar';
import Navigation from '@navigation/Navigation';
import Sidebar from '@sidebar/Sidebar';
import Centerblock from '@centerblock/Centerblock';
import AudioPlayer from '../components/AudioPlayer';
import { useAppSelector } from '@/store/store';

export default function Home() {
  const playlist = useAppSelector((state) => state.tracks.playlist);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock />
          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
        <AudioPlayer playlist={playlist} />
      </div>
    </div>
  );
}
