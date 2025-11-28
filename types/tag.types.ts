import { ApiError, ApiSuccess, ApiValidationError } from "./api.types";

export interface TagsState {
  primaryTags: PrimaryTag[];
  industries: Industry[];
}

export interface PrimaryTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}


export interface PrimaryTagFilters {
  search?: string | null;
  page?: number;       // default: 1
  page_size?: number;  // default: 10, max:100
}

export interface IndustryFilters {
  search?: string | null;
  page?: number;       // default: 1
  page_size?: number;  // default: 10, max:100
}

export type GetPrimaryTagsResponse =
  | ApiSuccess<PrimaryTag[]>
  | ApiError
  | ApiValidationError;

export type GetIndustriesResponse =
  | ApiSuccess<Industry[]>
  | ApiError
  | ApiValidationError;