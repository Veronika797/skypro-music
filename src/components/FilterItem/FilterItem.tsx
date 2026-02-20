'use client';
import { useState } from 'react';
import styles from '@filterItem/FilterItem.module.css';
import { data } from '@/data';

interface FilterItemProps {
  onFilterChange: (type: string, value: string) => void;
}

export default function FilterItem({ onFilterChange }: FilterItemProps) {
  const [filterType, setFilterType] = useState<
    'author' | 'year' | 'genre' | null
  >(null);

  const authors = Array.from(
    new Set(
      data.map((track) => track.author).filter((author) => author !== '-'),
    ),
  ).sort();

  const handleButtonClick = (type: 'author' | 'year' | 'genre') => {
    if (filterType === type) {
      setFilterType(null);
    } else {
      setFilterType(type);
    }
  };

  const handleOptionClick = (value: string) => {
    if (filterType) {
      onFilterChange(filterType, value);
    }
    setFilterType(null);
  };

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>

      <button
        className={`${styles.filter__button} ${filterType === 'author' ? styles['filter__button--active'] : ''}`}
        onClick={() => handleButtonClick('author')}
      >
        исполнителю
      </button>
      <button
        className={`${styles.filter__button} ${filterType === 'year' ? styles['filter__button--active'] : ''}`}
        onClick={() => handleButtonClick('year')}
      >
        году выпуска
      </button>
      <button
        className={`${styles.filter__button} ${filterType === 'genre' ? styles['filter__button--active'] : ''}`}
        onClick={() => handleButtonClick('genre')}
      >
        жанру
      </button>

      {filterType && (
        <div
          className={`${styles.filter__dropdown} ${
            filterType === 'author'
              ? styles['filter__dropdown--author']
              : filterType === 'year'
                ? styles['filter__dropdown--year']
                : styles['filter__dropdown--genre']
          }`}
        >
          {filterType === 'author' &&
            authors.map((author) => (
              <div
                key={author}
                className={styles.filter__option}
                onClick={() => handleOptionClick(author)}
              >
                {author}
              </div>
            ))}

          {filterType === 'year' && (
            <>
              <div
                className={styles.filter__option}
                onClick={() => handleOptionClick('desc')}
              >
                Сначала новые
              </div>
              <div
                className={styles.filter__option}
                onClick={() => handleOptionClick('asc')}
              >
                Сначала старые
              </div>
              <div
                className={styles.filter__option}
                onClick={() => handleOptionClick('default')}
              >
                По умолчанию
              </div>
            </>
          )}

          {filterType === 'genre' && (
            <div
              className={styles.filter__option}
              onClick={() => handleOptionClick('Классическая музыка')}
            >
              Классическая музыка
            </div>
          )}
        </div>
      )}
    </div>
  );
}
