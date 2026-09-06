/**
 * แปลง path ที่เขียนไว้ใน birthday.ts (เช่น "/images/photo1.jpg")
 * ให้เป็น URL ที่ถูกต้องทั้งตอน dev ("/") และตอนขึ้น GitHub Pages ("/<repo>/")
 *
 * import.meta.env.BASE_URL มาจาก `base` ใน vite.config.ts
 */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
