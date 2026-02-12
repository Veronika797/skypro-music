'use client';

import { useState } from 'react';
import styles from './Search.module.css';

export default function Search() {
  const [searchInput, setSearchInput] = useState('');

  const onSerchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

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
        value={searchInput}
        onChange={onSerchInput}
      />
    </div>
  );
}
