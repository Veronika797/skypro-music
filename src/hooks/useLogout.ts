'use client';

import { useAppDispatch } from '@/store/store';
import { clearUser } from '@/store/features/authSlice';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = () => {
    dispatch(clearUser());
    router.replace('/auth/signin');

    router.refresh();
  };

  return logout;
};
