import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { birthday } from '../data/birthday'
import { asset } from '../hooks/useAsset'
import { Section, SectionHeading } from './Section'

const TILT = [-2.5, 1.8, -1.4, 2.6, -2, 1.2]

export function MemoriesGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const photos = birthday.memories

  const close = useCallback(() => setOpenIndex(null), [])
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  )
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  )

  /** keyboard: Esc ปิด, ลูกศรซ้าย/ขวาเปลี่ยนรูป + ล็อก scroll ตอนเปิด lightbox */
  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [openIndex, close, next, prev])

  const active = openIndex === null ? null : photos[openIndex]

  return (
    <Section id="memories">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Chapter 03"
          title={birthday.memoriesTitle}
          subtitle={birthday.memoriesSubtitle}
        />

        {/* masonry แบบ CSS columns -> 1 คอลัมน์บนมือถือ, 2-3 บนจอใหญ่ */}
        <div className="columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3">
          {photos.map((m, i) => (
            <motion.button
              key={m.image + i}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`เปิดดูรูป: ${m.caption}`}
              className="group mb-5 block w-full break-inside-avoid text-left sm:mb-6"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.09, ease: 'easeOut' }}
              whileHover={reduced ? undefined : { scale: 1.03, rotate: 0, y: -6 }}
              whileTap={{ scale: 0.98 }}
              style={{ rotate: reduced ? 0 : `${TILT[i % TILT.length]}deg` }}
            >
              {/* polaroid card */}
              <div className="relative rounded-2xl bg-white p-3 pb-14 shadow-polaroid transition-shadow duration-300 group-hover:shadow-glow">
                <div className="relative overflow-hidden rounded-xl bg-blush-100">
                  <img
                    src={asset(m.image)}
                    alt={m.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blush-500/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span
                    className="pointer-events-none absolute right-3 top-3 scale-50 text-xl opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    ❤️
                  </span>
                </div>

                <div className="absolute inset-x-3 bottom-3">
                  <p className="truncate font-script text-xl text-blush-600">{m.caption}</p>
                  {m.note && <p className="truncate text-[11px] text-blush-400">{m.note}</p>}
                </div>

                {/* เทปกาวมุมบน */}
                <span
                  className="absolute -top-2 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-blush-200/70"
                  aria-hidden="true"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            onClick={close}
          >
            <div className="absolute inset-0 bg-blush-700/45 backdrop-blur-xl" />

            <motion.figure
              className="relative z-10 max-h-full w-full max-w-3xl overflow-hidden rounded-2xl bg-white/95 p-3 shadow-2xl sm:p-4"
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={asset(active.image)}
                alt={active.caption}
                className="mx-auto max-h-[68vh] w-auto max-w-full rounded-xl object-contain"
              />
              <figcaption className="mt-3 px-1 pb-1 text-center">
                <p className="font-script text-2xl text-blush-600">{active.caption}</p>
                {active.note && <p className="mt-0.5 text-xs text-blush-400">{active.note}</p>}
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={close}
              aria-label="ปิดรูป"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-blush-600 shadow-soft transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:top-6"
            >
              <X size={20} />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  aria-label="รูปก่อนหน้า"
                  className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-blush-600 shadow-soft transition-transform hover:scale-105 active:scale-95 sm:left-6"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  aria-label="รูปถัดไป"
                  className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-blush-600 shadow-soft transition-transform hover:scale-105 active:scale-95 sm:right-6"
                >
                  <ChevronRight size={22} />
                </button>

                <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                  {photos.map((p, i) => (
                    <button
                      key={p.image + i}
                      type="button"
                      aria-label={`ไปที่รูปที่ ${i + 1}`}
                      aria-current={i === openIndex}
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenIndex(i)
                      }}
                      className={`h-2 rounded-full transition-all ${
                        i === openIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <Heart
              size={18}
              className="absolute bottom-6 right-6 z-20 hidden text-white/70 sm:block"
              fill="currentColor"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
