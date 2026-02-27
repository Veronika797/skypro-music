'use client';
import classNames from 'classnames';
import styles from '@bar/bar.module.css';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setIsPlay } from '@/store/features/trackSlice';

export default function Bar() {
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [savedVolume, setSavedVolume] = useState(50);

  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch((e) => {
        console.error('Failed to play audio:', e);
        dispatch(setIsPlay(false));
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, dispatch]);

  if (!currentTrack) {
    return (
      <div className={styles.bar}>
        <div className={styles.bar__content}>
          <div className={styles.player__trackPlay}>
            <div className={styles.trackPlay__contain}></div>
          </div>
        </div>
      </div>
    );
  }

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const togglePlay = () => {
    dispatch(setIsPlay(!isPlaying));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);

    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };
  const toggleMute = () => {
    if (isMuted) {
      setVolume(savedVolume);
      setIsMuted(false);
    } else {
      setSavedVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} src={currentTrack?.track_file}></audio>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/logo/prev.svg"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnPlay, styles.btn)}
                onClick={togglePlay}
                role="button"
                tabIndex={0}
                aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') togglePlay();
                }}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      isPlaying ? '/img/logo/pause.svg' : '/img/logo/play.svg'
                    }
                  ></use>
                </svg>
              </div>
              <div className={styles.player__btnNext}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/logo/next.svg"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnRepeat, styles.btnIcon)}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/logo/repeat.svg"></use>
                </svg>
              </div>
              <div
                className={classNames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/logo/shuffle.svg"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  {currentTrack && (
                    <span
                      className={classNames(
                        styles.playIndicator,
                        isPlaying
                          ? styles['playIndicator--playing']
                          : styles['playIndicator--paused'],
                      )}
                    />
                  )}
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={'trackPlay__authorLink'} href="">
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classNames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                  onClick={toggleLike}
                  role="button"
                  tabIndex={0}
                  aria-label={isLiked ? 'Dislike' : 'Like'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleLike();
                  }}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use
                      xlinkHref={
                        isLiked ? '/img/logo/dislike.svg' : '/img/logo/like.svg'
                      }
                    ></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div
                className={styles.volume__image}
                onClick={toggleMute}
                role="button"
                tabIndex={0}
              >
                <svg className={styles.volume__svg}>
                  <use
                    xlinkHref={
                      isMuted || volume === 0
                        ? '/img/logo/volume-off.svg'
                        : '/img/logo/volume.svg'
                    }
                  ></use>
                </svg>
              </div>
              <div className={classNames(styles.volume__progress, styles.btn)}>
                <input
                  className={classNames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label={isMuted ? 'Звук отключен' : 'Регулятор громкости'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
