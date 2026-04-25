import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';
import trackReducer from '@/store/features/trackSlice';
import { authSliceReducer } from './features/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      tracks: trackReducer,
      auth: authSliceReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
export const useAppStore = () => useStore<AppStore>();
