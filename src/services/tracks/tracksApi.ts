import axios from 'axios';
import { BASE_URL } from '../constants';
import { PlayListType, TrackType } from '../../SharedTypes/SharedTypes';

interface ApiResponse<T> {
  data: T;
}

export const getAllTracks = (): Promise<TrackType[]> => {
  return axios
    .get<ApiResponse<TrackType[]>>(BASE_URL + '/catalog/track/all/')
    .then((res) => res.data.data);
};

export const getTracksSelection = (id: string): Promise<PlayListType> => {
  return axios
    .get<ApiResponse<PlayListType>>(BASE_URL + `/catalog/selection/${id}/`)
    .then((res) => res.data.data);
};
