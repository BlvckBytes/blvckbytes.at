export const sanitizeForUrl = (input: string): string => {
  return input
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll(/[^A-Za-z0-9-_]/ig, "-");
}