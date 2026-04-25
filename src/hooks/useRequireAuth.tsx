'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/store';

export const useRequireAuth = (redirectUrl = '/auth/signin') => {
  const { access } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!access) {
      router.push(redirectUrl);
    }
  }, [access, router, redirectUrl]);

  return { isAuthenticated: !!access };
};
