import { useMemo } from 'react'

/**
 * ปัญหา: `background-clip: text` (คลาส .text-gradient) จะ clip **emoji** ด้วย
 * ทำให้ ❤️ / ✨ / 📸 กลายเป็นก้อนสีทึบ
 *
 * วิธีแก้: แยก emoji ออกมาเป็น <span class="emoji"> ที่ reset text-fill กลับเป็นสีเดิม
 * แล้วครอบเฉพาะส่วนที่เป็นตัวอักษรด้วย gradient
 */
const EMOJI_SOURCE =
  '(\\p{Extended_Pictographic}\\uFE0F?(?:\\u200D\\p{Extended_Pictographic}\\uFE0F?)*[\\u{1F3FB}-\\u{1F3FF}]?)'

/** ใช้แยกข้อความ (มี flag g) */
const SPLIT_RE = new RegExp(EMOJI_SOURCE, 'gu')
/** ใช้ทดสอบทีละชิ้น — แยก instance กันเพราะ regex ที่มี flag g เก็บ lastIndex ไว้ */
const TEST_RE = new RegExp(`^${EMOJI_SOURCE}$`, 'u')

export function splitEmoji(text: string): string[] {
  return text.split(SPLIT_RE).filter((s) => s.length > 0)
}

type Props = {
  text: string
  className?: string
}

/** หัวข้อที่เป็น gradient แต่ emoji ยังคงสีเดิม */
export function GradientText({ text, className = '' }: Props) {
  const parts = useMemo(() => splitEmoji(text), [text])

  return (
    <span className={className}>
      {parts.map((part, i) =>
        TEST_RE.test(part) ? (
          <span key={i} className="emoji">
            {part}
          </span>
        ) : (
          <span key={i} className="text-gradient">
            {part}
          </span>
        ),
      )}
    </span>
  )
}
