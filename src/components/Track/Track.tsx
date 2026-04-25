'use client';

import styles from './Track.module.css';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setCurrentTrack,
  setIsPlay,
  setPlaylist,
} from '@/store/features/trackSlice';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { TrackItem } from './TrackItem';

interface TrackProps {
  tracks: TypesTrack[];
  isLoading?: boolean;
}

export default function Track({ tracks, isLoading = false }: TrackProps) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const playlistInStore = useAppSelector((state) => state.tracks.playlist);

  const prevTracksRef = useRef<TypesTrack[]>([]);

  useEffect(() => {
    if (prevTracksRef.current === tracks) return;
    prevTracksRef.current = tracks;

    const hasChanged =
      tracks.length !== playlistInStore.length ||
      tracks.some((track, index) => track._id !== playlistInStore[index]?._id);

    if (hasChanged) {
      dispatch(setPlaylist(tracks));
    }
  }, [tracks, dispatch, playlistInStore]);

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
      <div
        className={classNames(styles.playlist__item, styles.playlist__header)}
      >
        <div className={styles.playlist__track}>
          <div className={styles.track__title}>
            <span className={styles.track__titleText}>ТРЕК</span>
          </div>
          <div className={styles.track__author}>
            <span className={styles.track__authorText}>ИСПОЛНИТЕЛЬ</span>
          </div>
          <div className={styles.track__album}>
            <span className={styles.track__albumText}>АЛЬБОМ</span>
          </div>
          <div className={styles.track__content}>
            <svg className={styles.track__timeSvg}>
              <use xlinkHref="/img/logo/watch.svg"></use>
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'start', color: '#b3b3b3' }}>
          Загрузка треков...
        </div>
      ) : (
        tracks.map((track) => (
          <TrackItem
            key={track._id}
            track={track}
            isActive={currentTrack?._id === track._id}
            isPlaying={isPlaying}
            onClick={() => handleTrackClick(track)}
          />
        ))
      )}
    </div>
  );
}
