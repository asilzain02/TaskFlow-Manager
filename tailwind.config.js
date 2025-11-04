/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'workloop': {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8b86d',
          400: '#f59332',
          500: '#f2750a',
          600: '#e35d05',
          700: '#bc4508',
          800: '#95370e',
          900: '#782f0f',
        },
        'workloop-teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
};
