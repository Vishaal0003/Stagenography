/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#2D2D2D',
        'dark-card': '#1E1E1E',
        'dark-border': '#3D3D3D',
        'dark-input': '#1A1A1A',
        'accent-orange': '#F8F5F2',
        'accent-orange-hover': '#FFFFFF',
        'accent-orange-dark': '#E9E5E2',
        'text-dark': '#F8F5F2',
        'text-muted': '#A4A2A0',
      },
    },
  },
  plugins: [],
}
