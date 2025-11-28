import { ApiSuccess, ApiError, ApiValidationError } from "./api.types";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenData {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

export type LoginSuccessResponse = ApiSuccess<TokenData>;

export type LoginApiResponse =
  | LoginSuccessResponse
  | ApiError
  | ApiValidationError;


export interface VerifyData {
  [key: string]: any;
}

export type VerifySuccessResponse = ApiSuccess<VerifyData>;

export type VerifyApiResponse =
  | VerifySuccessResponse     
  | ApiError
  | ApiValidationError;



