import { AnimatePresence, motion } from 'framer-motion'
import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { birthday } from '../data/birthday'
import { asset } from '../hooks/useAsset'
import { loadYouTubeApi, type YTPlayer } from '../hooks/useYouTubeApi'

type Source = 'pending' | 'local' | 'youtube' | 'none'

type Props = {
  /** true เมื่อผู้ใช้กด "Open Your Birthday Surprise" แล้ว (browser ถึงจะยอมให้เล่นเสียง) */
  active: boolean
}

/**
 * Floating music player
 *
 * ลำดับการเลือกแหล่งเสียง:
 *  1. /public/audio/birthday-song.mp3  -> <audio> ปกติ (คุมได้ 100%, ไม่ต้องต่อเน็ต)
 *  2. ถ้าไฟล์ไม่มี/โหลดไม่ได้           -> YouTube IFrame API (hidden player)
 *  3. ถ้าทั้งคู่ไม่ได้                   -> ซ่อนปุ่มไปเลย ไม่ให้ error ค้างหน้าจอ
 *
 * autoplay: เริ่มเล่นตอน `active` เปลี่ยนเป็น true เท่านั้น
 * เพราะ browser บล็อก autoplay ก่อน user interaction
 */
export function MusicPlayer({ active }: Props) {
  const [source, setSource] = useState<Source>('pending')
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ytRef = useRef<YTPlayer | null>(null)
  const ytHostRef = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)

  /** ตรวจว่ามีไฟล์ mp3 ในเครื่องไหม โดยไม่โหลดทั้งไฟล์ */
  useEffect(() => {
    let cancelled = false
    const url = asset(birthday.music.localSrc)

    const audio = new Audio()
    audio.preload = 'metadata'
    audio.loop = true
    audio.volume = birthday.music.volume

    const ok = () => {
      if (cancelled) return
      audioRef.current = audio
      setSource('local')
    }
    const fail = () => {
      if (cancelled) return
      audio.removeAttribute('src')
      setSource(birthday.music.youtubeId ? 'youtube' : 'none')
    }

    audio.addEventListener('loadedmetadata', ok, { once: true })
    audio.addEventListener('error', fail, { once: true })
    audio.src = url
    audio.load()

    return () => {
      cancelled = true
      audio.removeEventListener('loadedmetadata', ok)
      audio.removeEventListener('error', fail)
      audio.pause()
    }
  }, [])

  /** สร้าง hidden YouTube player เมื่อจำเป็น */
  useEffect(() => {
    if (source !== 'youtube' || !ytHostRef.current || ytRef.current) return
    let cancelled = false

    loadYouTubeApi()
      .then(() => {
        if (cancelled || !ytHostRef.current || !window.YT) return
        ytRef.current = new window.YT.Player(ytHostRef.current, {
          videoId: birthday.music.youtubeId,
          height: 1,
          width: 1,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            start: birthday.music.youtubeStartAt ?? 0,
            loop: 1,
            playlist: birthday.music.youtubeId,
          },
          events: {
            onReady: (e) => {
              e.target.setVolume(Math.round(birthday.music.volume * 100))
              if (startedRef.current) {
                e.target.playVideo()
                setPlaying(true)
              }
            },
            onStateChange: (e) => {
              if (!window.YT) return
              if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true)
              if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false)
              if (e.data === window.YT.PlayerState.ENDED) {
                e.target.seekTo(birthday.music.youtubeStartAt ?? 0, true)
                e.target.playVideo()
              }
            },
            onError: () => setSource('none'),
          },
        })
      })
      .catch(() => setSource('none'))

    return () => {
      cancelled = true
    }
  }, [source])

  const play = useCallback(() => {
    if (source === 'local' && audioRef.current) {
      void audioRef.current.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      )
    } else if (source === 'youtube' && ytRef.current) {
      ytRef.current.playVideo()
      setPlaying(true)
    }
  }, [source])

  const pause = useCallback(() => {
    if (source === 'local') audioRef.current?.pause()
    if (source === 'youtube') ytRef.current?.pauseVideo()
    setPlaying(false)
  }, [source])

  /** เริ่มเล่นครั้งแรกหลังผู้ใช้กดเปิดเซอร์ไพรส์ */
  useEffect(() => {
    if (!active) return
    startedRef.current = true
    play()
  }, [active, play])

  const toggle = () => (playing ? pause() : play())

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    if (source === 'local' && audioRef.current) {
      audioRef.current.volume = next ? 0 : birthday.music.volume
    }
    if (source === 'youtube' && ytRef.current) {
      ytRef.current.setVolume(next ? 0 : Math.round(birthday.music.volume * 100))
    }
  }

  useEffect(() => () => ytRef.current?.destroy(), [])

  const hidden = !active || source === 'pending' || source === 'none'

  return (
    <>
      {/* host ของ YouTube player — ต้องอยู่ใน DOM จริง ห้าม display:none ไม่งั้นบางเบราว์เซอร์ไม่เล่น */}
      <div className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <div ref={ytHostRef} />
      </div>

      <AnimatePresence>
        {!hidden && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="safe-bottom safe-right fixed bottom-4 right-4 z-50 flex items-center gap-2 sm:bottom-6 sm:right-6"
          >
            <div className="glass-strong flex items-center gap-1 rounded-full p-1.5 shadow-soft">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? 'หยุดเพลง' : 'เล่นเพลง'}
                aria-pressed={playing}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-lilac-400 text-white transition-transform active:scale-90"
              >
                {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                {playing && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-blush-300/40" style={{ animationDuration: '2.4s' }} />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
                aria-pressed={muted}
                className="flex h-9 w-9 items-center justify-center rounded-full text-blush-500 transition-colors hover:bg-blush-100"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <div className="hidden items-center gap-1.5 pr-3 pl-1 sm:flex" aria-hidden="true">
                <Music2 size={14} className={playing ? 'text-blush-400 animate-spin-slow' : 'text-blush-300'} />
                <div className="flex h-4 items-end gap-[3px]">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-gradient-to-t from-blush-400 to-lilac-400"
                      style={{
                        height: playing ? undefined : '4px',
                        animation: playing ? `eq 0.9s ease-in-out ${i * 0.13}s infinite` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
