import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getLocalFavoriteIds = (): number[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('localFavoriteTrackIds');
  try {
    const parsed = JSON.parse(saved || '[]');
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
};

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
  favoriteTrackIds: number[];
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
  favoriteTrackIds: getLocalFavoriteIds(),
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    addFavoriteTrackId: (state, action: PayloadAction<number>) => {
      const trackId = action.payload;
      if (!state.favoriteTrackIds.includes(trackId)) {
        state.favoriteTrackIds.push(trackId);
        localStorage.setItem(
          'localFavoriteTrackIds',
          JSON.stringify(state.favoriteTrackIds),
        );
      }
    },
    removeFavoriteTrackId: (state, action: PayloadAction<number>) => {
      const trackId = action.payload;
      state.favoriteTrackIds = state.favoriteTrackIds.filter(
        (id) => id !== trackId,
      );
      localStorage.setItem(
        'localFavoriteTrackIds',
        JSON.stringify(state.favoriteTrackIds),
      );
    },
    setFavoriteTrackIds: (state, action: PayloadAction<number[]>) => {
      state.favoriteTrackIds = action.payload;
      localStorage.setItem(
        'localFavoriteTrackIds',
        JSON.stringify(action.payload),
      );
    },
    clearLocalFavorites: (state) => {
      state.favoriteTrackIds = state.favoriteTrackIds.filter((id) =>
        state.favoriteTracks.some((track) => Number(track._id) === id),
      );
      localStorage.setItem(
        'localFavoriteTrackIds',
        JSON.stringify(state.favoriteTrackIds),
      );
    },

    addLikedTracks: (state, action: PayloadAction<TypesTrack>) => {
      const payloadId = Number(action.payload._id);
      const exists = state.favoriteTracks.some(
        (t) => Number(t._id) === payloadId,
      );
      if (!exists) {
        state.favoriteTracks.push(action.payload);
        if (!state.favoriteTrackIds.includes(payloadId)) {
          state.favoriteTrackIds.push(payloadId);
        }
      }
    },

    removeLikedTracks: (state, action: PayloadAction<TypesTrack>) => {
      const payloadId = Number(action.payload._id);
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => Number(track._id) !== payloadId,
      );
      state.favoriteTrackIds = state.favoriteTrackIds.filter(
        (id) => id !== payloadId,
      );
    },

    setFavoriteTracks: (state, action: PayloadAction<TypesTrack[]>) => {
      state.favoriteTracks = action.payload;

      const ids = action.payload.map((track) => Number(track._id));
      state.favoriteTrackIds = ids;
      localStorage.setItem('localFavoriteTrackIds', JSON.stringify(ids));
    },

    setCurrentTrack: (state, action: PayloadAction<TypesTrack>) => {
      state.currentTrack = action.payload;
      state.isPlay = true;
      state.currentTime = 0;
      state.duration = action.payload.duration || 0;
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
  addFavoriteTrackId,
  removeFavoriteTrackId,
  setFavoriteTrackIds,
  clearLocalFavorites,
} = trackSlice.actions;

export default trackSlice.reducer;
