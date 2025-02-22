export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) {
    return "";
  }
  return maxLength > text.length ? text : text.slice(0, maxLength);
}