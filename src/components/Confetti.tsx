import confetti from 'canvas-confetti'

const PALETTE = ['#ff93b3', '#f96f9b', '#e6497e', '#b9a1f7', '#ffc9a8', '#fff1f5', '#ffd9e4']

let enabled = true
/** ให้ App สั่งปิดทั้งหมดได้เมื่อผู้ใช้ตั้ง prefers-reduced-motion */
export function setConfettiEnabled(value: boolean) {
  enabled = value
}

type ConfettiShape = ReturnType<typeof confetti.shapeFromPath>

const HEART_PATH =
  'M12 21s-7.5-4.9-9.6-9.2C.6 8.2 2.4 4.5 6 3.6c2.1-.5 4.2.4 5.4 2.1C12.6 4 14.7 3.1 16.8 3.6c3.6.9 5.4 4.6 3.6 8.2C19.5 16.1 12 21 12 21z'

let cachedHeart: ConfettiShape | null = null
/** สร้าง shape หัวใจครั้งเดียวแล้ว cache ไว้ (shapeFromPath วาดลง canvas ทุกครั้งที่เรียก) */
function heart(): ConfettiShape {
  if (!cachedHeart) cachedHeart = confetti.shapeFromPath({ path: HEART_PATH })
  return cachedHeart
}

/** ระเบิด confetti จากกลางจอ (ใช้ตอนเป่าเทียน / เปิดกล่องของขวัญ) */
export function burstConfetti(origin = { x: 0.5, y: 0.55 }) {
  if (!enabled) return
  confetti({
    particleCount: 90,
    spread: 78,
    startVelocity: 42,
    scalar: 0.95,
    ticks: 190,
    colors: PALETTE,
    origin,
    disableForReducedMotion: true,
  })
  window.setTimeout(() => {
    confetti({
      particleCount: 55,
      spread: 110,
      startVelocity: 28,
      decay: 0.92,
      scalar: 1.15,
      colors: PALETTE,
      origin,
      disableForReducedMotion: true,
    })
  }, 160)
}

/** หัวใจลอยขึ้นจากขอบล่าง */
export function burstHearts(count = 34) {
  if (!enabled) return
  confetti({
    particleCount: count,
    spread: 120,
    startVelocity: 34,
    gravity: 0.5,
    decay: 0.94,
    scalar: 1.5,
    ticks: 260,
    shapes: [heart()],
    colors: ['#ff93b3', '#f96f9b', '#e6497e', '#ffd9e4'],
    origin: { x: 0.5, y: 0.85 },
    disableForReducedMotion: true,
  })
}

/** ยิงจากสองมุมล่าง แบบ celebration ยาว ๆ */
export function sideCannons(durationMs = 2200) {
  if (!enabled) return
  const end = Date.now() + durationMs
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 62,
      origin: { x: 0, y: 0.75 },
      colors: PALETTE,
      disableForReducedMotion: true,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 62,
      origin: { x: 1, y: 0.75 },
      colors: PALETTE,
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

/** พลุสำหรับ Final Scene */
export function fireworks(durationMs = 4000) {
  if (!enabled) return
  const end = Date.now() + durationMs
  const rand = (min: number, max: number) => Math.random() * (max - min) + min

  const frame = () => {
    confetti({
      particleCount: 26,
      startVelocity: 26,
      spread: 360,
      ticks: 70,
      scalar: 0.9,
      gravity: 0.85,
      colors: PALETTE,
      origin: { x: rand(0.15, 0.85), y: rand(0.15, 0.5) },
      disableForReducedMotion: true,
    })
    if (Date.now() < end) window.setTimeout(frame, 380)
  }
  frame()
}
