import { motion, useReducedMotion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { birthday } from '../data/birthday'
import { GradientText } from './GradientText'
import { Section } from './Section'
import { Sparkles } from './Sparkles'

/**
 * การ์ดข้อความอวยพร — บรรทัดค่อย ๆ ปรากฏทีละบรรทัดแบบ stagger
 * ใช้ whileInView + once เพื่อให้ animate รอบเดียว
 */
export function LoveMessage() {
  const reduced = useReducedMotion()

  return (
    <Section id="message" className="overflow-hidden">
      <div className="section-shell">
        <div className="relative">
          {/* เรืองแสงหลังการ์ด */}
          <div
            className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blush-200/45 via-lilac-200/35 to-peach-200/45 blur-2xl"
            aria-hidden="true"
          />

          <motion.article
            className="glass-strong relative overflow-hidden rounded-[1.75rem] px-6 py-10 shadow-soft sm:rounded-[2.25rem] sm:px-12 sm:py-14"
            initial={{ opacity: 0, y: 30, rotateX: reduced ? 0 : 6 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Sparkles count={14} color="#ffd9e4" />

            <div className="relative text-center">
              <motion.div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blush-300 to-lilac-300 text-white shadow-soft"
                initial={{ scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
                aria-hidden="true"
              >
                <motion.span
                  animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart size={24} fill="currentColor" />
                </motion.span>
              </motion.div>

              <h2 className="font-display text-2xl sm:text-4xl">
                <GradientText text={birthday.loveMessage.title} />
              </h2>
            </div>

            <div className="mx-auto mt-9 max-w-2xl space-y-5 sm:mt-11 sm:space-y-6">
              {birthday.loveMessage.lines.map((line, i) => (
                <motion.p
                  key={line}
                  className="text-pretty text-center text-[15px] leading-relaxed text-blush-600/90 sm:text-lg sm:leading-loose"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, delay: reduced ? 0 : i * 0.12, ease: 'easeOut' }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-blush-400">
                {birthday.loveMessage.signature}
              </p>
              <p className="mt-1 font-script text-3xl text-blush-500 sm:text-4xl">
                {birthday.loveMessage.signedBy}
              </p>
            </motion.div>
          </motion.article>
        </div>
      </div>
    </Section>
  )
}
