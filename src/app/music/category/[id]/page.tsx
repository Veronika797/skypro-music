'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { getAllTracks } from '@services/tracks/trackApi';
import Centerblock from '@components/Centerblock/Centerblock';
import { SelectionType } from '@services/catalogApi/types';
import { getSelectionById } from '@services/catalogApi/catalogApi';

export default function CategoryPage() {
  const { id } = useParams();
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [tracks, setTracks] = useState<TypesTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      if (!id || typeof id !== 'string') return;

      setLoading(true);
      try {
        const selectionData = await getSelectionById(id);
        setSelection(selectionData);

        const allTracks = await getAllTracks();

        const selectedTracks = allTracks.filter((track) =>
          selectionData.items?.includes(Number(track._id)),
        );

        setTracks(selectedTracks);
      } catch {
        setSelection(null);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id]);

  return (
    <Centerblock
      tracks={tracks}
      loading={loading}
      title={selection?.name || 'Загрузка...'}
    />
  );
}
