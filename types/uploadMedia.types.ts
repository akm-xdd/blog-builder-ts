import { ApiError, ApiSuccess, ApiValidationError } from "./api.types";

export interface UploadedMediaData {
  url?: string;
  [key: string]: any;
}

export type UploadMediaResponse =
  | ApiSuccess<UploadedMediaData>
  | ApiError
  | ApiValidationError;
