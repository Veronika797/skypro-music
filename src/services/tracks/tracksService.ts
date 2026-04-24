import { PlayListType, TypesTrack } from '@/SharedTypes/SharedTypes';
import { getAllTracks } from './trackApi';
import axios from 'axios';
import { BASE_URL } from '../constants';

let cachedSelections: PlayListType[] | null = null;

export const fetchTracks = async (): Promise<TypesTrack[]> => {
  try {
    const response = await getAllTracks();
    return Array.isArray(response) ? response : [];
  } catch (error) {
    throw new Error(
      'Не удалось загрузить треки. Проверьте подключение к интернету.',
    );
  }
};

export const fetchAllSelections = async (): Promise<PlayListType[]> => {
  if (cachedSelections) return cachedSelections;

  const res = await axios.get<{ success: boolean; data: PlayListType[] }>(
    `${BASE_URL}/catalog/selection/all/`,
    { timeout: 15000 },
  );

  const data = res.data?.success ? res.data.data : res.data;
  cachedSelections = Array.isArray(data) ? data : [];

  return cachedSelections;
};

export const fetchSelectionTracks = async (
  selectionId: string,
): Promise<{ name: string; tracks: TypesTrack[] }> => {
  try {
    const allSelections = await fetchAllSelections();
    const playlist = allSelections.find(
      (p) => String(p._id) === String(selectionId),
    );

    if (!playlist) {
      return { name: 'Подборка', tracks: [] };
    }

    const allTracks = await getAllTracks();
    const playlistIds = playlist.items?.map((id) => Number(id)) || [];
    const filteredTracks = allTracks.filter((track) =>
      playlistIds.includes(Number(track._id)),
    );

    return {
      name: playlist.name || 'Подборка',
      tracks: filteredTracks,
    };
  } catch (error) {
    throw new Error('Не удалось загрузить подборку');
  }
};
