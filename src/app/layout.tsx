'use client';

import { Montserrat } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/store/ReduxProvider';
import { useInitAuth } from '@/hooks/useInitAuth';
import { usePersistFavorites } from '@/hooks/usePersistFavorites'; // 👈 Импорт

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

function AppInitWrapper({ children }: { children: React.ReactNode }) {
  useInitAuth();
  usePersistFavorites();

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable}`}>
        <ReduxProvider>
          <AppInitWrapper>{children}</AppInitWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
