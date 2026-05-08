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

  const [searchQuery, setSearchQuery] = useState('');

  const [currentFilter, setCurrentFilter] = useState({
    author: [] as string[],
    genre: null as string | null,
    year: null as string | null,
  });

  useEffect(() => {
    setSearchQuery('');
    setCurrentFilter({ author: [], genre: null, year: null });
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

  const onFilterChange = (
    type: FilterType,
    value: string | string[] | null,
  ) => {
    setCurrentFilter(
      (prev) =>
        ({
          ...prev,
          [type]: value,
        }) as typeof prev,
    );
  };

  const getTimestamp = (dateStr?: string) => {
    if (!dateStr) return 0;
    const time = new Date(dateStr).getTime();
    return isNaN(time) ? 0 : time;
  };

  const processedTracks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = tracks.filter((track) => {
      const matchesSearch =
        !query ||
        track.name.toLowerCase().includes(query) ||
        track.author.toLowerCase().includes(query) ||
        (Array.isArray(track.genre) &&
          track.genre.some((g) => g.toLowerCase().includes(query)));

      if (!matchesSearch) return false;

      if (currentFilter.author.length > 0) {
        if (!currentFilter.author.includes(track.author)) return false;
      }

      if (currentFilter.genre) {
        const hasGenre = Array.isArray(track.genre)
          ? track.genre.includes(currentFilter.genre)
          : track.genre === currentFilter.genre;
        if (!hasGenre) return false;
      }

      return true;
    });

    const result = [...filtered];
    if (currentFilter.year === 'newest') {
      result.sort(
        (a, b) => getTimestamp(b.release_date) - getTimestamp(a.release_date),
      );
    } else if (currentFilter.year === 'oldest') {
      result.sort(
        (a, b) => getTimestamp(a.release_date) - getTimestamp(b.release_date),
      );
    }

    return result;
  }, [
    tracks,
    searchQuery,
    currentFilter.author,
    currentFilter.genre,
    currentFilter.year,
  ]);

  if (error) {
    return <div className={styles.centerblock__error}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.centerblock}>
      <Search value={searchQuery} onChange={setSearchQuery} />
      <h2 className={styles.centerblock__h2}>{title}</h2>

      <Filter
        tracks={tracks}
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />

      <div className={styles.centerblock__content}>
        {processedTracks.length === 0 && !isLoading ? (
          <div className={styles.centerblock__empty}>Нет подходящих треков</div>
        ) : (
          <Track tracks={processedTracks} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
