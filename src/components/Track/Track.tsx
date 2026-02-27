'use client';

import { formatTime } from '@/Utils/helper';
import Link from 'next/link';
import styles from '@track/Track.module.css';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack, setIsPlay } from '@/store/features/trackSlice';
import classNames from 'classnames';

interface TrackProps {
  tracks: TypesTrack[];
}

export default function Track({ tracks }: TrackProps) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  const handleTrackClick = (track: TypesTrack) => {
    const isSameTrack = currentTrack?._id === track._id;
    if (isSameTrack) {
      dispatch(setIsPlay(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlay(true));
    }
  };

  return (
    <div className={styles.content__playlist}>
      {tracks.map((track) => {
        const isActive = currentTrack?._id === track._id;
        const isActiveAndPlaying = isActive && isPlaying;

        return (
          <div
            key={track._id}
            className={`${styles.playlist__item} ${isActive ? styles.active : ''}`}
            onClick={() => handleTrackClick(track)}
          >
            <div className={styles.playlist__track}>
              <div className={styles.track__title}>
                <div className={styles.track__titleImage}>
                  {isActive ? (
                    <span
                      className={classNames(
                        styles.playIndicator,
                        isActiveAndPlaying
                          ? styles['playIndicator--playing']
                          : styles['playIndicator--paused'],
                      )}
                    />
                  ) : (
                    <svg className={styles.track__titleSvg}>
                      <use xlinkHref="/img/logo/note.svg"></use>
                    </svg>
                  )}
                </div>
                <div>
                  <Link className={styles.track__titleLink} href="">
                    {track.name}{' '}
                    <span className={styles.track__titleSpan}></span>
                  </Link>
                </div>
              </div>
              <div className={styles.track__author}>
                <Link className={styles.track__authorLink} href="">
                  {track.author}
                </Link>
              </div>
              <div className={styles.track__album}>
                <Link className={styles.track__albumLink} href="">
                  {track.album}
                </Link>
              </div>
              <div className={styles.track__content}>
                <svg className={styles.track__timeSvg}>
                  <use xlinkHref="/img/logo/like.svg"></use>
                </svg>
                <span className={styles.track__timeText}>
                  {formatTime(track.duration_in_seconds)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
