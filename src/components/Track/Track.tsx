'use client';

import { formatTime } from '@/Utils/helper';
import Link from 'next/link';
import styles from '@track/Track.module.css';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

interface TrackProps {
  tracks: TypesTrack[];
}

export default function Track({ tracks }: TrackProps) {
  return (
    <div className={styles.content__playlist}>
      {tracks.map((track) => (
        <div key={track._id} className={styles.playlist__item}>
          <div className={styles.playlist__track}>
            <div className={styles.track__title}>
              <div className={styles.track__titleImage}>
                <svg className={styles.track__titleSvg}>
                  <use xlinkHref="/img/logo/note.svg"></use>
                </svg>
              </div>
              <div>
                <Link className={styles.track__titleLink} href="">
                  {track.name} <span className={styles.track__titleSpan}></span>
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
      ))}
    </div>
  );
}
