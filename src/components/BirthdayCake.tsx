import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Cake, Mic, MicOff, Wind } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { birthday } from '../data/birthday'
import { useBirthday } from '../hooks/useBirthday'
import { burstConfetti, burstHearts } from './Confetti'
import { GradientText } from './GradientText'
import { Section, SectionHeading } from './Section'
import { Sparkles } from './Sparkles'

type Phase = 'idle' | 'wishing' | 'done'
type MicState = 'unsupported' | 'off' | 'listening' | 'denied'

/** ระดับเสียงที่ถือว่า "เป่า" (0-255 จาก AnalyserNode) */
const BLOW_THRESHOLD = 62
/** ต้องดังต่อเนื่องกี่เฟรมถึงจะนับ กันเสียงรบกวนแวบเดียว */
const BLOW_FRAMES = 8

/**
 * สร้าง path ของครีมย้อย: แถบด้านบนของชั้นเค้ก + หยดโค้ง ๆ ห้อยลงมา
 * เขียนเป็นฟังก์ชันเพราะจำนวนหยดต้องปรับตามความกว้างของแต่ละชั้น
 */
function frosting(x0: number, x1: number, y: number, drop: number, bumps: number) {
  const w = (x1 - x0) / bumps
  let d = `M ${x0} ${y - 10} H ${x1} V ${y}`
  for (let i = 0; i < bumps; i += 1) {
    d += ` q ${-w / 2} ${drop} ${-w} 0`
  }
  d += ' Z'
  return d
}

function Candle({ lit, index, reduced }: { lit: boolean; index: number; reduced: boolean }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: 14 }}>
      {/* เปลวไฟ / ควัน */}
      <div className="relative h-6 w-4">
        <AnimatePresence>
          {lit ? (
            <motion.span
              key="flame"
              className="absolute bottom-0 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle at 50% 68%, #fff6c9 0%, #ffc93f 42%, #ff8a3d 74%, rgba(255,120,60,0) 100%)',
                filter: 'blur(0.3px)',
                boxShadow: '0 0 14px 5px rgba(255,180,80,0.55)',
              }}
              initial={{ opacity: 0, scaleY: 0.4 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.2, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              {!reduced && (
                <span
                  className="absolute inset-0 animate-flicker rounded-full"
                  style={{ animationDelay: `${index * 0.11}s` }}
                />
              )}
            </motion.span>
          ) : (
            <motion.span
              key="smoke"
              className="absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blush-300/45 blur-[2px]"
              initial={{ opacity: 0.7, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -34, scale: 2.4, x: index % 2 ? 8 : -8 }}
              transition={{ duration: 2.1, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ไส้เทียน */}
      <span className="h-1.5 w-[2px] rounded bg-blush-700/60" />
      {/* แท่งเทียน */}
      <span
        className="h-10 w-[9px] rounded-sm sm:h-12"
        style={{
          background:
            index % 2
              ? 'repeating-linear-gradient(135deg,#ffffff 0 4px,#ff93b3 4px 8px)'
              : 'repeating-linear-gradient(135deg,#ffffff 0 4px,#b9a1f7 4px 8px)',
          boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.06)',
        }}
      />
    </div>
  )
}

export function BirthdayCake() {
  const { turningAge, isBirthdayToday, currentAge } = useBirthday()
  const reduced = useReducedMotion()

  const displayAge = isBirthdayToday ? turningAge : currentAge
  const candleCount = birthday.cake.candleCount ?? Math.max(3, Math.min(displayAge, 7))

  const [phase, setPhase] = useState<Phase>('idle')
  const [lit, setLit] = useState(true)
  const [micState, setMicState] = useState<MicState>('unsupported')

  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const supported =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof window !== 'undefined' &&
      !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
    setMicState(supported ? 'off' : 'unsupported')
  }, [])

  const stopMic = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    void ctxRef.current?.close()
    ctxRef.current = null
  }, [])

  const blowOut = useCallback(() => {
    setLit((wasLit) => {
      if (!wasLit) return wasLit
      setPhase('wishing')
      burstConfetti({ x: 0.5, y: 0.6 })
      burstHearts(30)
      window.setTimeout(() => setPhase('done'), 2200)
      return false
    })
    stopMic()
    setMicState((s) => (s === 'listening' ? 'off' : s))
  }, [stopMic])

  /** เปิดไมค์แล้วฟังระดับเสียง — ถ้าดังเกิน threshold ต่อเนื่อง = เป่า */
  const startMic = useCallback(async () => {
    if (micState === 'unsupported') return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      ctxRef.current = ctx
      // iOS/iPadOS สร้าง AudioContext มาในสถานะ 'suspended' ต้อง resume หลัง user gesture
      if (ctx.state === 'suspended') await ctx.resume()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)

      const data = new Uint8Array(analyser.frequencyBinCount)
      let hits = 0
      setMicState('listening')

      const tick = () => {
        analyser.getByteFrequencyData(data)
        // โฟกัสย่านความถี่ต่ำ-กลาง ซึ่งเป็นย่านของลมเป่า
        let sum = 0
        const bins = Math.floor(data.length * 0.35)
        for (let i = 0; i < bins; i += 1) sum += data[i]
        const avg = sum / bins

        hits = avg > BLOW_THRESHOLD ? hits + 1 : 0
        if (hits >= BLOW_FRAMES) {
          blowOut()
          return
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setMicState('denied')
    }
  }, [blowOut, micState])

  useEffect(() => stopMic, [stopMic])

  const relight = () => {
    setLit(true)
    setPhase('idle')
  }

  return (
    <Section id="cake" className="overflow-hidden">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Chapter 04"
          title={birthday.cake.title}
          subtitle={birthday.cake.subtitle}
        />

        <div className="relative mx-auto max-w-xl">
          <Sparkles count={lit ? 12 : 30} color="#ffe9b0" />

          {/* แสงเรืองจากเทียน */}
          <AnimatePresence>
            {lit && !reduced && (
              <motion.div
                className="pointer-events-none absolute left-1/2 top-2 h-44 w-44 -translate-x-1/2 rounded-full bg-amber-200/45 blur-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.45, 0.75, 0.45] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* เทียน */}
            <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-4">
              {Array.from({ length: candleCount }, (_, i) => (
                <Candle key={i} index={i} lit={lit} reduced={!!reduced} />
              ))}
            </div>

            {/* ตัวเค้ก — วาดด้วย SVG เพื่อให้สัดส่วนคงที่ทุกขนาดจอ */}
            <div className="relative -mt-1 w-[min(100%,20rem)] sm:w-[24rem]">
              <svg viewBox="0 34 240 124" className="w-full" role="img" aria-label="เค้กวันเกิด">
                <defs>
                  <linearGradient id="tierTop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd9e4" />
                    <stop offset="100%" stopColor="#ffb0c9" />
                  </linearGradient>
                  <linearGradient id="tierBottom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e6dcff" />
                    <stop offset="100%" stopColor="#c3aef7" />
                  </linearGradient>
                  <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.65" />
                  </linearGradient>
                </defs>

                {/* จาน */}
                <ellipse cx="120" cy="146" rx="112" ry="9" fill="url(#plate)" />
                <ellipse cx="120" cy="143" rx="96" ry="7" fill="#ffeef3" />

                {/* ชั้นล่าง */}
                <rect x="30" y="92" width="180" height="50" rx="12" fill="url(#tierBottom)" />
                <path
                  d={frosting(30, 210, 92, 12, 9)}
                  fill="#fffaf6"
                />
                {/* ของตกแต่งชั้นล่าง */}
                {[52, 90, 128, 166, 196].map((x, i) => (
                  <circle key={x} cx={x} cy={126} r={i % 2 ? 4 : 5} fill={i % 2 ? '#ffc9a8' : '#ff93b3'} opacity="0.85" />
                ))}

                {/* ชั้นบน */}
                <rect x="66" y="46" width="108" height="48" rx="10" fill="url(#tierTop)" />
                <path d={frosting(66, 174, 46, 11, 6)} fill="#fffaf6" />
                {/* ของตกแต่งชั้นบน */}
                {[86, 120, 154].map((x) => (
                  <circle key={x} cx={x} cy={80} r="4" fill="#f96f9b" opacity="0.7" />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* ─── ปุ่ม / ข้อความ ───────────────────────────── */}
          <div className="mt-10 flex min-h-[7.5rem] flex-col items-center justify-start gap-4">
            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div
                  key="controls"
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <motion.button
                    type="button"
                    onClick={blowOut}
                    className="btn-primary"
                    whileHover={reduced ? undefined : { scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wind size={19} aria-hidden="true" />
                    {birthday.cake.button}
                  </motion.button>

                  {micState !== 'unsupported' && (
                    <button
                      type="button"
                      onClick={micState === 'listening' ? stopMic : startMic}
                      className="btn-ghost"
                      aria-pressed={micState === 'listening'}
                    >
                      {micState === 'listening' ? <MicOff size={15} /> : <Mic size={15} />}
                      {micState === 'listening'
                        ? 'กำลังฟัง... เป่าเลย! 🌬️'
                        : micState === 'denied'
                          ? 'ไม่ได้รับสิทธิ์ไมค์ — กดปุ่มด้านบนแทนได้'
                          : birthday.cake.micButton}
                    </button>
                  )}
                </motion.div>
              )}

              {phase === 'wishing' && (
                <motion.p
                  key="wishing"
                  className="font-script text-3xl text-blush-500 sm:text-4xl"
                  initial={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6 }}
                >
                  {birthday.cake.wishing}
                </motion.p>
              )}

              {phase === 'done' && (
                <motion.div
                  key="done"
                  className="flex flex-col items-center gap-3 text-center"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <p className="font-script text-3xl sm:text-4xl">
                    <GradientText text={birthday.cake.wished} />
                  </p>
                  <button type="button" onClick={relight} className="btn-ghost">
                    <Cake size={15} />
                    จุดเทียนใหม่ แล้วเป่าอีกรอบ
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}
