'use client';

import { TypesTrack } from '@/SharedTypes/SharedTypes';
import styles from './Track.module.css';
import { formatTime } from '@utils/helper';
import { useAppSelector } from '@store/store';
import { useLikeTrack } from '@hooks/useLikeTracks';

interface TrackItemPreviewProps {
  track: TypesTrack;
  number: number;
}

export function TrackItemPreview({ track, number }: TrackItemPreviewProps) {
  const { favoriteTrackIds } = useAppSelector((state) => state.tracks);
  const { toggleLike, isLoading } = useLikeTrack();
  const isLiked = favoriteTrackIds.includes(Number(track._id));

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(track, isLiked);
  };

  return (
    <div className={styles.playlist__item}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/logo/note.svg"></use>
            </svg>
          </div>
          <span className={styles.track__titleLink}>{track.name}</span>
        </div>

        <div className={styles.track__author}>
          <span className={styles.track__authorLink}>{track.author}</span>
        </div>

        <div className={styles.track__album}>
          <span className={styles.track__albumLink}>{track.album}</span>
        </div>

        <div className={styles.track__content}>
          <button
            className={styles.track__likeBtn}
            onClick={handleLikeClick}
            disabled={isLoading}
            aria-label={
              isLiked ? 'Убрать из избранного' : 'Добавить в избранное'
            }
            title={isLiked ? 'В избранном' : 'Добавить в избранное'}
          >
            {isLoading ? (
              <span className={styles.likeSpinner} />
            ) : isLiked ? (
              <svg className={`${styles.track__likeSvg} ${styles.liked}`}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className={styles.track__likeSvg}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
