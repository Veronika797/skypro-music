'use client';

import styles from '@filterItem/FilterItem.module.css';

interface FilterItemProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterItem({ text, isActive, onClick }: FilterItemProps) {
  return (
    <div
      className={`${styles.filter__option} ${isActive ? styles['filter__option--active'] : ''}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}