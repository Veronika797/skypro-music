'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@sidebar/sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();

  const handlePlaylistClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    router.push(`/music/category/${id}`);
  };

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
        <div className={styles.sidebar__icon}>
          <svg width="20" height="20">
            <use xlinkHref="/img/logo/logout.svg"></use>
          </svg>
        </div>
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          {[
            { _id: '2', src: '/img/playlist01.png', alt: 'playlist 1' },
            { _id: '3', src: '/img/playlist02.png', alt: 'playlist 2' },
            { _id: '4', src: '/img/playlist03.png', alt: 'playlist 3' },
          ].map((playlist) => (
            <div key={playlist._id} className={styles.sidebar__item}>
              <a
                className={styles.sidebar__link}
                href={`/music/category/${playlist._id}`}
                onClick={(e) => handlePlaylistClick(e, playlist._id)}
              >
                <Image
                  className={styles.sidebar__img}
                  src={playlist.src}
                  alt={playlist.alt}
                  width={250}
                  height={170}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
