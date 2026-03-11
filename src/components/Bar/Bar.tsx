'use client';

import classNames from 'classnames';
import styles from '@bar/bar.module.css';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setCurrentTrack,
  setIsPlay,
  setIsRepeat,
  setIsShuffle,
  setVolume,
  toggleMute as toggleMuteAction,
  setCurrentTime,
} from '@/store/features/trackSlice';
import { useState, useRef, useEffect } from 'react';

export default function Bar() {
  const [isLiked, setIsLiked] = useState(false);
  const volume = useAppSelector((state) => state.tracks.volume);
  const isMuted = useAppSelector((state) => state.tracks.isMuted);

  const currentTime = useAppSelector((state) => state.tracks.currentTime);
  const duration = useAppSelector((state) => state.tracks.duration);

  const isRepeat = useAppSelector((state) => state.tracks.isRepeat);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const playlist = useAppSelector((state) => state.tracks.playlist);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const dispatch = useAppDispatch();

  const progressContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || duration === 0) return;

    const rect = progressContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = Math.min(
      duration,
      Math.max(0, (clickX / width) * duration),
    );

    dispatch(setCurrentTime(newTime));
  };

  const handleProgressMouseDown = () => setIsDragging(true);
  const handleProgressMouseUp = () => setIsDragging(false);
  const handleProgressMouseLeave = () => setIsDragging(false);

  const handlePrevTrack = () => {
    if (!playlist.length || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t._id === currentTrack._id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    dispatch(setCurrentTrack(playlist[prevIndex]));
    dispatch(setIsPlay(true));
  };

  const handleNextTrack = () => {
    if (!playlist.length || !currentTrack) return;

    if (isRepeat) {
      dispatch(setCurrentTime(0));
      dispatch(setIsPlay(true));
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      dispatch(setCurrentTrack(playlist[randomIndex]));
      dispatch(setIsPlay(true));
    } else {
      const currentIndex = playlist.findIndex(
        (t) => t._id === currentTrack._id,
      );
      const nextIndex = (currentIndex + 1) % playlist.length;
      dispatch(setCurrentTrack(playlist[nextIndex]));
      dispatch(setIsPlay(true));
    }
  };

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleRepeat = () => dispatch(setIsRepeat(!isRepeat));
  const toggleShuffle = () => dispatch(setIsShuffle(!isShuffle));
  const togglePlay = () => dispatch(setIsPlay(!isPlaying));

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    dispatch(setVolume(newVolume));
  };

  const toggleMute = () => {
    dispatch(toggleMuteAction());
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && !isDragging && currentTrack && duration > 0) {
      interval = setInterval(() => {
        if (currentTime < duration) {
          dispatch(setCurrentTime(currentTime + 1));
        } else {
          clearInterval(interval!);
          handleNextTrack();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, isDragging, currentTrack, dispatch, duration]);

  if (!currentTrack) {
    return (
      <div className={styles.barTrack}>
        <div className={styles.bar__content}>
          <div className={styles.player__trackPlay}>
            <div className={styles.trackPlay__contain}></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.bar}>
      <div className={styles.bar__content}>
        <div className={styles.bar__progressContainer}>
          <div
            ref={progressContainerRef}
            className={styles.bar__playerProgress}
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
            onMouseUp={handleProgressMouseUp}
            onMouseLeave={handleProgressMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <div
              className={styles.bar__progressFill}
              style={{
                width: `${progressPercent}%`,
                transition: isDragging ? 'none' : 'width 0.1s linear',
              }}
            />
          </div>

          <div className={styles.bar__timeDisplay}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div
                className={classNames(styles.player__btnPrev, styles.btn)}
                onClick={handlePrevTrack}
              >
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/logo/prev.svg"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnPlay, styles.btn)}
                onClick={togglePlay}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      isPlaying ? '/img/logo/pause.svg' : '/img/logo/play.svg'
                    }
                  ></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnNext, styles.btn)}
                onClick={handleNextTrack}
              >
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/logo/next.svg"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnRepeat, styles.btnIcon)}
                onClick={toggleRepeat}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use
                    xlinkHref={
                      isRepeat
                        ? '/img/logo/repeat2.svg'
                        : '/img/logo/repeat.svg'
                    }
                  ></use>
                </svg>
              </div>
              <div
                className={classNames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
                onClick={toggleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use
                    xlinkHref={
                      isShuffle
                        ? '/img/logo/shuffle2.svg'
                        : '/img/logo/shuffle.svg'
                    }
                  ></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <span
                    className={classNames(
                      styles.playIndicator,
                      isPlaying
                        ? styles['playIndicator--playing']
                        : styles['playIndicator--paused'],
                    )}
                  />
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
              <div className={styles.volume__image} onClick={toggleMute}>
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
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
