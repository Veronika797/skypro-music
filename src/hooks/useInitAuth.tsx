'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/store';
import {
  setAccessToken,
  setRefreshToken,
  setUsername,
  clearUser,
} from '@/store/features/authSlice';
import { refreshToken as refreshApi } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { setFavoriteTracks } from '@/store/features/trackSlice';

const scheduleTokenRefresh = (
  refreshTokenValue: string,
  dispatch: ReturnType<typeof useAppDispatch>,
) => {
  const REFRESH_LEEWAY = 30 * 1000;
  const TOKEN_LIFETIME = 200 * 1000;

  setTimeout(async () => {
    try {
      const newTokens = await refreshApi({ refresh: refreshTokenValue });
      dispatch(setAccessToken(newTokens.access));
      dispatch(setRefreshToken(newTokens.refresh));
      scheduleTokenRefresh(newTokens.refresh, dispatch);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        dispatch(clearUser());
      }
    }
  }, TOKEN_LIFETIME - REFRESH_LEEWAY);
};

export const useInitAuth = () => {
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      const storedAccess = localStorage.getItem('access');
      const storedRefresh = localStorage.getItem('refresh');
      const storedUsername = localStorage.getItem('username');

      if (storedAccess && storedRefresh && storedUsername) {
        dispatch(setAccessToken(storedAccess));
        dispatch(setRefreshToken(storedRefresh));
        dispatch(setUsername(storedUsername));
      }

      if (storedRefresh && !storedAccess) {
        try {
          const newTokens = await refreshApi({ refresh: storedRefresh });
          dispatch(setAccessToken(newTokens.access));
          dispatch(setRefreshToken(newTokens.refresh));
        } catch (error) {
          console.warn('Не удалось обновить токен, выход из системы', error);
          dispatch(clearUser());
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('username');
        }
      }

      if (storedAccess && storedRefresh) {
        scheduleTokenRefresh(storedRefresh, dispatch);
      }

      const storedFavorites = localStorage.getItem('favoriteTracks');
      if (storedFavorites) {
        try {
          const parsed = JSON.parse(storedFavorites);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'tracks/setFavoriteTracks', payload: parsed });
          }
        } catch (e) {
          console.error('Ошибка загрузки лайков:', e);
          localStorage.removeItem('favoriteTracks');
        }
      }
    };

    initAuth();
  }, [dispatch]);

  return { isInitialized: true };
};
