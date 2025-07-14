"use client"
import keys from "./keys"

let ls: Storage
if (typeof window !== "undefined") {
  ls = window.localStorage
}

const setItem = (key: string, value: string | Record<string, any>) => {
  return ls.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value)
  )
}

const getItem = <T = any>(key: string): T | null => {
  const value = ls?.getItem(key)
  return typeof value === "string" ? JSON.parse(value) : value
}

const removeItem = (key: string) => {
  ls.removeItem(key)
}

export default {
  setItem,
  getItem,
  removeItem,
  keys,
}
