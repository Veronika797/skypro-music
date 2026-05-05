'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@store/store';
import Centerblock from '@components/Centerblock/Centerblock';
import { fetchTracks } from '@services/tracks/tracksService';
import { fetchFavoriteTracks } from '@services/tracks/trackApi';
import { setFavoriteTracks } from '@store/features/trackSlice';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

export default function MusicMainPage() {
  const dispatch = useAppDispatch();
  const { access } = useAppSelector((state) => state.auth);
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);

  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const allTracks = await fetchTracks();
        setTracks(Array.isArray(allTracks) ? allTracks : []);

        if (access && favoriteTracks.length === 0) {
          const favorites = await fetchFavoriteTracks(access);
          const favArray = Array.isArray(favorites)
            ? favorites
            : favorites?.data || [];

          dispatch(setFavoriteTracks(favArray));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [access, favoriteTracks.length, dispatch]);

  return <Centerblock tracks={tracks} loading={loading} title="Треки" />;
}
