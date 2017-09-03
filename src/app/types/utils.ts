export function getInternalValue<T>(card: any, field: string): T {
  const index = field.indexOf(".");

  if (index !== -1) {
    return getInternalValue(card[field.substr(0, index)], field.substr(index + 1)) as T;
  }
  return card[field] as T;
}

export function proxy(url: string): string {
  return "https://zyuiop.net/img.php?url=" + encodeURIComponent(url);
}
