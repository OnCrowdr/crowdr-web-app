import axios, { AxiosError } from "axios"

export const isAxiosError = <T = any>(
  err: Error
): err is Required<AxiosError<T, any>> =>
  axios.isAxiosError<T>(err) && Boolean(err.response)

export function extractErrorMessages(
  errors: Record<string, any>,
  options: Options = {}
): string[] {
  const messages: string[] = []
  const { attachErrorFields } = options

  function traverse(obj: Record<string, any>, position = "") {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index, items) => {
          if (typeof item === "string") {
            const errorField = attachErrorFields
              ? `${key.toUpperCase()}${position}: `
              : ""
            messages.push(`${errorField}${item}`)
          } else if (typeof item === "object" && item !== null) {
            const position = items.length > 1 ? ` [${index + 1}]` : ""
            traverse(item, position)
          }
        })
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        traverse(obj[key])
      }
    }
  }

  traverse(errors)
  return messages.reverse()
}

interface Options {
  attachErrorFields?: boolean
}