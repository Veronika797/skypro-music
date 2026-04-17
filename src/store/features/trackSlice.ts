import { TrackType } from '@/SharedTypes/SharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrackState {
  currentTrack: TrackType | null;
  isPlay: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  playlist: TrackType[];
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

const initialState: TrackState = {
  currentTrack: null,
  isPlay: false,
  isRepeat: false,
  isShuffle: false,
  playlist: [],
  currentTime: 0,
  duration: 0,
  volume: 50,
  isMuted: false,
};

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
      state.isPlay = true;
      state.currentTime = 0;
      state.duration = action.payload.duration;
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setIsRepeat: (state, action: PayloadAction<boolean>) => {
      state.isRepeat = action.payload;
    },
    setIsShuffle: (state, action: PayloadAction<boolean>) => {
      state.isShuffle = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
      if (action.payload > 0) state.isMuted = false;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlay,
  setIsRepeat,
  setIsShuffle,
  setPlaylist,
  setVolume,
  toggleMute,
  setCurrentTime,
  setDuration,
} = trackSlice.actions;
export default trackSlice.reducer;
