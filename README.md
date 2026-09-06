# 🎂 Happy Birthday — Interactive Birthday Website

เว็บเซอร์ไพรส์วันเกิดแบบ interactive สร้างด้วย **Vite + React + TypeScript + Tailwind CSS + Framer Motion**
เป็น static site ล้วน ไม่มี backend ไม่มี database

---

## 1. Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Build tool | Vite 5 |
| UI | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 + CSS keyframes |
| Icons | lucide-react |
| Confetti | canvas-confetti |
| Media | HTML5 `<audio>` / `<video>` + YouTube IFrame API (fallback ของเพลง) |
| Deploy | GitHub Pages ผ่าน GitHub Actions |

---

## 2. รันบนเครื่องตัวเอง

```bash
npm install      # ติดตั้ง dependencies
npm run dev      # เปิด dev server ที่ http://localhost:5173
npm run build    # build ไปที่ dist/
npm run preview  # ลองเปิด production build ที่ build แล้ว
npm run lint     # ตรวจ TypeScript อย่างเดียว (tsc --noEmit)
```

> เปิดจากมือถือในวง Wi-Fi เดียวกัน: `npm run dev -- --host` แล้วเข้าที่ `http://<ip-เครื่อง>:5173`
> (ฟีเจอร์ไมโครโฟนตอนเป่าเทียนต้องใช้ `https` หรือ `localhost` เท่านั้น — บนมือถือให้ใช้ URL ของ GitHub Pages)

---

## 3. แก้เนื้อหาได้ที่ไฟล์เดียว

ทุกข้อความ / รูป / วิดีโอ / เพลง อยู่ใน **`src/data/birthday.ts`** ที่เดียว
ไม่ต้องไปแก้ component

| อยากแก้ | แก้ที่ key |
|---|---|
| ชื่อแฟน / คำเรียก | `name`, `greeting`, `welcome.title` |
| วันเกิด (ใช้คำนวณอายุ + countdown) | `birthDate`, `birthDateLabel`, `birthDateDots` |
| ข้อความหน้าแรก | `welcome` |
| ข้อความอวยพร (ทีละบรรทัด) | `loveMessage.lines` |
| รูปใน Gallery | `memories` |
| เค้ก / จำนวนเทียน | `cake` (ตั้ง `candleCount` เป็นตัวเลขเพื่อ fix จำนวนเทียน) |
| กล่องของขวัญ | `gift` |
| วิดีโอ | `videos` |
| เพลง | `music` |
| ฉากจบ | `final` |

### เพิ่มรูป

1. วางไฟล์ไว้ที่ `public/images/`
2. เพิ่ม object เข้าไปใน array `memories`

```ts
memories: [
  { image: '/images/photo4.jpg', caption: 'Our new memory ❤️', note: 'คำบรรยายเล็ก ๆ' },
]
```

> เขียน path ขึ้นต้นด้วย `/` ได้เลย — ฟังก์ชัน `asset()` จะเติม base path ให้เองตอนขึ้น GitHub Pages

### เพิ่มวิดีโอ

วางไฟล์ที่ `public/videos/` แล้วเพิ่มใน array `videos`
(ใส่ `poster` เป็น path รูปได้ ถ้าอยากให้มีภาพปกก่อนกดเล่น)

### เปลี่ยนเพลง

ลำดับการเลือกแหล่งเสียงของ `MusicPlayer`:

1. ถ้ามีไฟล์ **`public/audio/birthday-song.mp3`** → ใช้ไฟล์นั้น (ลื่นที่สุด ไม่ต้องต่อเน็ต)
2. ถ้าไม่มี → เล่นจาก **YouTube** ตาม `music.youtubeId` (ค่าปัจจุบันตั้งไว้แล้ว)
3. ถ้าทั้งคู่เล่นไม่ได้ → ซ่อนปุ่มเพลงไปเลย ไม่มี error ค้างหน้าจอ

> เพลงจะเริ่มเล่น **หลังผู้ใช้กดปุ่ม "Open Your Birthday Surprise"** เท่านั้น
> เพราะทุก browser บล็อก autoplay เสียงก่อน user interaction

### เปลี่ยนฟอนต์

แก้ 2 ที่ให้ตรงกัน:

1. `<link>` ของ Google Fonts ใน `index.html`
2. `theme.extend.fontFamily` ใน `tailwind.config.js`

ปัจจุบันใช้: **Playfair Display** (หัวข้ออังกฤษ) + **Noto Sans Thai** (เนื้อหา/ภาษาไทย) + **Dancing Script** (ลายมือ)

---

## 4. โครงสร้างโปรเจกต์

```
src/
├── components/
│   ├── WelcomeScreen.tsx     # หน้าแรก + ปุ่มเปิดเซอร์ไพรส์
│   ├── BirthdayHero.tsx      # อายุ + countdown (คำนวณอัตโนมัติ)
│   ├── LoveMessage.tsx       # การ์ดข้อความ reveal ทีละบรรทัด
│   ├── MemoriesGallery.tsx   # polaroid masonry + lightbox
│   ├── BirthdayCake.tsx      # เค้ก SVG + เป่าเทียน (ปุ่ม / ไมโครโฟน)
│   ├── GiftBox.tsx           # กล่องของขวัญสั่น + เปิด
│   ├── BirthdayVideo.tsx     # การ์ดวิดีโอ lazy load
│   ├── MusicPlayer.tsx       # ปุ่มเพลงลอย (mp3 -> YouTube fallback)
│   ├── FinalMessage.tsx      # ฉากจบ + พลุ
│   ├── FloatingHearts.tsx    # หัวใจลอย (CSS animation)
│   ├── Sparkles.tsx          # ประกาย (CSS animation)
│   ├── Balloons.tsx          # ลูกโป่ง (CSS animation)
│   ├── Confetti.tsx          # helper ของ canvas-confetti
│   ├── GradientText.tsx      # หัวข้อ gradient ที่ emoji ไม่โดน clip
│   └── Section.tsx           # scroll reveal ที่ใช้ซ้ำทุก section
├── data/birthday.ts          # ⭐ config ทั้งหมดอยู่ที่นี่
├── hooks/
│   ├── useBirthday.ts        # อายุ / สถานะวันเกิด / countdown
│   ├── useAsset.ts           # แปลง path ให้ทำงานได้ทั้ง dev และ GitHub Pages
│   ├── useReducedMotion.ts   # prefers-reduced-motion
│   ├── useIsMobile.ts        # ลดจำนวน particle บนจอเล็ก
│   └── useYouTubeApi.ts      # โหลด YouTube IFrame API ครั้งเดียว
├── App.tsx
├── main.tsx
└── index.css

public/
├── images/   photo1.jpg photo2.jpg photo3.jpg
├── videos/   video1.mp4 video2.mp4 video3.mp4
└── audio/    (วาง birthday-song.mp3 ที่นี่ถ้ามี)
```

---

## 5. Deploy ขึ้น GitHub Pages

Workflow อยู่ที่ `.github/workflows/deploy.yml` แล้ว

1. สร้าง repo บน GitHub แล้ว push code ขึ้นไป (branch `main`, `master` หรือ `production`)
2. ไปที่ **Settings → Pages → Build and deployment → Source** เลือก **GitHub Actions**
3. push อีกครั้ง (หรือกด Run workflow เอง) — Actions จะ build แล้ว deploy ให้อัตโนมัติ
4. เว็บจะขึ้นที่ `https://<username>.github.io/<repo-name>/`

### base path ทำงานยังไง

- `vite.config.ts` อ่าน `base` จาก env var `BASE_PATH` (default `/` สำหรับ dev)
- workflow คำนวณ `BASE_PATH` จาก `GITHUB_REPOSITORY` ให้เอง → **ไม่ต้อง hardcode username หรือชื่อ repo**
  - repo ทั่วไป → `/<repo-name>/`
  - repo ชื่อ `<username>.github.io` → `/`
- ทุก asset ใน component เรียกผ่าน `asset()` ซึ่งเติม `import.meta.env.BASE_URL` ให้ → รูป/วิดีโอ/เสียงไม่พัง
- workflow สร้างไฟล์ `.nojekyll` ให้ด้วย เพื่อไม่ให้ Pages ทิ้งโฟลเดอร์ที่ขึ้นต้นด้วย `_`

---

## 6. Accessibility & Performance

- ปุ่ม icon ทุกตัวมี `aria-label`, ปุ่ม toggle มี `aria-pressed`
- Lightbox: `role="dialog"` + `aria-modal`, ปิดด้วย `Esc`, เปลี่ยนรูปด้วยลูกศรซ้าย/ขวา, ล็อก body scroll
- รองรับ `prefers-reduced-motion` — ปิด particle / confetti / animation ทั้งหมด
- Focus ring มองเห็นชัด (`:focus-visible`)
- รูปใช้ `loading="lazy"` + `decoding="async"`
- วิดีโอ `preload="metadata"` และยังไม่ใส่ `src` จนกว่าจะกดเล่น → ไม่กินแบนด์วิดท์ตอนโหลดหน้า
- Particle เป็น CSS animation (`transform` / `opacity` เท่านั้น) ไม่ใช้ JS ต่อเฟรม + ลดจำนวนลงอัตโนมัติบนจอเล็ก
- Scroll reveal ใช้ `viewport={{ once: true }}` — animate รอบเดียว ไม่ทำงานซ้ำตอน scroll ขึ้นลง
- แยก bundle เป็น `vendor` / `motion` / `index` เพื่อให้ cache ได้ดี

---

## 7. รองรับ iPhone / iPad

- Mobile-first ทุก breakpoint และไม่มี horizontal scroll (`overflow-x: hidden` + ตรวจแล้วที่ 390 / 834 / 1180 px)
- ใช้ `dvh` / `svh` แทน `vh` — ความสูงไม่เพี้ยนตอนแถบ address bar ของ Safari ยุบ/ขยาย
- `viewport-fit=cover` + `env(safe-area-inset-*)` — ปุ่มเพลงไม่โดน home indicator บัง
- ไม่ใช้ `background-attachment: fixed` (iOS ไม่รองรับ) เปลี่ยนเป็น layer `position: fixed` แทน
- `<video playsInline webkit-playsinline>` — เล่นในหน้าเว็บ ไม่เด้งเป็น fullscreen บน iPhone
- `AudioContext.resume()` หลัง user gesture — ฟีเจอร์เป่าไมค์ทำงานบน iOS ได้
- ปุ่มทุกตัวสูงอย่างน้อย 44px ตาม Apple HIG
- เพิ่ม meta `apple-mobile-web-app-*` — Add to Home Screen แล้วเปิดได้เต็มจอ

---

## 8. หมายเหตุ

- ไฟล์ `public/audio/birthday-song.mp3` ยังไม่มี — ตอนนี้เพลงเล่นผ่าน YouTube แทน
  ถ้าอยากให้ลื่นและเล่นแบบ offline ได้ ให้วางไฟล์ mp3 ตามชื่อนั้น แล้วระบบจะสลับมาใช้เองอัตโนมัติ
- การเป่าเทียนด้วยไมโครโฟนต้องรันบน `https` หรือ `localhost` และผู้ใช้ต้องกดอนุญาต
  ถ้าไม่รองรับ / ไม่อนุญาต ยังมีปุ่ม **Blow the Candles** ให้กดเสมอ
