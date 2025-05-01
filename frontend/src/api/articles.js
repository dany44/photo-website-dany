import axiosInstance from "./axiosInstance";

//Récupère tous les articles
export async function getAllArticles() {
  const response = await axiosInstance.get("/articles");
  return response.data;
  // { articles: [...] }
}

//Recupère un article par slug
export async function getArticleBySlug(slug) {
  const response = await axiosInstance.get(`/articles/${slug}`);
  return response.data;
// { article: { title, slug, markdownContent, createdAt, updatedAt } }
}

//Upload d'un fichier Markdown pour créer un article
export async function uploadMarkdown(formData) {
    const response = await axiosInstance.post("/articles/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data; // { message, article: {...} }
}

//Supprime un article par slug
export async function deleteArticle(slug) {
    const response = await axiosInstance.delete(`/articles/${slug}`);
    return response.data; // { message }
}