import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2fff9',
          100: '#dcfff0',
          200: '#b5fee2',
          300: '#7deecf',
          400: '#43d9b9',
          500: '#00bd9b',
          600: '#008b75',
          700: '#006751',
          800: '#00493e',
          900: '#003230'
        }
      }
    }
  },
  plugins: []
};

export default config;
