export interface TypesTrack {
  _id: string | number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration: number;
  duration_in_seconds: number;
  album: string;
  logo: null | string;
  track_file: string;
  stared_user: string[];
}

export type PlayListType = {
  items: number[];
  name: string;
  _id: number;
  logo: null | string;
};
