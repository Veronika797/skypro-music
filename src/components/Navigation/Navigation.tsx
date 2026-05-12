'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './navigation.module.css';
import { useState } from 'react';
import { useLogout } from '@hooks/useLogout';
import { useAppSelector } from '@store/store';
import { useTheme } from '@store/ThemeProvider';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();
  const { access } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!access;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const logoSrc = theme === 'light' ? '/img/logo_modal.png' : '/img/logo.png';
  const themeToggleLabel = `Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`;
  const themeToggleIcon =
    theme === 'light' ? '/img/logo/switch2.svg' : '/img/logo/switch.svg';

  return (
    <nav className={`${styles.main__nav} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.nav__header}>
        <div className={styles.nav__logo}>
          <Image
            width={250}
            height={170}
            className={styles.logo__image}
            src={logoSrc}
            alt="logo"
            priority
          />
        </div>
        <div
          className={`${styles.nav__burger} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          aria-label="Меню"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleMenu();
          }}
        >
          <span className={styles.burger__line}></span>
          <span className={styles.burger__line}></span>
          <span className={styles.burger__line}></span>
        </div>
      </div>
      <div className={`${styles.nav__menu} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link
              href="/music/main"
              className={styles.menu__link}
              onClick={toggleMenu}
            >
              Главное
            </Link>
          </li>

          {isAuthenticated && (
            <li className={styles.menu__item}>
              <Link
                href="/music/my-playlist"
                className={styles.menu__link}
                onClick={toggleMenu}
              >
                Мой плейлист
              </Link>
            </li>
          )}

          {isAuthenticated ? (
            <li className={styles.menu__item}>
              <button
                type="button"
                className={styles.menu__link}
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--exit)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '16px',
                  fontWeight: 400,
                }}
              >
                Выйти
              </button>
            </li>
          ) : (
            <li className={styles.menu__item}>
              <Link
                href="/auth/signin"
                className={styles.menu__link}
                onClick={toggleMenu}
              >
                Войти
              </Link>
            </li>
          )}
          <li className={styles.menu__item}>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={themeToggleLabel}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <Image width={39} height={39} src={themeToggleIcon} alt="" />
            </button>
          </li>
        </ul>
      </div>

      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={toggleMenu}
          role="button"
          tabIndex={-1}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  );
}
