import axios from 'axios';
import { BASE_URL } from '../constants';
import { PlayListType, TypesTrack } from '../../SharedTypes/SharedTypes';

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
      throw error;
    });
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
