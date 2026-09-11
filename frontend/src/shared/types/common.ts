export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index
  size: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: string[];
}
