import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { birthday } from '../data/birthday'
import { useBirthday } from '../hooks/useBirthday'
import { Balloons } from './Balloons'
import { sideCannons } from './Confetti'
import { FloatingHearts } from './FloatingHearts'
import { GradientText } from './GradientText'
import { Section } from './Section'
import { Sparkles } from './Sparkles'

const boxStyle =
  'glass rounded-2xl px-3 py-3 text-center shadow-soft sm:rounded-3xl sm:px-5 sm:py-4'

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className={boxStyle}>
      <div className="font-display text-2xl tabular-nums text-blush-600 sm:text-4xl">
        {String(value).padStart(2, '0')}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-blush-400 sm:text-xs">{label}</div>
    </div>
  )
}

/** Section แรกหลังเปิดเซอร์ไพรส์ — โชว์วันเกิด อายุ และ countdown (ถ้ายังไม่ถึงวัน) */
export function BirthdayHero() {
  const { status, isBirthdayToday, currentAge, turningAge, countdown, nextBirthdayLabel } = useBirthday()
  const reduced = useReducedMotion()

  // ยิง confetti ต้อนรับครั้งเดียวตอนเข้า section (เฉพาะวันเกิดจริง)
  useEffect(() => {
    if (!isBirthdayToday) return
    const id = window.setTimeout(() => sideCannons(2000), 600)
    return () => window.clearTimeout(id)
  }, [isBirthdayToday])

  const headline =
    status === 'today'
      ? birthday.hero.onBirthday
      : status === 'before'
        ? birthday.hero.beforeBirthday
        : birthday.hero.afterBirthday

  return (
    <Section id="hero" className="flex min-h-[92svh] items-center overflow-hidden">
      <Sparkles count={22} color="#ffd9e4" />
      <Balloons count={6} />
      <FloatingHearts count={10} />

      <div className="section-shell z-10 text-center">
        <motion.p
          className="font-script text-2xl text-blush-500 sm:text-3xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {headline}
        </motion.p>

        <motion.h1
          className="mt-3 font-display text-5xl leading-[1.05] sm:text-7xl md:text-8xl"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <GradientText text={birthday.greeting} />
        </motion.h1>

        <motion.div
          className="mx-auto mt-8 flex max-w-md flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="font-display text-2xl text-blush-600 sm:text-3xl">7 September</p>
          <p className="text-sm tracking-[0.2em] text-blush-400 sm:text-base">BORN IN 2003</p>
        </motion.div>

        {/* วงกลมอายุ */}
        <motion.div
          className="relative mx-auto mt-10 flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.42 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blush-200/70 to-lilac-200/70 blur-xl"
            animate={reduced ? undefined : { scale: [1, 1.12, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <div className="glass-strong relative flex h-full w-full flex-col items-center justify-center rounded-full shadow-glow">
            <span className="font-display text-5xl text-gradient sm:text-6xl">
              {isBirthdayToday ? turningAge : currentAge}
            </span>
            <span className="mt-0.5 text-[11px] uppercase tracking-[0.22em] text-blush-400 sm:text-xs">
              {isBirthdayToday ? 'years old today' : 'years old'}
            </span>
          </div>
        </motion.div>

        {isBirthdayToday ? (
          <motion.p
            className="mt-9 font-script text-3xl text-blush-500 sm:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {birthday.hero.todayLine}
          </motion.p>
        ) : (
          <motion.div
            className="mt-9"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-blush-400">
              เหลืออีกนิดเดียว · {nextBirthdayLabel}
            </p>
            <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-3">
              <TimeBox value={countdown.days} label="days" />
              <TimeBox value={countdown.hours} label="hrs" />
              <TimeBox value={countdown.minutes} label="min" />
              <TimeBox value={countdown.seconds} label="sec" />
            </div>
            <p className="mt-4 text-sm text-blush-400/90">
              อีกไม่นานก็จะครบ {turningAge} ปีแล้วนะ 🎂
            </p>
          </motion.div>
        )}

        <motion.p
          className="mx-auto mt-10 max-w-md text-sm text-blush-500/80 sm:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {birthday.birthDateLabel} — {birthday.hero.tagline}
        </motion.p>

        {/* scroll hint */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-2 text-blush-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.8 }}
          aria-hidden="true"
        >
          <span className="text-[11px] uppercase tracking-[0.24em]">scroll</span>
          <motion.div
            className="h-9 w-[22px] rounded-full border-2 border-blush-300/70 p-1"
            animate={reduced ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-blush-400"
              animate={reduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </Section>
  )
}
