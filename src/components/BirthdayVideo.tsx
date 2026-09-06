import { motion, useReducedMotion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { birthday, type VideoItem } from '../data/birthday'
import { asset } from '../hooks/useAsset'
import { Section, SectionHeading } from './Section'

/**
 * การ์ดวิดีโอ 1 อัน
 * - preload="metadata" + ไม่ใส่ <source> จนกว่าจะกดเล่น -> ไม่กินแบนด์วิดท์ตอนโหลดหน้า
 * - ไม่ autoplay พร้อมเสียง (ผู้ใช้ต้องกดเอง)
 */
function VideoCard({ item, index }: { item: VideoItem; index: number }) {
  const [armed, setArmed] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduced = useReducedMotion()

  const start = () => {
    setArmed(true)
    // รอให้ React ใส่ src ก่อนค่อยสั่งเล่น
    window.setTimeout(() => void videoRef.current?.play().catch(() => undefined), 60)
  }

  return (
    <motion.figure
      className="group relative"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div
        className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-blush-200/45 to-lilac-200/45 blur-xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-70"
        aria-hidden="true"
      />

      <div className="glass relative overflow-hidden rounded-[1.5rem] p-2 shadow-soft sm:p-3">
        <div className="relative overflow-hidden rounded-[1.1rem] bg-blush-700/5">
          <video
            ref={videoRef}
            className="aspect-video h-auto w-full bg-black/85 object-contain"
            controls={armed}
            playsInline
            // iOS รุ่นเก่ายังอ่าน attribute ตัวเล็ก
            // eslint-disable-next-line react/no-unknown-property
            webkit-playsinline="true"
            preload="metadata"
            poster={item.poster ? asset(item.poster) : undefined}
            src={armed ? asset(item.src) : undefined}
            aria-label={item.title}
          >
            เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
          </video>

          {!armed && (
            <button
              type="button"
              onClick={start}
              aria-label={`เล่นวิดีโอ: ${item.title}`}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blush-200/85 to-lilac-200/85 backdrop-blur-[2px] transition-colors hover:from-blush-200/70 hover:to-lilac-200/70"
            >
              <motion.span
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-blush-500 shadow-glow sm:h-20 sm:w-20"
                whileHover={reduced ? undefined : { scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Play size={26} fill="currentColor" className="ml-1" />
              </motion.span>
            </button>
          )}
        </div>

        <figcaption className="px-2 pb-1 pt-3 text-center">
          <p className="font-script text-xl text-blush-600 sm:text-2xl">{item.title}</p>
          {item.caption && <p className="mt-0.5 text-xs text-blush-400">{item.caption}</p>}
        </figcaption>
      </div>
    </motion.figure>
  )
}

export function BirthdayVideo() {
  return (
    <Section id="video">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Chapter 06"
          title={birthday.videoTitle}
          subtitle={birthday.videoSubtitle}
        />

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2">
          {birthday.videos.map((v, i) => (
            <div key={v.src} className={i === 0 && birthday.videos.length % 2 === 1 ? 'lg:col-span-2' : ''}>
              <VideoCard item={v} index={i} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
