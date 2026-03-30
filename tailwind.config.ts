import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff5f2',
          100: '#dce7e4',
          200: '#b8d2cc',
          300: '#93b0ac',
          400: '#738b8a',
          500: '#5b7778',
          600: '#49605f',
          700: '#354949',
          800: '#263434',
          900: '#172121'
        }
      }
    }
  },
  plugins: []
};

export default config;
