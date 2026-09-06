import { memo, useMemo } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useReducedMotion } from '../hooks/useReducedMotion'

const COLORS = ['#ff93b3', '#b9a1f7', '#ffc9a8', '#f96f9b', '#d3c2ff']

/** ลูกโป่งลอยขึ้นช้า ๆ ใช้เฉพาะ Hero กับ Final Scene */
function BalloonsBase({ count = 7 }: { count?: number }) {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const total = isMobile ? 4 : count

  const balloons = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        id: i,
        left: 4 + Math.random() * 92,
        width: 30 + Math.random() * 26,
        duration: 17 + Math.random() * 12,
        delay: -Math.random() * 25,
        color: COLORS[i % COLORS.length],
        drift: (Math.random() - 0.5) * 70,
      })),
    [total],
  )

  if (reduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {balloons.map((b) => (
        <span
          key={b.id}
          className="absolute bottom-[-25%] gpu"
          style={
            {
              left: `${b.left}%`,
              animation: `balloon-rise ${b.duration}s linear ${b.delay}s infinite`,
              '--drift': `${b.drift}px`,
            } as React.CSSProperties
          }
        >
          <svg width={b.width} height={b.width * 1.6} viewBox="0 0 40 64" fill="none">
            <ellipse cx="20" cy="22" rx="17" ry="21" fill={b.color} opacity="0.75" />
            <ellipse cx="14" cy="14" rx="5" ry="7" fill="#fff" opacity="0.45" />
            <path d="M20 43 L17 47 L23 47 Z" fill={b.color} opacity="0.75" />
            <path d="M20 47 C24 52 16 56 20 63" stroke={b.color} strokeWidth="1.2" opacity="0.6" fill="none" />
          </svg>
        </span>
      ))}
    </div>
  )
}

export const Balloons = memo(BalloonsBase)
