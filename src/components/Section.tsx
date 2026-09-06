import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { GradientText } from './GradientText'

type Props = {
  id?: string
  children: ReactNode
  className?: string
  /** ระยะเลื่อนขึ้นตอน reveal */
  offset?: number
  delay?: number
  as?: 'section' | 'div'
}

/**
 * Wrapper สำหรับ scroll reveal ที่ใช้ซ้ำทุก section
 * - viewport once = true -> animate แค่รอบเดียว ไม่ re-trigger ตอน scroll ขึ้นลง (ลด work)
 * - เคารพ prefers-reduced-motion อัตโนมัติผ่าน hook ของ framer
 */
export function Section({ id, children, className = '', offset = 28, delay = 0, as = 'section' }: Props) {
  const reduced = useFramerReducedMotion()
  const MotionTag = as === 'div' ? motion.div : motion.section

  return (
    <MotionTag
      id={id}
      className={`relative ${className}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

/** ใช้ reveal element ย่อย ๆ ข้างใน Section */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const reduced = useFramerReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

type HeadingProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, subtitle, className = '' }: HeadingProps) {
  return (
    <div className={`mb-10 text-center sm:mb-14 ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow mb-3">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
          <GradientText text={title} />
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-xl text-sm text-blush-500/80 sm:text-base">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
