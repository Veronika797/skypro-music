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
        console.error('API вернул пустые данные');
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
        console.log('Данные уже являются массивом:', res.data);
        return res.data;
      }

      if (
        typeof res.data === 'object' &&
        res.data !== null &&
        'data' in res.data
      ) {
        const dataObj = res.data as { data: TypesTrack[] };
        if (Array.isArray(dataObj.data)) {
          console.log('Извлечение треков из поля data:', dataObj.data);
          return dataObj.data;
        }
      }

      console.warn('Неожиданная структура данных:', res.data);
      return [];
    })
    .catch((error) => {
      console.error('API ошибка при загрузке треков:', error);
      if (error.response) {
        console.error('Статус ответа:', error.response.status);
        console.error('Данные ответа:', error.response.data);
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
      console.log('API /catalog/selection/${id}/ response:', res);
      return res.data;
    })
    .catch((error) => {
      console.error('API error:', error);
      throw error;
    });
};
