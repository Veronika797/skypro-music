'use client';
import classNames from 'classnames';
import styles from '@bar/bar.module.css';
import Link from 'next/link';
import { useState } from 'react';

export default function Bar() {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.bar}>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/logo/prev.svg"></use>
                </svg>
              </div>
              <div className={classNames(styles.player__btnPlay, styles.btn)}>
                <svg className={styles.player__btnPlaySvg}>
                  <use xlinkHref="/img/logo/play.svg"></use>
                </svg>
              </div>
              <div className={styles.player__btnNext}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/logo/next.svg"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnRepeat, styles.btnIcon)}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/logo/repeat.svg"></use>
                </svg>
              </div>
              <div
                className={classNames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/logo/shuffle.svg"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/logo/note.svg"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={'trackPlay__authorLink'} href="">
                    Ты та...
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    Баста
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classNames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                  onClick={toggleLike}
                  role="button"
                  tabIndex={0}
                  aria-label={isLiked ? 'Dislike' : 'Like'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleLike();
                  }}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use
                      xlinkHref={
                        isLiked ? '/img/logo/dislike.svg' : '/img/logo/like.svg'
                      }
                    ></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/logo/volume.svg"></use>
                </svg>
              </div>
              <div className={classNames(styles.volume__progress, styles.btn)}>
                <input
                  className={classNames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
