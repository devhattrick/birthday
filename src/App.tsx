import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BirthdayCake } from './components/BirthdayCake'
import { BirthdayHero } from './components/BirthdayHero'
import { BirthdayVideo } from './components/BirthdayVideo'
import { setConfettiEnabled } from './components/Confetti'
import { FinalMessage } from './components/FinalMessage'
import { FloatingHearts } from './components/FloatingHearts'
import { GiftBox } from './components/GiftBox'
import { LoveMessage } from './components/LoveMessage'
import { MemoriesGallery } from './components/MemoriesGallery'
import { MusicPlayer } from './components/MusicPlayer'
import { WelcomeScreen } from './components/WelcomeScreen'

/** แถบบอกความคืบหน้าการ scroll ด้านบนสุด */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-gradient-to-r from-blush-400 via-blush-300 to-lilac-400"
    />
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const reduced = useReducedMotion()

  /** ปิด confetti ทั้งหมดถ้าผู้ใช้ตั้งค่า prefers-reduced-motion */
  useEffect(() => {
    setConfettiEnabled(!reduced)
  }, [reduced])

  /** ล็อกไม่ให้ scroll ระหว่างยังอยู่หน้า Welcome */
  useEffect(() => {
    document.body.style.overflow = started ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [started])

  return (
    <>
      {!started && <WelcomeScreen onOpen={() => setStarted(true)} />}

      <MusicPlayer active={started} />

      <AnimatePresence>
        {started && (
          <motion.main
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative"
          >
            <ScrollProgress />

            {/* particle layer ที่อยู่หลัง content ทั้งหน้า */}
            <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
              <FloatingHearts count={8} />
            </div>

            <div className="relative z-10">
              <BirthdayHero />
              <LoveMessage />
              <MemoriesGallery />
              <BirthdayCake />
              <GiftBox />
              <BirthdayVideo />
              <FinalMessage />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
