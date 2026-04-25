import axios from 'axios';
import { BASE_URL } from '../constants';

export const addLike = (token: string, trackId: string) => {
  return axios.post(
    `${BASE_URL}/catalog/track/${trackId}/like/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeLike = (token: string, trackId: string) => {
  return axios.delete(`${BASE_URL}/catalog/track/${trackId}/like/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};