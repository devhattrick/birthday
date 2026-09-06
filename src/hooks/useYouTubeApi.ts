/** โหลด YouTube IFrame API เพียงครั้งเดียวต่อหน้า แล้ว resolve เมื่อพร้อมใช้ */

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement | string, options: YTPlayerOptions) => YTPlayer
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export type YTPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (v: number) => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  getPlayerState: () => number
  destroy: () => void
}

export type YTPlayerOptions = {
  videoId: string
  height?: string | number
  width?: string | number
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (e: { target: YTPlayer }) => void
    onStateChange?: (e: { data: number; target: YTPlayer }) => void
    onError?: (e: { data: number }) => void
  }
}

let loader: Promise<void> | null = null

export function loadYouTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.YT?.Player) return Promise.resolve()
  if (loader) return loader

  loader = new Promise<void>((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    tag.onerror = () => reject(new Error('ไม่สามารถโหลด YouTube IFrame API ได้'))
    document.head.appendChild(tag)
    window.setTimeout(() => reject(new Error('YouTube IFrame API timeout')), 12_000)
  })

  return loader
}
