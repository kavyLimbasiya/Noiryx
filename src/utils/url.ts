/**
 * Resolves static asset paths taking into account Vite's base path (e.g. for GitHub Pages).
 */
export function getWallpaperUrl(src: string): string {
  if (!src) return '';
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src;
  }
  const clean = src.startsWith('/') ? src.slice(1) : src;
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${clean}`;
}
