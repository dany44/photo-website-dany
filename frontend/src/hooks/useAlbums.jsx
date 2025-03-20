// src/hooks/useAlbums.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllAlbums,
  createAlbum as createAlbumApi,
  updateAlbum as updateAlbumApi,
  deleteAlbum as deleteAlbumApi,
} from '../api/albums';

/*
  Ce hook utilise React Query avec la nouvelle syntaxe (forme objet)
  pour récupérer et mettre en cache les albums et gérer les mutations.
*/
export const useAlbums = () => {
  const queryClient = useQueryClient();

  // Utilisation de useQuery avec la forme objet
  const { data, isLoading, error } = useQuery({
    queryKey: ['albums'],
    queryFn: getAllAlbums,
    staleTime:  30 * 60 * 1000, // 10 minute
  });

  // Mutation pour créer un album
  const createAlbumMutation = useMutation({
    mutationFn: createAlbumApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  // Mutation pour mettre à jour un album
  const updateAlbumMutation = useMutation({
    mutationFn: ({ id, formData }) => updateAlbumApi(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  // Mutation pour supprimer un album
  const deleteAlbumMutation = useMutation({
    mutationFn: deleteAlbumApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  return {
    albums: data?.albums || [],
    isLoading,
    error,
    createAlbum: createAlbumMutation.mutateAsync,
    updateAlbum: updateAlbumMutation.mutateAsync,
    deleteAlbum: deleteAlbumMutation.mutateAsync,
    refetchAlbums: () => queryClient.invalidateQueries({ queryKey: ['albums'] }),
  };
};
