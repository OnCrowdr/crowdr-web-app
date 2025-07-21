import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"

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

export const errorHandler = (err: Error) => {
  if (isAxiosError<any>(err)) {
    const error = err.response.data
    const errors = extractErrorMessages(error)

    if (errors.length) {
      for (const error of errors) {
        toast.error(error)
      }
    } else {
      if (error.error) {
        toast.error(error.error)
      }
      if (error.detail) {
        toast.error(error.detail)
      }
      if (error.message) {
        toast.error(error.message)
      }
    }
  } else {
    toast.error("Something went wrong")
  }
}
