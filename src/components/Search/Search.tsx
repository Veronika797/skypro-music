'use client';
import styles from './Search.module.css';

interface SearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function Search({ value, onChange }: SearchProps) {
  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/logo/search.svg"></use>
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
