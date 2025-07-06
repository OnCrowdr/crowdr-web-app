import { PropsWithChildren, FC } from "react"
import { QueryFunctionContext, QueryFunction, QueryKey } from "react-query"

export type RFC<T = {}> = FC<PropsWithChildren<T>>

export type QFC<Keys extends any[] = []> = QueryFunctionContext<
  [string, ...Keys]
>

export type QF<ReturnType, Keys extends any[] = []> = QueryFunction<
  ReturnType,
  [string, ...Keys]
>

export type Nullable<T> = T | undefined | null

export interface IPagination {
  total: number
  perPage: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface Route {
  params: { [key: string]: string }
}

export enum UserType {
  Individual = "individual",
  NonProfit = "non-profit"
}