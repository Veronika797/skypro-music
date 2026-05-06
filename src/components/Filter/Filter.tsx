'use client';

import { getUniqueValuesByKey } from '@utils/helper';
import styles from './Filter.module.css';
import classNames from 'classnames';
import { useMemo, useRef, useState } from 'react';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import FilterItem from '@components/FilterItem/FilterItem';

type FilterType = 'author' | 'year' | 'genre';

interface FilterProps {
  tracks: TypesTrack[];
  currentFilter: {
    author: string[];
    year: string | null;
    genre: string | null;
  };
  onFilterChange: (type: FilterType, value: string | string[] | null) => void;
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
  const genres = useMemo(
    () => getUniqueValuesByKey(tracks, 'genre').sort(),
    [tracks],
  );

  const yearOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'default', label: 'По умолчанию' },
  ];

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

    if (activeDropdown === 'year') {
      return yearOptions.map((opt) => {
        const isActive = currentFilter.year === opt.value;
        return (
          <FilterItem
            key={opt.value}
            text={opt.label}
            isActive={isActive}
            onClick={() => onFilterChange('year', isActive ? null : opt.value)}
          />
        );
      });
    }

    if (activeDropdown === 'author') {
      return authors.map((item) => {
        const isSelected = currentFilter.author.includes(item);
        return (
          <FilterItem
            key={item}
            text={item}
            isActive={isSelected}
            onClick={() => {
              const newAuthors = isSelected
                ? currentFilter.author.filter((a) => a !== item)
                : [...currentFilter.author, item];
              onFilterChange('author', newAuthors);
            }}
          />
        );
      });
    }

    if (activeDropdown === 'genre') {
      return genres.map((item) => {
        const isActive = currentFilter.genre === item;
        return (
          <FilterItem
            key={item}
            text={item}
            isActive={isActive}
            onClick={() => onFilterChange('genre', isActive ? null : item)}
          />
        );
      });
    }

    return null;
  };

  const getYearButtonLabel = () => {
    if (currentFilter.year === 'newest') return 'Сначала новые';
    if (currentFilter.year === 'oldest') return 'Сначала старые';
    return 'году выпуска';
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter__title}>Искать по:</div>

      <div
        ref={authorRef}
        className={classNames(styles.filter__button, {
          [styles.active]: currentFilter.author.length > 0,
        })}
        onClick={() => handleCategoryClick('author')}
      >
        исполнителю
      </div>

      <div
        ref={yearRef}
        className={classNames(styles.filter__button, {
          [styles.active]:
            currentFilter.year !== null && currentFilter.year !== 'default',
        })}
        onClick={() => handleCategoryClick('year')}
      >
        {getYearButtonLabel()}
      </div>

      <div
        ref={genreRef}
        className={classNames(styles.filter__button, {
          [styles.active]: currentFilter.genre !== null,
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
          <div className={styles.filter__list} data-testid="filter-list">
            {getFilterItems()}
          </div>
        </div>
      )}
    </div>
  );
}
