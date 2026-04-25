'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/store';

export const usePersistFavorites = () => {
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);

  useEffect(() => {
    const currentStored = localStorage.getItem('favoriteTracks');

    localStorage.setItem('favoriteTracks', JSON.stringify(favoriteTracks));

    const saved = localStorage.getItem('favoriteTracks');
  }, [favoriteTracks]);
};
