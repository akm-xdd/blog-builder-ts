import { ApiSuccess, ApiError, ApiValidationError } from "./api.types";

export interface BlogFilters {
  status?: string | null;
  primary_tag_id?: string | null;
  industry_ids?: string[] | null;
  search?: string | null;
  sort_by?: string;            
  sort_order?: "asc" | "desc";
  page?: number;               
  page_size?: number;     
}

export interface Blog {
  title: string;
  primary_tag_id: string;
  cover_image_url: string;
  description: string;
  content_markdown: string;

  id: string;
  slug: string;

  read_time_minutes: number;

  is_published: boolean;
  published_at: string | null;

  is_archived: boolean;

  author_id: string;
  updated_by: string;

  created_at: string;
  updated_at: string;

  industry_ids: string[];
}


export interface CreateBlogPayload {
  username: string;
  title: string;
  primary_tag_id: string;
  cover_image_url: string;
  description: string;
  content_markdown: string;
  industry_ids: string[];
}
export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export interface BlogStatusPayload {
  username: string;
}

export type CreateBlogResponse =
  | ApiSuccess<Blog>
  | ApiError          
  | ApiValidationError;

export interface GetAllBlogsSuccess extends ApiSuccess<Blog[]> {
  total: number;
  page: number;
  page_size: number;
}
export type GetAllBlogsResponse =
  | GetAllBlogsSuccess
  | ApiError
  | ApiValidationError;

export type GetBlogByIdResponse =
  | ApiSuccess<Blog>
  | ApiError          
  | ApiValidationError;

export type UpdateBlogResponse =
  | ApiSuccess<Blog>
  | ApiError          
  | ApiValidationError;

export type BlogStatusActionResponse =
  | ApiSuccess<Blog>
  | ApiError
  | ApiValidationError;

export type GetBlogBySlugResponse =
  | ApiSuccess<Blog>
  | ApiError
  | ApiValidationError;