'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/store';

export const usePersistFavorites = () => {
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);

  useEffect(() => {
    const stored = localStorage.getItem('favoriteTracks');

    if (favoriteTracks.length === 0) {
      if (stored && stored !== '[]') {
        return;
      }
    }

    localStorage.setItem('favoriteTracks', JSON.stringify(favoriteTracks));
  }, [favoriteTracks]);
};
