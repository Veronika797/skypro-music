import { Montserrat } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@store/ReduxProvider';
import { ThemeProvider } from '@store/ThemeProvider';
import InitProvider from '@/app/InitProvider';
import { ToastProvider } from '@components/ToastProvider';
import { cookies } from 'next/headers';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const themeScript = `
  (function () {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;
  const serverTheme = themeCookie || 'light';

  return (
    <html
      lang="ru"
      className={serverTheme === 'dark' ? 'dark' : ''}
      suppressHydrationWarning
    >
      <body className={`${montserrat.variable}`}>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          suppressHydrationWarning
        />
        <ReduxProvider>
          <ThemeProvider initialTheme={serverTheme as 'light' | 'dark'}>
            <InitProvider>
              {children}
              <ToastProvider />
            </InitProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
