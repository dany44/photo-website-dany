/**
 * @file useAlbumPhotos.js
 * @description Hook React Query pour récupérer un album et ses photos à partir de son ID.
 */
import { useQuery } from '@tanstack/react-query';
import { getAlbumById } from '../api/albums';

/*
  Ce hook récupère et met en cache un album spécifique (et ses photos) via son ID.
  La query ne s'exécute que si albumId est défini (grâce à enabled: Boolean(albumId)).
*/  
export const useAlbumPhotos = (albumId) => {
  return useQuery({
    queryKey: ['album', albumId],
    queryFn: () => getAlbumById(albumId),
    enabled: Boolean(albumId),
    staleTime:  30 * 60 * 1000, // 10 minute
  });
};
