'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@navigation/navigation.module.css';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className={`${styles.main__nav} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.nav__header}>
        <div className={styles.nav__logo}>
          <Image
            width={250}
            height={170}
            className={styles.logo__image}
            src="/img/logo.png"
            alt={'logo'}
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
            <Link href="#" className={styles.menu__link} onClick={toggleMenu}>
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="#" className={styles.menu__link} onClick={toggleMenu}>
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link
              href="../signin.html"
              className={styles.menu__link}
              onClick={toggleMenu}
            >
              Войти
            </Link>
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
