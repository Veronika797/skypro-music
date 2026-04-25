import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useState } from 'react';
import { addLikedTracks, removeLikedTracks } from '@/store/features/trackSlice';
import { addLike, removeLike } from '@/services/tracks/trackApi';

type returnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

export const useLikeTrack = (track: TypesTrack | null) => {
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
    }
  };

  return { isLoading, errorMsg, toggleLike, isLike };
};
