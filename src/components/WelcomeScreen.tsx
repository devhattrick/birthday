import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Gift, Sparkles as SparkIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { birthday } from '../data/birthday'
import { burstHearts, sideCannons } from './Confetti'
import { FloatingHearts } from './FloatingHearts'
import { GradientText } from './GradientText'
import { Sparkles } from './Sparkles'

type Props = {
  onOpen: () => void
}

/**
 * หน้าแรกแบบ full screen
 * กดปุ่มแล้ว: hearts ระเบิด -> confetti สองข้าง -> fade + scale ออก -> เข้าสู่ journey
 */
export function WelcomeScreen({ onOpen }: Props) {
  const [leaving, setLeaving] = useState(false)
  const reduced = useReducedMotion()

  const handleOpen = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    burstHearts(42)
    sideCannons(1600)
    // ให้ animation ออกจบก่อนค่อย mount journey (กัน layout กระตุก)
    window.setTimeout(onOpen, reduced ? 120 : 900)
  }, [leaving, onOpen, reduced])

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="welcome"
          className="fixed inset-0 z-40 flex min-h-[100dvh] items-center justify-center overflow-hidden px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* พื้นหลังนุ่ม ๆ */}
          <div className="absolute inset-0 bg-gradient-to-br from-blush-100 via-cream to-lilac-100" />
          <motion.div
            className="absolute -left-24 top-[-10%] h-[26rem] w-[26rem] rounded-full bg-blush-200/50 blur-3xl"
            animate={reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.5, 0.75, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-24 bottom-[-12%] h-[28rem] w-[28rem] rounded-full bg-lilac-200/50 blur-3xl"
            animate={reduced ? undefined : { scale: [1.08, 1, 1.08], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />

          <Sparkles count={30} color="#ffffff" />
          <FloatingHearts count={12} />

          <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 13, delay: 0.15 }}
              className="mb-6 text-6xl drop-shadow-sm sm:text-7xl"
            >
              <motion.span
                className="inline-block"
                animate={reduced ? undefined : { y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎂
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="font-script text-3xl text-blush-500 sm:text-4xl"
            >
              {birthday.welcome.kicker}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.7 }}
              className="mt-1 font-display text-5xl leading-tight sm:text-6xl md:text-7xl"
            >
              <GradientText text={birthday.welcome.title} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              className="mt-6 max-w-sm text-balance text-base text-blush-500/85 sm:text-lg"
            >
              {birthday.welcome.subtitle}
            </motion.p>

            <motion.button
              type="button"
              onClick={handleOpen}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6 }}
              whileHover={reduced ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary mt-10 group"
            >
              <Gift size={20} className="transition-transform group-hover:rotate-12" aria-hidden="true" />
              <span>{birthday.welcome.cta}</span>
              {!reduced && (
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/70"
                  animate={{ scale: [1, 1.18], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              )}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-6 flex items-center gap-1.5 text-xs text-blush-400/90"
            >
              <SparkIcon size={13} aria-hidden="true" />
              {birthday.welcome.hint}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
