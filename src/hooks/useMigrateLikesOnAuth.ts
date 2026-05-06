import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@store/store';
import { migrateLocalLikesToServer } from '@store/features/likeMigrationThunk';

export const useMigrateLikesOnAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.access);

  const hasMigratedRef = useRef(false);

  useEffect(() => {
    if (hasMigratedRef.current || !token) return;

    const localIdsStr = localStorage.getItem('localFavoriteTrackIds');
    if (!localIdsStr) {
      hasMigratedRef.current = true;
      return;
    }

    let localIds: number[] = [];
    try {
      localIds = JSON.parse(localIdsStr);
    } catch (e) {
      localStorage.removeItem('localFavoriteTrackIds');
      hasMigratedRef.current = true;
      return;
    }

    if (!Array.isArray(localIds) || localIds.length === 0) {
      hasMigratedRef.current = true;
      return;
    }

    hasMigratedRef.current = true;

    dispatch(migrateLocalLikesToServer({ token, trackIds: localIds })).finally(
      () => {},
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
};
