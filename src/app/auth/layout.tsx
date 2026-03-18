import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <h1>Layout</h1>
      <Link href={'./signin'}></Link>
      <Link href={'./signup'}></Link>
      {children}
    </>
  );
}
