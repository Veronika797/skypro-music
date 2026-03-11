import { useRef, useState, useEffect } from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './App.module.css';
import { formatTime } from '@/Utils/helper';

const currentTrack = 'https://path-to-your-audio-file.mp3';

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current
        .play()
        .catch((e) => console.error('Autoplay failed:', e));
    }
  }, [isPlaying]);

  return (
    <div className={styles.app}>
      <h1>Полоса прогресса</h1>
      <audio
        src={currentTrack}
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
      <ProgressBar
        max={duration || 100}
        value={currentTime}
        step={0.01}
        onChange={handleSeek}
      />
      <button
        className={styles.button}
        onClick={togglePlay}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <div style={{ marginTop: '10px', fontSize: '14px', color: '#aaa' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
