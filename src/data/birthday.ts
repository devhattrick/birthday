/**
 * ─────────────────────────────────────────────────────────────
 *  ไฟล์เดียวที่ต้องแก้เวลาจะเปลี่ยนเนื้อหาเว็บ
 *  ทุก component อ่านค่าจากที่นี่ที่เดียว
 * ─────────────────────────────────────────────────────────────
 */

export type Memory = {
  /** path ของรูปใน /public (เขียนแบบขึ้นต้นด้วย / ได้เลย ระบบจะเติม base ให้เอง) */
  image: string;
  caption: string;
  /** ข้อความเล็ก ๆ ใต้ caption เช่น วันที่หรือสถานที่ */
  note?: string;
};

export type VideoItem = {
  src: string;
  title: string;
  caption?: string;
  /** รูป poster (ถ้ามี) จะช่วยให้ไม่ต้องโหลดวิดีโอก่อนกดเล่น */
  poster?: string;
};

export const birthday = {
  /** ─── ตัวตน ─────────────────────────────────────────── */
  name: "BaBy",
  greeting: "Happy Birthday, BaBy",

  /** ─── วันเกิด (เดือนเป็นเลข 1-12) ────────────────────── */
  birthDate: { year: 2003, month: 9, day: 7 },
  /** ใช้โชว์เป็นข้อความสวย ๆ */
  birthDateLabel: "7 September 2003",
  birthDateDots: "7 • 09 • 2003",

  /** ─── Welcome Screen ────────────────────────────────── */
  welcome: {
    kicker: "Happy Birthday",
    title: "BaBy ❤️",
    subtitle: "I made something special for you...",
    cta: "Open Your Birthday Surprise 🎁",
    hint: "ใส่หูฟังแล้วเปิดเสียงด้วยนะ 🎧",
  },

  /** ─── Hero / Countdown ──────────────────────────────── */
  hero: {
    onBirthday: "Your special day has arrived! 🎉",
    beforeBirthday: "Counting down to your day... 🎈",
    afterBirthday: "Still celebrating you ❤️",
    todayLine: "Today is all about you ❤️",
    tagline: "The day someone very special was born.",
  },

  /** ─── Love Message (แสดงทีละบรรทัด) ─────────────────── */
  loveMessage: {
    title: "A Little Message For You 💌",
    lines: [
      "Happy Birthday to someone who has become a really special part of my days. 🤍",
      "Even though we haven't known each other for that long, I'm really glad our paths crossed.",
      "Thank you for all the conversations, smiles, laughs, and little moments we've shared so far.",
      "I hope your birthday is filled with happiness, and I hope this new year of your life brings you lots of good things, success, good health, and beautiful moments.",
      "And who knows… maybe we'll have many more good memories to make together. ☺️",
      "Happy Birthday! 🎂✨",
      "I hope you have the best day. 🤍",
    ],
    signature: "From HATTRICK",
    signedBy: "✨🎂 HBD Kub Baby 🤍✨",
  },

  /** ─── Memories Gallery ──────────────────────────────── */
  memoriesTitle: "Our Little Memories 📸",
  memoriesSubtitle: "ถ่ายรูปกันน้้อยไปนิด 🤓",
  memories: [
    {
      image: "/images/photo1.jpg",
      caption: "Our favorite moment ❤️",
      note: "ยิ้มอยู่ละสิ ฮั่นแหนะ 😜",
    },
    {
      image: "/images/photo2.jpg",
      caption: "Just us being us 🥰",
      note: "ไม่ต้องไปไหนไกล อยู่ด้วยกันก็สนุกแล้วไหมนะ 😂",
    },
    {
      image: "/images/photo3.jpg",
      caption: "A day I never want to forget ✨",
      note: "เขินๆหน่อยนะ 🫪",
    },
  ] satisfies Memory[],

  /** ─── Birthday Cake ─────────────────────────────────── */
  cake: {
    title: "Make a Wish ✨",
    subtitle: "หลับตา ตั้งใจอธิษฐาน แล้วเป่าเทียนเลย",
    button: "Blow the Candles 🎂",
    micButton: "เป่าใส่ไมค์ก็ได้นะ 🎤",
    wishing: "Make a wish... ✨",
    wished: "I hope your wish comes true. ❤️",
    /** จำนวนเทียน — ปล่อย null ให้คำนวณจากอายุ (สูงสุด 12 เล่มเพื่อความสวย) */
    candleCount: null as number | null,
  },

  /** ─── Gift Box ──────────────────────────────────────── */
  gift: {
    teaser: "There's one more surprise...",
    label: "Open Me",
    revealTitle: "Surprise! ❤️",
    revealMessage: "You are my favorite gift in life.",
    /** ใส่ path รูปเพื่อโชว์รูปในกล่อง หรือปล่อย null ถ้าอยากได้แค่ข้อความ */
    innerImage: "/images/photo2.jpg" as string | null,
    innerNote: "และของขวัญชิ้นนี้...",
  },

  /** ─── Videos ────────────────────────────────────────── */
  videoTitle: "A Little Video For You 🎥",
  videoSubtitle: "กดเล่นแล้วเปิดเสียงด้วยนะ",
  videos: [
    {
      src: "/videos/video1.mp4",
      title: "For you ❤️",
      caption: "คลิปแรกของเราไหมน้า",
    },
    {
      src: "/videos/video2.mp4",
      title: "One more ✨",
      caption: "อีกมุมนึงของวันนั้น",
    },
    {
      src: "/videos/video3.mp4",
      title: "And this one 🎬",
      caption: "เก็บไว้ดูด้วยกันนะ",
    },
  ] satisfies VideoItem[],

  /** ─── Music ─────────────────────────────────────────── */
  music: {
    /**
     * ลำดับการเล่น:
     * 1) ถ้ามีไฟล์ /public/audio/birthday-song.mp3 -> ใช้ไฟล์นั้น (ลื่นที่สุด)
     * 2) ถ้าไม่มี -> เล่นจาก YouTube ผ่าน IFrame API (ต้องต่อเน็ต)
     */
    localSrc: "/audio/birthday-song.mp3",
    youtubeId: "nl62hhiBMOM",
    youtubeStartAt: 20,
    title: "Our song",
    volume: 0.45,
  },

  /** ─── Final Scene ───────────────────────────────────── */
  final: {
    title: "Happy Birthday, BaBy ❤️",
    lines: ["Another year older,", "another year more amazing."],
    closing: "Thank you for being part of my life.",
    signOff: "ดีใจที่ได้เจอน้า ❤️",
    replay: "ดูอีกรอบ 💫",
  },
} as const;

export type BirthdayConfig = typeof birthday;
