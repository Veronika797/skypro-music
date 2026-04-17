export interface TrackType {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration: number;
  album: string;
  logo: null | string;
  track_file: string;
  stared_user: string[];
}

export type PlayListType = {
  items: number[];
  name: string;
  _id: number;
};
