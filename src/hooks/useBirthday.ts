import { useEffect, useMemo, useState } from 'react'
import { birthday } from '../data/birthday'

export type BirthdayStatus = 'before' | 'today' | 'after'

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** วันเกิดรอบถัดไป (หรือรอบวันนี้ ถ้าวันนี้คือวันเกิดพอดี) */
function nextBirthday(from: Date) {
  const { month, day } = birthday.birthDate
  const thisYear = new Date(from.getFullYear(), month - 1, day)
  if (startOfDay(thisYear) >= startOfDay(from)) return thisYear
  return new Date(from.getFullYear() + 1, month - 1, day)
}

/** อายุที่ครบแล้ว ณ วันที่ที่ให้มา */
function ageAt(date: Date) {
  const { year, month, day } = birthday.birthDate
  let age = date.getFullYear() - year
  const hadBirthday =
    date.getMonth() + 1 > month || (date.getMonth() + 1 === month && date.getDate() >= day)
  if (!hadBirthday) age -= 1
  return age
}

function diff(target: Date, now: Date): Countdown {
  const total = Math.max(0, target.getTime() - now.getTime())
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor(total / 3_600_000) % 24,
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1000) % 60,
  }
}

/**
 * คำนวณอายุ / สถานะวันเกิด / countdown แบบ real-time
 * เดิน timer แค่ตอนที่ยังไม่ถึงวันเกิดเท่านั้น เพื่อไม่ให้ re-render ทิ้ง ๆ ขว้าง ๆ
 */
export function useBirthday() {
  const [now, setNow] = useState(() => new Date())

  const status: BirthdayStatus = useMemo(() => {
    const { month, day } = birthday.birthDate
    const isToday = now.getMonth() + 1 === month && now.getDate() === day
    if (isToday) return 'today'
    const target = new Date(now.getFullYear(), month - 1, day)
    return startOfDay(target) > startOfDay(now) ? 'before' : 'after'
  }, [now])

  useEffect(() => {
    if (status === 'today') return
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [status])

  return useMemo(() => {
    const target = nextBirthday(now)
    const currentAge = ageAt(now)
    return {
      now,
      status,
      isBirthdayToday: status === 'today',
      /** อายุที่ครบแล้ว ณ วันนี้ */
      currentAge,
      /** อายุที่จะครบในวันเกิดรอบถัดไป */
      turningAge: status === 'today' ? currentAge : currentAge + 1,
      countdown: diff(target, now),
      nextBirthdayLabel: `${birthday.birthDate.day} ${MONTHS[birthday.birthDate.month - 1]} ${target.getFullYear()}`,
      birthMonthLabel: MONTHS[birthday.birthDate.month - 1],
    }
  }, [now, status])
}
