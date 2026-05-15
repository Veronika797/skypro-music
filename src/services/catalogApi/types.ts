export interface SelectionType {
  _id: string;
  name: string;
  items?: number[];
}

export type PlayListType = {
  items: number[] | string[];
  name: string;
  _id: number;
  logo: null | string;
};
