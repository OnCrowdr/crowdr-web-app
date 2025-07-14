export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface BaseResponse {
  success: boolean
  message: string
  data: any
}

export interface Pagination {
  total:       number;
  perPage:     number;
  currentPage: number;
  totalPages:  number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}