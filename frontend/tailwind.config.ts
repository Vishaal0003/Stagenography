/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f0f0f',
        'dark-card': '#1a1a1a',
        'dark-border': '#2a2a2a',
        'dark-input': '#262626',
        'accent-orange': '#ff7a3d',
        'accent-orange-hover': '#ff8a52',
        'accent-orange-dark': '#ff6b1f',
        'text-dark': '#e5e5e5',
        'text-muted': '#a0a0a0',
      },
    },
  },
  plugins: [],
}
