/**
 * @file usePhotos.js
 * @description Hook React Query pour gérer les photos avec pagination : récupération, upload, suppression.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhotos, deletePhoto, uploadPhoto } from '../api/photos';

/*
  Ce hook récupère et met en cache les photos avec pagination.
  On accepte en plus un objet d'options pour, par exemple, désactiver la query.
*/
export const usePhotos = (page = 1, limit = 10, options = {}) => {
  const queryClient = useQueryClient();

  // Utilisation de la nouvelle syntaxe "object" pour useQuery.
  const query = useQuery({
    queryKey: ['photos', page],
    queryFn: () => getPhotos(page, limit),
    staleTime:  30 * 60 * 1000, // 10 minute
    ...options,
  });

  // Mutation pour supprimer une photo.
  const deletePhotoMutation = useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photos'] }),
  });

  // Mutation pour uploader une photo.
  const uploadPhotoMutation = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photos'] }),
  });

  return {
    photos: query.data?.photos || [],
    currentPage: query.data?.currentPage || page,
    totalPages: query.data?.totalPages || 1,
    isLoading: query.isLoading,
    error: query.error,
    deletePhoto: deletePhotoMutation.mutateAsync,
    uploadPhoto: uploadPhotoMutation.mutateAsync,
    refetchPhotos: () => queryClient.invalidateQueries({ queryKey: ['photos'] }),
  };
};
