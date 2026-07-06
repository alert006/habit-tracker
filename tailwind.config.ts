import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF9F5',
          soft: '#F1EFE7',
        },
        ink: {
          DEFAULT: '#1C1B18',
          soft: '#4A4842',
        },
        charcoal: {
          DEFAULT: '#14171A',
          soft: '#1D2126',
          softer: '#262B31',
        },
        moss: {
          50: '#EEF6F0',
          100: '#D7EBDD',
          200: '#B0D7BC',
          300: '#84BE96',
          400: '#5FA778',
          500: '#3D8B5C',
          600: '#2F6B4A',
          700: '#255639',
          800: '#1D4530',
          900: '#153525',
        },
        amber: {
          50: '#FDF6E9',
          100: '#FAE9C4',
          200: '#F5D48F',
          300: '#EFBB5C',
          400: '#E8A33D',
          500: '#D6862A',
          600: '#B36A20',
          700: '#8C521B',
        },
        clay: {
          400: '#D97757',
          500: '#C25F3F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(28 27 24 / 0.04), 0 4px 12px -2px rgb(28 27 24 / 0.06)',
        card: '0 1px 3px 0 rgb(28 27 24 / 0.06), 0 8px 20px -4px rgb(28 27 24 / 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(120vh) rotate(360deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
