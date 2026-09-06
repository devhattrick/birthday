/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff7f9',
          100: '#ffeef3',
          200: '#ffd9e4',
          300: '#ffbcd0',
          400: '#ff93b3',
          500: '#f96f9b',
          600: '#e6497e',
          700: '#c33566',
        },
        lilac: {
          100: '#f4eeff',
          200: '#e6dcff',
          300: '#d3c2ff',
          400: '#b9a1f7',
          500: '#9b7cec',
          600: '#7d5cd6',
        },
        peach: {
          100: '#fff2e9',
          200: '#ffe0cc',
          300: '#ffc9a8',
          400: '#ffab7d',
        },
        cream: '#fffaf6',
      },
      fontFamily: {
        /*
         * ชุดฟอนต์ (แก้ที่นี่ + <link> ใน index.html ถ้าอยากเปลี่ยน เช่นกลับไปใช้ Kanit)
         * - sans    : Noto Sans Thai  -> เนื้อหาทั้งไทยและอังกฤษ อ่านสบาย วรรณยุกต์ไทยไม่ตีกัน
         * - display : Playfair Display -> หัวข้อภาษาอังกฤษ ให้ความรู้สึก elegant แบบการ์ดงานแต่ง
         *             (ถ้าหัวข้อเป็นภาษาไทยจะ fallback ไป Noto Sans Thai อัตโนมัติ)
         * - script  : Dancing Script   -> ลายมือหวาน ๆ สำหรับประโยคสั้น ๆ
         */
        sans: ['"Noto Sans Thai"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', '"Noto Sans Thai"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', '"Noto Sans Thai"', 'cursive'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(233, 90, 140, 0.25)',
        glow: '0 0 60px -10px rgba(255, 147, 179, 0.55)',
        polaroid: '0 18px 40px -18px rgba(120, 60, 90, 0.45)',
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'float-slow': 'floatY 9s ease-in-out infinite',
        'float-med': 'floatY 6s ease-in-out infinite',
        twinkle: 'twinkle 2.6s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
        flicker: 'flicker 1.1s ease-in-out infinite',
        shimmer: 'shimmer 3.2s linear infinite',
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-16px,0)' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.15', transform: 'scale(0.7)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        flicker: {
          '0%,100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '35%': { transform: 'scale(0.92) translateY(1px) rotate(-3deg)', opacity: '0.88' },
          '70%': { transform: 'scale(1.07) translateY(-1px) rotate(3deg)', opacity: '0.96' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
    },
  },
  plugins: [],
}
