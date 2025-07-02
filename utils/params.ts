type RecordType = Record<string, any>

export const useParamKey = <T extends RecordType = any>() => {
  const paramKey = (key: keyof T) => key

  return paramKey
}

// To understand why it's converted to a Map first, check the link below:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#concurrent_modifications_when_iterating
export function sanitizeParams(url: URL): URL
export function sanitizeParams(params: URLSearchParams): URLSearchParams
export function sanitizeParams(
  input: URL | URLSearchParams
): URL | URLSearchParams {
  if (input instanceof URL) {
    const urlCopy = new URL(input.toString())
    const searchMap = new Map(urlCopy.searchParams.entries())
    for (const [key, value] of searchMap) {
      if (!value) urlCopy.searchParams.delete(key)
    }
    return urlCopy
  } else {
    const paramsCopy = new URLSearchParams(input.toString())
    const searchMap = new Map(paramsCopy.entries())
    for (const [key, value] of searchMap) {
      if (!value) paramsCopy.delete(key)
    }
    return paramsCopy
  }
}

export function mapParamsToObject<T extends RecordType = any>(
  searchParams: URLSearchParams
): T {
  const params = {} as T
  for (const [key, value] of searchParams) {
    ;(params as any)[key] = value
  }
  return params
}
