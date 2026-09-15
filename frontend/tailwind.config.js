/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#800020',
          hover: '#650019',
        },
        accent: '#C9A227',
        background: '#FFFAF0',
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F6EEE3',
        },
        rose: '#E8C7C8',
        brand: {
          DEFAULT: '#800020',
          dark: '#650019',
          light: '#E8C7C8',
        },
        maroon: {
          DEFAULT: '#800020',
          dark: '#650019',
          light: '#800020',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#C9A227',
          dark: '#C9A227',
        },
        ivory: {
          DEFAULT: '#FFFAF0',
          dark: '#F6EEE3',
        },
        bottle: {
          DEFAULT: '#292525', // Maps to user's text-primary for dark backgrounds like footer
          light: '#4a4441',
        },
        gray: {
          50: '#FFFAF0',
          100: '#F6EEE3',
          200: '#E5D8CB',
          300: '#d5c4b3',
          400: '#a69993',
          500: '#8a807c',
          600: '#6F6662',
          700: '#5a5350',
          800: '#4a4441',
          900: '#292525',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
