/**
 * Reusable API type definitions
 */

export interface ResourceQuery {
  type?: string;
  tags?: { $in: string[] };
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}
