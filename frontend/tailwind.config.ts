/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    darkMode: 'className',
    extend: {
      colors: {
        primary: {
          "50":"#fefce8",
          "100":"#fef9c3",
          "200":"#fef08a",
          "300":"#fde047",
          "400":"#facc15",
          "500":"#eab308",
          "600":"#ca8a04",
          "700":"#a16207",
          "800":"#854d0e",
          "900":"#713f12",
          "950":"#422006"
        },
        secondary: {
          "50":"#f8fafc",
          "100":"#f1f5f9",
          "200":"#e2e8f0",
          "300":"#cbd5e1",
          "400":"#94a3b8",
          "500":"#64748b",
          "600":"#475569",
          "700":"#334155",
          "800":"#1e293b",
          "900":"#0f172a",
          "950":"#020617"
        },
      },
      fontFamily: {
        'body': [
          'Poppins',
          // 'Open Sans', 
          // 'ui-sans-serif', 
          // 'system-ui', 
          // '-apple-system', 
          // 'system-ui', 
          // 'Segoe UI', 
          // 'Roboto', 
          // 'Helvetica Neue', 
          // 'Arial', 
          // 'Noto Sans', 
          // 'sans-serif', 
          // 'Apple Color Emoji', 
          // 'Segoe UI Emoji', 
          // 'Segoe UI Symbol', 
          // 'Noto Color Emoji'
        ],
        'sans': [
          'Poppins',
          // 'Open Sans', 
          // 'ui-sans-serif', 
          // 'system-ui', 
          // '-apple-system', 
          // 'system-ui', 
          // 'Segoe UI', 
          // 'Roboto', 
          // 'Helvetica Neue', 
          // 'Arial', 
          // 'Noto Sans', 
          // 'sans-serif', 
          // 'Apple Color Emoji', 
          // 'Segoe UI Emoji', 
          // 'Segoe UI Symbol', 
          // 'Noto Color Emoji'
        ],
      },
      },
      fontSize: {
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '30px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '42px'],
        '5xl': ['48px', '56px'],
        '6xl': ['64px', '72px'],
      },
    },
  plugins: [],
};
