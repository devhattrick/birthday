import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUp, Heart } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { birthday } from '../data/birthday'
import { Balloons } from './Balloons'
import { fireworks, sideCannons } from './Confetti'
import { FloatingHearts } from './FloatingHearts'
import { GradientText } from './GradientText'
import { Section } from './Section'
import { Sparkles } from './Sparkles'

export function FinalMessage() {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()

  /** ยิงพลุ + confetti ครั้งเดียวตอน scroll มาถึงฉากจบ */
  useEffect(() => {
    if (!inView || reduced) return
    const a = window.setTimeout(() => sideCannons(2000), 300)
    const b = window.setTimeout(() => fireworks(4500), 900)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [inView, reduced])

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })

  return (
    <Section id="final" className="overflow-hidden">
      <div ref={ref} className="section-shell flex min-h-[92svh] flex-col items-center justify-center text-center">
        <Sparkles count={36} color="#ffffff" />
        <FloatingHearts count={16} />
        <Balloons count={6} />

        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <motion.div
            className="mb-6 text-blush-400"
            animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <Heart size={40} fill="currentColor" />
          </motion.div>

          <h2 className="max-w-3xl text-balance font-display text-4xl leading-tight sm:text-6xl md:text-7xl">
            <GradientText text={birthday.final.title} />
          </h2>

          <div className="mt-8 space-y-1">
            {birthday.final.lines.map((line, i) => (
              <motion.p
                key={line}
                className="font-script text-2xl text-blush-500 sm:text-3xl"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.15 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.6 }}
          >
            <div className="glass-strong rounded-full px-8 py-4 shadow-glow sm:px-12 sm:py-5">
              <p className="font-display text-2xl tracking-[0.12em] text-blush-600 sm:text-4xl">
                {birthday.birthDateDots}
              </p>
            </div>
          </motion.div>

          <motion.p
            className="mt-12 max-w-md text-balance text-base text-blush-500/85 sm:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.85 }}
          >
            {birthday.final.closing}
          </motion.p>

          <motion.p
            className="mt-4 font-script text-4xl sm:text-5xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.05 }}
          >
            <GradientText text={birthday.final.signOff} />
          </motion.p>

          <motion.button
            type="button"
            onClick={toTop}
            className="btn-ghost mt-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <ArrowUp size={15} aria-hidden="true" />
            {birthday.final.replay}
          </motion.button>

          <p className="mt-10 text-[11px] tracking-[0.2em] text-blush-300">MADE WITH ❤️ FOR YOU</p>
        </motion.div>
      </div>
    </Section>
  )
}
