'use client';

import classNames from 'classnames';
import styles from './Track.module.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function TrackSkeleton() {
  return (
    <div className={styles.content__playlist}>
      <div
        className={classNames(styles.playlist__item, styles.playlist__header)}
      >
        <div className={styles.playlist__track}>
          <div className={styles.track__title}>
            <Skeleton width={140} height={16} baseColor="rgba(49, 49, 49, 1)" />
          </div>
          <div className={styles.track__author}>
            <Skeleton width={110} height={16} baseColor="rgba(49, 49, 49, 1)" />
          </div>
          <div className={styles.track__album}>
            <Skeleton width={110} height={16} baseColor="rgba(49, 49, 49, 1)" />
          </div>
          <div className={styles.track__content}>
            <Skeleton width={50} height={16} baseColor="rgba(49, 49, 49, 1)" />
          </div>
        </div>
      </div>
      {[...Array(10)].map((_, index) => (
        <div key={index} className={styles.playlist__item}>
          <div className={styles.playlist__track}>
            <div className={styles.track__title}>
              <Skeleton
                width={140}
                height={16}
                baseColor="rgba(49, 49, 49, 1)"
              />
            </div>
            <div className={styles.track__author}>
              <Skeleton
                width={110}
                height={16}
                baseColor="rgba(49, 49, 49, 1)"
              />
            </div>
            <div className={styles.track__album}>
              <Skeleton
                width={110}
                height={16}
                baseColor="rgba(49, 49, 49, 1)"
              />
            </div>
            <div className={styles.track__content}>
              <Skeleton
                width={50}
                height={16}
                baseColor="rgba(49, 49, 49, 1)"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
