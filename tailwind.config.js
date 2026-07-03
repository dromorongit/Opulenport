/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B0F19',
          light: '#151B2C',
        },
        gold: {
          DEFAULT: '#C9A24B',
          bright: '#E4C878',
        },
        cream: '#F5F1E8',
        'slate-muted': '#8B8FA3',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
