'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@store/store';
import Centerblock from '@components/Centerblock/Centerblock';
import { fetchFavoriteTracks } from '@services/tracks/trackApi';
import { setFavoriteTracks } from '@store/features/trackSlice';
import { AxiosError } from 'axios';

export default function MyPlaylistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { access } = useAppSelector((state) => state.auth);
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!access) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFavoriteTracks(access);
      const tracks = Array.isArray(data)
        ? data
        : data?.data && Array.isArray(data.data)
          ? data.data
          : [];
      dispatch(setFavoriteTracks(tracks));
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите заново.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [access, dispatch]);

  useEffect(() => {
    if (!access) {
      router.replace('/auth/signin');
      return;
    }

    if (favoriteTracks.length === 0) {
      loadFavorites();
    } else {
      setIsLoading(false);
    }
  }, [access, favoriteTracks.length, loadFavorites, router]);

  if (error) {
    return (
      <div style={{ padding: '40px', color: '#ff4d4d' }}>
        <p>{error}</p>
        <button
          onClick={() => router.replace('/auth/signin')}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#580ea2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Войти снова
        </button>
      </div>
    );
  }

  return (
    <Centerblock
      tracks={favoriteTracks}
      loading={isLoading}
      title="Мой плейлист"
    />
  );
}
