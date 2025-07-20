import { UserType } from "@/types";

// params
export interface IGetUsersParams {
  page:   number;
  perPage: number;
  userType: UserType | ""
  nameOrder: 'asc' | 'desc'
  name: string;
}

// response
export interface IGetUsersResponse {
  success: boolean;
  message: string;
  data:    IGetUsersResponseData;
}

export interface IGetUsersResponseData {
  results:    User[];
  pagination: Pagination;
}

export interface Pagination {
  total:       number;
  perPage:     number;
  currentPage: number;
  totalPages:  number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface User {
  _id:               string;
  userType:          UserType;
  email:             string;
  interests:         string[];
  referrer:          Referrer;
  isAdmin:           boolean;
  isEmailVerified:   boolean;
  isDeleted:         boolean;
  organizationName?: string;
  organizationId?:   string;
  fullName?:         string;
  gender?:           string;
}

export enum Referrer {
  Google = "google",
  String = "string",
}