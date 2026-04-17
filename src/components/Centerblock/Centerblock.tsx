'use client';
import styles from '@centerblock/centerblock.module.css';
import Search from '@search/Search';
import Track from '@track/Track';
import Filter from '@filter/Filter';
import { data } from '@/data';
import { useAppSelector } from '@/store/store';
import { TrackType } from '@/SharedTypes/SharedTypes';

export default function Centerblock() {
  const playlistInStore = useAppSelector((state) => state.tracks.playlist);

  const tracksToShow: TrackType[] =
    playlistInStore.length > 0 ? playlistInStore : data;

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <Filter tracks={data} />
      <div className={styles.centerblock__content}>
        <Track tracks={tracksToShow} />
      </div>
    </div>
  );
}
