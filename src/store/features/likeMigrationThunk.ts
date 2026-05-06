import { createAsyncThunk } from '@reduxjs/toolkit';
import { addLike } from '@services/tracks/trackApi';

interface MigrateLikesArgs {
  token: string;
  trackIds: number[];
}

export const migrateLocalLikesToServer = createAsyncThunk(
  'track/migrateLocalLikes',
  async ({ token, trackIds }: MigrateLikesArgs) => {
    const results = [];

    for (const trackId of trackIds) {
      try {
        await addLike(token, trackId);
        results.push({ trackId, success: true });
      } catch (error) {
        results.push({ trackId, success: false });
      }
    }

    return results;
  },
);
