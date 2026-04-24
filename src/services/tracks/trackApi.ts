import axios from 'axios';
import { BASE_URL } from '../constants';
import { PlayListType, TypesTrack } from '../../SharedTypes/SharedTypes';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getAllTracks = (): Promise<TypesTrack[]> => {
  return axios
    .get<ApiResponse<TypesTrack[]> | TypesTrack[]>(
      BASE_URL + '/catalog/track/all/',
    )
    .then((res) => {
      if (!res.data) {
        return [];
      }

      if (
        typeof res.data === 'object' &&
        res.data !== null &&
        'success' in res.data
      ) {
        const apiResponse = res.data as ApiResponse<TypesTrack[]>;
        if (apiResponse.success && Array.isArray(apiResponse.data)) {
          return apiResponse.data;
        }
      }

      if (Array.isArray(res.data)) {
        return res.data;
      }

      if (
        typeof res.data === 'object' &&
        res.data !== null &&
        'data' in res.data
      ) {
        const dataObj = res.data as { data: TypesTrack[] };
        if (Array.isArray(dataObj.data)) {
          return dataObj.data;
        }
      }

      return [];
    })
    .catch((error) => {
      if (error.response) {
      } else if (error.request) {
        console.error('Нет ответа от сервера:', error.request);
      } else {
        console.error('Ошибка при настройке запроса:', error.message);
      }
      throw error;
    });
};

export const getTracksSelection = (id: string): Promise<PlayListType> => {
  return axios
    .get<PlayListType>(BASE_URL + `/catalog/selection/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};
