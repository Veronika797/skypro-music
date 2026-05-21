import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useAppDispatch, useAppSelector } from '@store/store';
import { useState } from 'react';
import { addLikedTracks, removeLikedTracks } from '@store/features/trackSlice';
import { addLike, removeLike } from '@services/tracks/trackApi';
import { AxiosError } from 'axios';

export const useLikeTrack = () => {
  const { access } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = async (track: TypesTrack, isLiked: boolean) => {
    if (!access) {
      setErrorMsg('Войдите в аккаунт, чтобы ставить лайки');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    if (!track) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isLiked) {
        await removeLike(access, track._id);
        dispatch(removeLikedTracks(track));
      } else {
        await addLike(access, track._id);
        dispatch(addLikedTracks(track));
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setErrorMsg('Сессия истекла. Пожалуйста, войдите снова.');
        } else {
          const msg =
            error.response?.data?.message ||
            error.response?.data?.detail ||
            'Не удалось обновить лайк';
          setErrorMsg(msg);
        }
      } else {
        setErrorMsg('Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMsg, toggleLike };
};
