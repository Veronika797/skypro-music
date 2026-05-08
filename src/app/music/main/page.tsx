'use client';

import { TypesTrack } from '@/SharedTypes/SharedTypes';
import Centerblock from '@components/Centerblock/Centerblock';

export default function MusicMainPage({ tracks, loading }: { tracks: TypesTrack[]; loading: boolean }) {
  return <Centerblock tracks={tracks} loading={loading} title="Треки" />;
}
