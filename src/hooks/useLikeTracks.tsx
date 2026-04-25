import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { AxiosError } from 'axios';
import { useState } from 'react';

import { withReauth } from '@/Utils/withReAuth';
import { addLikedTracks, removeLikedTracks } from '@/store/features/trackSlice';
import { addLike, removeLike } from '@/services/tracks/trackApi';

type returnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

export const useLikeTrack = (track: TypesTrack | null): returnTypeHook => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isLike = favoriteTracks.some(
    (t) => String(t._id) === String(track?._id),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = () => {
    if (!access) {
      setErrorMsg('Нет авторизации');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    const actionApi = isLike ? removeLike : addLike;
    const actionSlice = isLike ? removeLikedTracks : addLikedTracks;

    setIsLoading(true);
    setErrorMsg(null);

    if (track) {
      dispatch(actionSlice(track));

      withReauth(
        (newToken) => actionApi(newToken || access, String(track._id)),
        refresh,
        dispatch,
      )
        .catch((error) => {
          const rollbackAction = isLike ? addLikedTracks : removeLikedTracks;
          dispatch(rollbackAction(track));

          if (error instanceof AxiosError) {
            if (error.response) {
              setErrorMsg(error.response.data?.message || 'Ошибка сервера');
            } else if (error.request) {
              setErrorMsg('Нет соединения с сервером');
            } else {
              setErrorMsg('Неизвестная ошибка');
            }
            setTimeout(() => setErrorMsg(null), 4000);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return { isLoading, errorMsg, toggleLike, isLike };
};
