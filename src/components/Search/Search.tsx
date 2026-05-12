'use client';
import { useTheme } from '@store/ThemeProvider';
import styles from './Search.module.css';

interface SearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function Search({ value, onChange }: SearchProps) {
  const { theme } = useTheme();

  const searchIcon =
    theme === 'light' ? '/img/logo/search2.svg' : '/img/logo/search.svg';

  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref={searchIcon}></use>
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
