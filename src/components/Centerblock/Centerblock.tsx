'use client';
import styles from './centerblock.module.css';
import Search from '@components/Search/Search';
import Track from '@components/Track/Track';
import Filter from '@components/Filter/Filter';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useState, useMemo, useEffect } from 'react';
import { fetchTracks } from '@services/tracks/tracksService';

type FilterType = 'author' | 'year' | 'genre';

interface CenterblockProps {
  tracks?: TypesTrack[];
  loading?: boolean;
  error?: string | null;
  title?: string;
}

export default function Centerblock({
  tracks: externalTracks,
  loading: externalLoading,
  error: externalError,
  title = 'Треки',
}: CenterblockProps) {
  const [localTracks, setLocalTracks] = useState<TypesTrack[]>([]);
  const [localLoading, setLocalLoading] = useState(!externalTracks);
  const [localError, setLocalError] = useState<string | null>(null);

  const [currentFilter, setCurrentFilter] = useState({
    author: null as string | null,
    genre: null as string | null,
    year: null as string | null,
  });

  useEffect(() => {
    setCurrentFilter({ author: null, genre: null, year: null });
  }, [externalTracks]);

  useEffect(() => {
    if (externalTracks) return;

    let isMounted = true;
    const loadTracks = async () => {
      try {
        setLocalLoading(true);
        const data = await fetchTracks();
        if (isMounted) {
          setLocalTracks(data);
          setLocalError(null);
        }
      } catch (err) {
        if (isMounted)
          setLocalError(
            err instanceof Error ? err.message : 'Неизвестная ошибка',
          );
      } finally {
        if (isMounted) setLocalLoading(false);
      }
    };

    loadTracks();
    return () => {
      isMounted = false;
    };
  }, [externalTracks]);

  const isLoading = externalLoading ?? localLoading;
  const error = externalError ?? localError;

  const tracks = useMemo(() => {
    const data = externalTracks ?? localTracks;
    return Array.isArray(data) ? data : [];
  }, [externalTracks, localTracks]);

  const onFilterChange = (type: FilterType, value: string) => {
    setCurrentFilter((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      if (currentFilter.author && track.author !== currentFilter.author)
        return false;
      if (currentFilter.genre && !track.genre?.includes(currentFilter.genre))
        return false;
      if (currentFilter.year) {
        const trackYear = new Date(track.release_date).getFullYear().toString();
        if (trackYear !== currentFilter.year) return false;
      }
      return true;
    });
  }, [tracks, currentFilter]);

  const tracksToShow = filteredTracks;

  if (error) {
    return <div className={styles.centerblock__error}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <Filter
        tracks={tracks}
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />
      <div className={styles.centerblock__content}>
        <Track tracks={tracksToShow} isLoading={isLoading} />
      </div>
    </div>
  );
}
