import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrackState {
  currentTrack: TypesTrack | null;
  isPlay: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  playlist: TypesTrack[];
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  favoriteTracks: TypesTrack[];
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
  favoriteTracks: [],
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    addLikedTracks: (state, action: PayloadAction<TypesTrack>) => {
      const exists = state.favoriteTracks.some(
        (t) => t._id === action.payload._id,
      );
      if (!exists) {
        state.favoriteTracks.push(action.payload);
      }
    },
    removeLikedTracks: (state, action: PayloadAction<TypesTrack>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track._id !== action.payload._id,
      );
    },
    setFavoriteTracks: (state, action: PayloadAction<TypesTrack[]>) => {
      state.favoriteTracks = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<TypesTrack>) => {
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
    setPlaylist: (state, action: PayloadAction<TypesTrack[]>) => {
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
  addLikedTracks,
  removeLikedTracks,
  setFavoriteTracks,
} = trackSlice.actions;
export default trackSlice.reducer;
