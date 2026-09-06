import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { birthday } from '../data/birthday'
import { asset } from '../hooks/useAsset'
import { burstConfetti, burstHearts } from './Confetti'
import { GradientText } from './GradientText'
import { Section } from './Section'
import { Sparkles } from './Sparkles'

export function GiftBox() {
  const [opened, setOpened] = useState(false)
  const [shaking, setShaking] = useState(false)
  const reduced = useReducedMotion()

  const open = () => {
    if (opened || shaking) return
    setShaking(true)
    // สั่นก่อน 700ms แล้วค่อยเปิดฝา -> ให้รู้สึกว่ามีอะไรอยู่ข้างใน
    window.setTimeout(
      () => {
        setShaking(false)
        setOpened(true)
        burstConfetti({ x: 0.5, y: 0.5 })
        burstHearts(26)
      },
      reduced ? 0 : 700,
    )
  }

  return (
    <Section id="gift" className="overflow-hidden">
      <div className="section-shell">
        <motion.p
          className="mb-10 text-center font-script text-3xl text-blush-500 sm:mb-14 sm:text-4xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {birthday.gift.teaser}
        </motion.p>

        <div className="relative mx-auto flex min-h-[22rem] max-w-lg flex-col items-center justify-center">
          <Sparkles count={opened ? 34 : 12} color="#ffe0cc" />

          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button
                key="box"
                type="button"
                onClick={open}
                aria-label={`${birthday.gift.label} — เปิดกล่องของขวัญ`}
                className="group relative outline-offset-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  shaking && !reduced
                    ? { opacity: 1, scale: 1, rotate: [0, -7, 7, -6, 6, -3, 3, 0], y: [0, -6, 0, -4, 0] }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={{ opacity: 0, scale: 1.25, filter: 'blur(10px)' }}
                transition={shaking ? { duration: 0.7 } : { type: 'spring', stiffness: 180, damping: 16 }}
                whileHover={reduced || shaking ? undefined : { scale: 1.06, y: -6 }}
                whileTap={{ scale: 0.94 }}
              >
                {/* glow */}
                <motion.span
                  className="absolute -inset-8 rounded-full bg-gradient-to-br from-blush-300/45 to-lilac-300/45 blur-2xl"
                  animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                />

                <span className="relative block w-52 sm:w-60">
                  {/* โบว์ */}
                  <span className="absolute -top-8 left-1/2 z-20 -translate-x-1/2 text-4xl drop-shadow-sm sm:-top-9 sm:text-5xl" aria-hidden="true">
                    🎀
                  </span>

                  {/* ฝากล่อง */}
                  <span className="relative z-10 mx-auto block h-9 w-full rounded-lg bg-gradient-to-b from-blush-300 to-blush-400 shadow-soft sm:h-11">
                    <span className="absolute inset-x-0 top-0 h-1.5 rounded-t-lg bg-white/40" />
                    <span className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-gradient-to-b from-lilac-200 to-lilac-300 sm:w-8" />
                  </span>

                  {/* ตัวกล่อง */}
                  <span className="relative mx-auto -mt-1 block h-32 w-[86%] rounded-b-2xl rounded-t-sm bg-gradient-to-b from-blush-400 to-blush-500 shadow-polaroid sm:h-36">
                    {/* ริบบิ้นแนวตั้ง */}
                    <span className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-gradient-to-b from-lilac-200 to-lilac-300 sm:w-8" />
                    {/* ริบบิ้นแนวนอน */}
                    <span className="absolute inset-x-0 top-1/2 h-5 -translate-y-1/2 bg-lilac-200/70 sm:h-6" />
                    {/* เงาด้านใน */}
                    <span className="absolute inset-y-0 right-0 w-4 rounded-br-2xl bg-blush-700/10" />
                  </span>
                </span>

                <span className="mt-5 block text-center text-sm font-semibold uppercase tracking-[0.28em] text-blush-500">
                  {birthday.gift.label}
                </span>

                {!reduced && (
                  <motion.span
                    className="pointer-events-none absolute inset-x-0 -bottom-8 text-center text-xs text-blush-400"
                    animate={{ y: [0, 4, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    แตะที่กล่องเลย 👆
                  </motion.span>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="reveal"
                className="relative w-full"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 190, damping: 20 }}
              >
                <div className="glass-strong relative overflow-hidden rounded-[1.75rem] px-6 py-9 text-center shadow-glow sm:px-10 sm:py-12">
                  <motion.p
                    className="font-display text-3xl sm:text-4xl"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                  >
                    <GradientText text={birthday.gift.revealTitle} />
                  </motion.p>

                  {birthday.gift.innerImage && (
                    <motion.img
                      src={asset(birthday.gift.innerImage)}
                      alt="ของขวัญข้างในกล่อง"
                      loading="lazy"
                      decoding="async"
                      className="mx-auto mt-6 max-h-64 w-auto max-w-full rounded-2xl object-cover shadow-polaroid"
                      initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                    />
                  )}

                  <motion.p
                    className="mt-7 font-script text-2xl text-blush-600 sm:text-3xl"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                  >
                    {birthday.gift.revealMessage}
                  </motion.p>

                  <motion.p
                    className="mt-3 text-sm text-blush-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.6 }}
                  >
                    {birthday.gift.innerNote}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
