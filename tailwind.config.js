/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // iM뱅크 민트 (2024 리브랜딩 메인 컬러)
        im: {
          50: "#e9fbf6",
          100: "#c8f5e9",
          200: "#94ebd6",
          300: "#5bdcc1",
          400: "#2bc8aa",
          500: "#10b89c",
          600: "#069483",
          700: "#0a766a",
          800: "#0c5d55",
          900: "#0d4d47",
        },
      },
    },
  },
  plugins: [],
}
