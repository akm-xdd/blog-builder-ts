
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  meta?: Record<string, any>;
  data: T;
}


export interface ApiError {
  success: false;
  error: string;      // "Error message"
  details: any | null;
}


export interface ValidationErrorItem {
  loc: string[];
  msg: string;
  type: string;
}

export interface ValidationErrorDetails {
  errors: ValidationErrorItem[];
}

export interface ApiValidationError {
  success: false;
  error: "Validation Error";
  details: ValidationErrorDetails;
}
