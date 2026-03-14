/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg:       '#0b0b10',
        surface:  '#13131c',
        surface2: '#1c1c28',
        border:   '#2a2a3d',
        accent:   '#6c63ff',
        accent2:  '#ff6b9d',
        green:    '#00e5a0',
        yellow:   '#ffc542',
        red:      '#ff5c6a',
      },
    },
  },
  plugins: [],
}