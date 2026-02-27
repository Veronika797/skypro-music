import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrackState {
  currentTrack: TypesTrack | null;
  isPlay: boolean;
}

const initialState: TrackState = {
  currentTrack: null,
  isPlay: false,
};

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TypesTrack>) => {
      state.currentTrack = action.payload;
      state.isPlay = false;
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
  },
});

export const { setCurrentTrack, setIsPlay } = trackSlice.actions;
export default trackSlice.reducer;
