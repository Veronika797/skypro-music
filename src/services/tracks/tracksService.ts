import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { getAllTracks } from './trackApi';

export const fetchTracks = async (): Promise<TypesTrack[]> => {
  try {
    const response = await getAllTracks();
    if (Array.isArray(response)) {
      return response;
    }

    return [];
  } catch (error) {
    console.error('Полная ошибка при получении треков:', error);
    if (error instanceof Error) {
      console.error('Тип ошибки:', error.name);
      console.error('Сообщение ошибки:', error.message);
      console.error('Стек вызовов:', error.stack);
    }
    throw new Error(
      'Не удалось загрузить треки. Проверьте подключение к интернету.',
    );
  }
};

export const fetchCategoryTracks = async (
  categoryId: string,
): Promise<TypesTrack[]> => {
  try {
    const allTracks = await fetchTracks();
    const filteredTracks = allTracks.filter((track) =>
      track.genre.some((g) =>
        g.toLowerCase().includes(categoryId.toLowerCase()),
      ),
    );
    return filteredTracks;
  } catch (error) {
    console.error('Ошибка при получении треков подборки:', error);
    throw new Error('Не удалось загрузить треки подборки.');
  }
};
