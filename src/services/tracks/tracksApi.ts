import axios from 'axios';
import { BASE_URL } from '../constants';
import { PlayListType, TypesTrack } from '../../SharedTypes/SharedTypes';

interface ApiResponse<T> {
  data: T;
}

export const getTracksSelection = async (id: string): Promise<PlayListType> => {
  const url = `${BASE_URL}/catalog/selection/${id}/`;

  const res = await axios.get(url);

  let raw = res.data;

  if (raw?.success && raw?.data != null) {
    raw = raw.data;
  }

  if (!raw || typeof raw !== 'object') {
    return { _id: Number(id), name: 'Подборка', items: [], logo: null };
  }

  return {
    _id: raw._id ?? Number(id),
    name: raw.name ?? 'Подборка',
    items: Array.isArray(raw.items) ? raw.items : [],
    logo: raw.logo ?? null,
  };
};
