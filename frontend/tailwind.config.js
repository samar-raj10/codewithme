/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        leetcode: {
          orange: '#FFA116',
          'orange-hover': '#E28C09',
          green: '#2CBB5D',
          red: '#EF4743',
          yellow: '#FFC01E',
          purple: '#B15EFF',
          dark: '#1A1A1A',
          'dark-card': '#282828',
          'dark-border': '#3E3E3E',
          'dark-muted': '#A0A0A0'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
