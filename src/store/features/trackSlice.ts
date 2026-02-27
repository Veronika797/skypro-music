import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrackState {
  currentTrack: TypesTrack | null;
}

const initialState: TrackState = {
  currentTrack: null,
};

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TypesTrack>) => {
      state.currentTrack = action.payload;
    },
  },
});

export const { setCurrentTrack } = trackSlice.actions;
export default trackSlice.reducer;
