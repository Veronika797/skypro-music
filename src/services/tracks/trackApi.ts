import axios from 'axios';
import { BASE_URL } from '@services/constants';
import { PlayListType, TypesTrack } from '@/SharedTypes/SharedTypes';
import { toast } from 'react-toastify';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

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
      if (error instanceof Error) {
        toast.error(`Ошибка загрузки подборки: ${error.message}`);
      } else {
        toast.error('Ошибка загрузки подборки: Неизвестная ошибка');
      }
      throw error;
    });
};

export const getTracksSelection = async (id: string): Promise<PlayListType> => {
  return axios
    .get<PlayListType>(BASE_URL + `/catalog/selection/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error instanceof Error) {
        toast.error(`Ошибка загрузки подборки: ${error.message}`);
      } else {
        toast.error('Ошибка загрузки подборки: Неизвестная ошибка');
      }
      throw error;
    });
};

export const fetchFavoriteTracks = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/catalog/track/favorite/all/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data?.data || res.data || [];
};

export const addLike = async (
  token: string,
  trackId: number | string,
): Promise<{ success: boolean }> => {
  const res = await axios.post<ApiResponse<{ message: string }>>(
    `${BASE_URL}/catalog/track/${trackId}/favorite/`,
    {},
    { headers: getAuthHeaders(token) },
  );
  return res.data;
};

export const removeLike = async (
  token: string,
  trackId: number | string,
): Promise<{ success: boolean }> => {
  const res = await axios.delete<ApiResponse<{ message: string }>>(
    `${BASE_URL}/catalog/track/${trackId}/favorite/`,
    { headers: getAuthHeaders(token) },
  );
  return res.data;
};
