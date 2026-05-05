'use client';

import { useInitAuth } from '@hooks/useInitAuth';
import { useMigrateLikesOnAuth } from '@hooks/useMigrateLikesOnAuth';

export default function InitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitAuth();
  useMigrateLikesOnAuth();
  return <>{children}</>;
}
