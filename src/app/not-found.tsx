'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div
      style={{
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          color: '#fff',
          fontFamily: 'Montserrat',
          fontWeight: 600,
          fontSize: '160px',
          lineHeight: '168px',
          letterSpacing: '0px',
          fontVariantNumeric: 'lining-nums proportional-nums',
        }}
      >
        404
      </div>

      <div
        style={{
          color: '#fff',
          fontFamily: 'Montserrat',
          fontWeight: 400,
          fontStyle: 'Regular',
          fontSize: '32px',
          lineHeight: '40px',
          letterSpacing: '0%',
          fontVariantNumeric: 'lining-nums proportional-nums',
          marginTop: '16px',
          textAlign: 'center',
        }}
      >
        Страница не найдена
      </div>

      <Link
        href="/music/main"
        style={{
          width: '278px',
          height: '52px',
          marginTop: '32px',
          backgroundColor: 'rgba(88, 14, 162, 1)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Montserrat',
          fontWeight: 500,
          fontSize: '20px',
        }}
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
