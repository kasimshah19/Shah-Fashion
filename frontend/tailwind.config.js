/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C66385',
          dark: '#A84E6D',
          light: '#D97FA0',
        },
        maroon: {
          DEFAULT: '#7A0C2E',
          dark: '#5A0822',
          light: '#9E1A42',
        },
        gold: {
          DEFAULT: '#C9A24B',
          light: '#E0C078',
          dark: '#A8853A',
        },
        ivory: {
          DEFAULT: '#FDF8F1',
          dark: '#F5EDE0',
        },
        bottle: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
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
