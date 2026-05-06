'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/store';
import {
  setIsPlay,
  setCurrentTrack,
  setDuration,
} from '@store/features/trackSlice';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

type AudioPlayerProps = {
  playlist: TypesTrack[];
};

const AudioPlayer = ({ playlist }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();

  const volume = useAppSelector((state) => state.tracks.volume);
  const isMuted = useAppSelector((state) => state.tracks.isMuted);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const isRepeat = useAppSelector((state) => state.tracks.isRepeat);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const currentTime = useAppSelector((state) => state.tracks.currentTime);

  const currentTrackIndex = playlist.findIndex(
    (t) => t._id === currentTrack?._id,
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      dispatch(setDuration(audio.duration));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.track_file) return;

    if (audio.src !== currentTrack.track_file) {
      audio.src = currentTrack.track_file;

      const onCanPlay = async () => {
        if (isPlaying) {
          try {
            await audio.play();
          } catch (e) {
            dispatch(setIsPlay(false));
          }
        }
        audio.removeEventListener('canplay', onCanPlay);
      };

      audio.addEventListener('canplay', onCanPlay);
      audio.load();
    }
  }, [currentTrack, isPlaying, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.readyState < 3) return;

    if (isPlaying) {
      audio.play().catch((e: unknown) => {
        dispatch(setIsPlay(false));
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (Math.abs(audio.currentTime - currentTime) > 2) {
      audio.currentTime = currentTime;
    }
  }, [currentTime, currentTrack]);

  const handleEnded = useCallback(() => {
    if (!playlist.length || !currentTrack) return;

    if (isRepeat) {
      dispatch(setIsPlay(true));
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      dispatch(setCurrentTrack(playlist[randomIndex]));
      dispatch(setIsPlay(true));
    } else {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      dispatch(setCurrentTrack(playlist[nextIndex]));
      dispatch(setIsPlay(true));
    }
  }, [
    isRepeat,
    isShuffle,
    playlist,
    dispatch,
    currentTrack,
    currentTrackIndex,
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleEnded]);

  const handleError = useCallback(
    (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      console.error('Audio error:', {
        error: audio.error,
        src: audio.src,
        name: currentTrack?.name,
      });
      dispatch(setIsPlay(false));
    },
    [currentTrack, dispatch],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('error', handleError);
    };
  }, [handleError]);

  if (!playlist || playlist.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'none' }}>
      <audio ref={audioRef} preload="auto" />
    </div>
  );
};

export default AudioPlayer;
