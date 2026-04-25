'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/store';

export const usePersistFavorites = () => {
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);

  useEffect(() => {
    if (favoriteTracks.length >= 0) {
      localStorage.setItem('favoriteTracks', JSON.stringify(favoriteTracks));
    }
  }, [favoriteTracks]);
};
