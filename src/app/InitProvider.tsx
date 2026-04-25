'use client';

import { useInitAuth } from '../hooks/useInitAuth';
import { usePersistFavorites } from '../hooks/usePersistFavorites';

export default function InitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitAuth();
  usePersistFavorites();
  return <>{children}</>;
}
