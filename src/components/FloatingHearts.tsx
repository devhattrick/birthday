import { memo, useMemo } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  /** จำนวนหัวใจบน desktop (mobile จะลดลงครึ่งหนึ่งอัตโนมัติ) */
  count?: number
  className?: string
}

const GLYPHS = ['❤️', '💕', '💗', '🩷', '💖']

/**
 * Layer หัวใจลอยขึ้นแบบ pure CSS animation
 * ตั้งใจไม่ใช้ Framer Motion เพราะเป็น loop ยาว ๆ ที่ไม่ต้องคุมด้วย JS
 * -> ทำงานบน compositor thread อย่างเดียว (transform/opacity) จึงไม่กระตุกบนมือถือ
 */
function FloatingHeartsBase({ count = 14, className = '' }: Props) {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const total = isMobile ? Math.ceil(count / 2) : count

  const hearts = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 20,
        duration: 11 + Math.random() * 12,
        delay: -Math.random() * 20,
        drift: (Math.random() - 0.5) * 90,
        opacity: 0.28 + Math.random() * 0.4,
        glyph: GLYPHS[i % GLYPHS.length],
      })),
    [total],
  )

  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-12%] select-none gpu"
          style={
            {
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              opacity: h.opacity,
              animation: `heart-rise ${h.duration}s linear ${h.delay}s infinite`,
              '--drift': `${h.drift}px`,
            } as React.CSSProperties
          }
        >
          {h.glyph}
        </span>
      ))}
    </div>
  )
}

export const FloatingHearts = memo(FloatingHeartsBase)
