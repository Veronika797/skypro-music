'use client';
import styles from '@centerblock/centerblock.module.css';
import Search from '@search/Search';
import Filter from '@filter/Filter';
import Track from '@track/Track';
import FilterItem from '@filterItem/FilterItem';
import { data } from '@/data';
import { useState } from 'react';

export default function Centerblock() {
  const [filter, setFilter] = useState<{
    author: string | null;
    genre: string | null;
    year: 'asc' | 'desc' | 'default' | null;
  }>({
    author: null,
    genre: null,
    year: 'default',
  });

  const filteredTracks = data
    .filter((track) => {
      if (filter.author && track.author !== filter.author) return false;
      if (filter.genre && !track.genre.includes(filter.genre)) return false;
      return true;
    })
    .sort((a, b) => {
      if (filter.year === 'desc') {
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      }
      if (filter.year === 'asc') {
        return (
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime()
        );
      }
      return 0;
    });

  const handleFilterChange = (type: string, value: string) => {
    setFilter((prev) => {
      if (type === 'author' && prev.author === value) {
        return { ...prev, author: null };
      }
      if (type === 'genre' && prev.genre === value) {
        return { ...prev, genre: null };
      }
      if (type === 'year' && prev.year === value) {
        return { ...prev, year: 'default' };
      }
      return {
        author: type === 'author' ? value : prev.author,
        genre: type === 'genre' ? value : prev.genre,
        year:
          type === 'year' ? (value as 'asc' | 'desc' | 'default') : prev.year,
      };
    });
  };

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <FilterItem onFilterChange={handleFilterChange} />
      <div className={styles.centerblock__content}>
        <Filter />
        <Track tracks={filteredTracks} />
      </div>
    </div>
  );
}
