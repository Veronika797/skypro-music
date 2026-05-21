'use client';

import styles from './sidebar.module.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function SidebarSkeleton() {
  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <Skeleton width={80} height={24} baseColor="rgba(49, 49, 49, 1)" />
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          {[...Array(3)].map((_, index) => (
            <div key={index} className={styles.sidebar__item}>
              <Skeleton height={150} width={250} baseColor="rgba(49, 49, 49, 1)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}