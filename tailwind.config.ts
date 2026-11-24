import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Times New Roman'", 'Times', 'serif'],
        serif: ["'Times New Roman'", 'Times', 'serif'],
      },
      colors: {
        navy: { DEFAULT: '#0B2A6B', dark: '#081F4F', light: '#16409A' },
        brand: { DEFAULT: '#FF6A00', dark: '#E55E00' },
      },
    },
  },
  plugins: [],
};
export default config;
