import { memo, useMemo } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  count?: number
  className?: string
  /** สีของประกาย */
  color?: string
}

/** ประกายดาวแบบ CSS ล้วน (twinkle) — เบามาก วางทับ section ไหนก็ได้ */
function SparklesBase({ count = 26, className = '', color = '#ffffff' }: Props) {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const total = isMobile ? Math.ceil(count * 0.55) : count

  const stars = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 1.8 + Math.random() * 2.8,
        delay: Math.random() * 4,
      })),
    [total],
  )

  if (reduced) return null

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full gpu animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: color,
            boxShadow: `0 0 ${s.size * 3}px ${s.size / 1.4}px ${color}`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export const Sparkles = memo(SparklesBase)
