'use client';

import { useLikeTrack } from '@hooks/useLikeTracks';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import classNames from 'classnames';
import styles from './Track.module.css';
import { formatTime } from '@utils/helper';
import { useAppSelector } from '@store/store';

interface TrackItemProps {
  track: TypesTrack;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

export function TrackItem({
  track,
  isActive,
  isPlaying,
  onClick,
}: TrackItemProps) {
  const { access } = useAppSelector((state) => state.auth);
  const { isLike, toggleLike, isLoading: isLiking } = useLikeTrack(track);
  const isActiveAndPlaying = isActive && isPlaying;

  return (
    <div
      className={classNames(styles.playlist__item, isActive && styles.active)}
      onClick={onClick}
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
            onClick={(e) => {
              e.stopPropagation();
              if (!access || access === '') return;
              toggleLike();
            }}
            disabled={!access || isLiking}
            style={{
              cursor: !access ? 'not-allowed' : 'pointer',
              opacity: !access ? 0.4 : 1,
              pointerEvents: !access ? 'none' : 'auto',
            }}
            title={
              !access
                ? 'Войдите в аккаунт, чтобы ставить лайки'
                : isLike
                  ? 'Убрать из избранного'
                  : 'Добавить в избранное'
            }
          >
            {isLiking ? (
              <span className={styles.likeSpinner} />
            ) : (
              <svg
                className={`${styles.track__likeSvg} ${isLike ? styles.liked : ''}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>

          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
