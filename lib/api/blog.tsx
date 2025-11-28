import { BlogFilters, BlogStatusActionResponse, BlogStatusPayload, CreateBlogPayload, CreateBlogResponse, GetAllBlogsResponse, GetBlogByIdResponse, GetBlogBySlugResponse, UpdateBlogPayload, UpdateBlogResponse } from "@/types/blog.types";
import api from "../utils/axios";

export function getAllBlogs(params: BlogFilters = {}) {
  return api.get<GetAllBlogsResponse>("/posts", { params });
}

export function createBlog(payload: CreateBlogPayload) {
    return api.post<CreateBlogResponse>("/posts", payload);
}

export function getBlog(id: string ) {
    return api.get<GetBlogByIdResponse>(`/posts/${id}`);
}

export function updateBlog(id: string, payload: UpdateBlogPayload) {
    return api.put<UpdateBlogResponse>(`/posts/${id}`, payload);
}

export function publishBlog(id: string, payload: BlogStatusPayload) {
    return api.post<BlogStatusActionResponse>(`/posts/${id}/publish`, payload);
}

export function unpublishBlog(id: string, payload: BlogStatusPayload){
    return api.post<BlogStatusActionResponse>(`/posts/${id}/unpublish`, payload);
}

export function unarchiveBlog(id: string, payload: BlogStatusPayload){
    return api.post<BlogStatusActionResponse>(`/posts/${id}/unpublish`, payload);
}

export function archiveBlog(id: string, payload: BlogStatusPayload) {
    return api.post<BlogStatusActionResponse>(`/posts/${id}/archive`, payload);
}

export function getBlogBySlug(slug: string){
    return api.get<GetBlogBySlugResponse>(`/posts/slug/${slug}`)
}
