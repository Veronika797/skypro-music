import { Montserrat } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@store/ReduxProvider';
import InitProvider from '@/app/InitProvider';
import { ToastProvider } from '@components/ToastProvider';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable}`}>
        <ReduxProvider>
          <InitProvider>
            {children}
            <ToastProvider />
          </InitProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
