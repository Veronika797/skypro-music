'use client';

import { getUniqueValuesByKey, getUniqueYears } from '@utils/helper';
import styles from './Filter.module.css';
import classNames from 'classnames';
import { useMemo, useRef, useState } from 'react';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import FilterItem from '@components/FilterItem/FilterItem';

type FilterType = 'author' | 'year' | 'genre';

interface FilterProps {
  tracks: TypesTrack[];
  currentFilter: {
    author: string | null;
    genre: string | null;
    year: string | null;
  };
  onFilterChange: (type: FilterType, value: string) => void;
}

export default function Filter({
  tracks,
  currentFilter,
  onFilterChange,
}: FilterProps) {
  const [activeDropdown, setActiveDropdown] = useState<FilterType | null>(null);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const authorRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  const authors = useMemo(
    () => getUniqueValuesByKey(tracks, 'author').sort(),
    [tracks],
  );
  const years = useMemo(() => getUniqueYears(tracks), [tracks]);
  const genres = useMemo(
    () => getUniqueValuesByKey(tracks, 'genre').sort(),
    [tracks],
  );

  const handleCategoryClick = (filterName: FilterType) => {
    let left = 0;
    const container = authorRef.current?.parentElement;
    const containerRect = container?.getBoundingClientRect();
    const ref =
      filterName === 'author'
        ? authorRef
        : filterName === 'year'
          ? yearRef
          : genreRef;

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      left = containerRect ? rect.left - containerRect.left : rect.left;
    }

    setActiveDropdown((prev) => {
      const newActive = prev === filterName ? null : filterName;
      if (newActive) setDropdownLeft(left);
      return newActive;
    });
  };

  const getFilterItems = () => {
    if (!activeDropdown) return null;

    const items =
      activeDropdown === 'author'
        ? authors
        : activeDropdown === 'year'
          ? years
          : genres;

    return items.map((item) => {
      const itemStr = String(item);
      const isActive = currentFilter[activeDropdown] === itemStr;

      return (
        <FilterItem
          key={itemStr}
          text={itemStr}
          isActive={isActive}
          onClick={() => onFilterChange(activeDropdown, itemStr)}
        />
      );
    });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter__title}>Искать по:</div>
      <div
        ref={authorRef}
        className={classNames(styles.filter__button, {
          [styles.active]: activeDropdown === 'author',
        })}
        onClick={() => handleCategoryClick('author')}
      >
        исполнителю
      </div>
      <div
        ref={yearRef}
        className={classNames(styles.filter__button, {
          [styles.active]: activeDropdown === 'year',
        })}
        onClick={() => handleCategoryClick('year')}
      >
        году выпуска
      </div>
      <div
        ref={genreRef}
        className={classNames(styles.filter__button, {
          [styles.active]: activeDropdown === 'genre',
        })}
        onClick={() => handleCategoryClick('genre')}
      >
        жанру
      </div>

      {activeDropdown && (
        <div
          key={activeDropdown}
          className={styles.filter__dropdown}
          style={{ left: `${dropdownLeft}px` }}
        >
          <div className={styles.filter__list}>{getFilterItems()}</div>
        </div>
      )}
    </div>
  );
}
