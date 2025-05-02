/**
 * @file useArticles.js
 * @description Hook React Query pour gérer les articles de blog : récupération, upload, suppression.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllArticles,
    getArticleBySlug,
    uploadMarkdown,
    deleteArticle
} from '../api/articles';

//Hook pour gérer les articles de blog via React Query
export function useArticles(options = {}) {
    const queryClient = useQueryClient();

    // Récupérer tous les articles
    const allQuery = useQuery({
        queryKey: ['articles'],
        queryFn: getAllArticles,
        staleTime: 30 * 60 * 1000, // 30 minutes
        ...options,
    });
    // Récupérer un article par slug
    const articleQuery = useQuery({
        queryKey: ['article', options.slug],
        queryFn: () => getArticleBySlug(options.slug),
        enabled: Boolean(options.slug),
        staleTime: 30 * 60 * 1000,
    });

    // Mutation pour uploader un article
    const uploadMutation = useMutation({
        mutationFn: uploadMarkdown,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });

    // Mutation pour supprimer un article
    const deleteMutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });

    return {
        articles: allQuery.data?.articles || [],
        article: articleQuery.data?.article || null,
        isLoading: allQuery.isLoading || articleQuery.isLoading,
        error: allQuery.error || articleQuery.error,
        fetchArticles: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
        fetchArticleBySlug: (slug) => queryClient.invalidateQueries({ queryKey: ['article', slug] }),
        upload: uploadMutation.mutateAsync,
        deleteArticle: deleteMutation.mutateAsync,
    };
}

