import { SelectionType } from './types';
import apiInstance from '@store/features/apiInstance';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getSelectionById = async (id: string): Promise<SelectionType> => {
  try {
    const response = await apiInstance.get<ApiResponse<SelectionType>>(
      `/catalog/selection/${id}/`,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
