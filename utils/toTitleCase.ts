
export function toTitleCase(str: string) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}