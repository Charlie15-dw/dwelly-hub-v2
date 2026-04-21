import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // navy → Apple near-black (sidebar, dark surfaces, headings)
        navy: {
          DEFAULT: '#1D1D1F',
          50:  '#F5F5F7',
          100: '#E8E8ED',
          200: '#D2D2D7',
          300: '#AEAEB2',
          400: '#8E8E93',
          500: '#636366',
          600: '#48484A',
          700: '#3A3A3C',
          800: '#2C2C2E',
          900: '#1D1D1F',
        },
        // teal → Apple mid-gray (secondary text, inactive labels, links)
        teal: {
          DEFAULT: '#6E6E73',
          50:  '#F5F5F7',
          100: '#E8E8ED',
          200: '#D2D2D7',
          300: '#AEAEB2',
          400: '#8E8E93',
          500: '#6E6E73',
          600: '#48484A',
          700: '#3A3A3C',
          800: '#2C2C2E',
          900: '#1D1D1F',
        },
        // gold → Apple dark gray (tertiary accents, muted callouts)
        gold: {
          DEFAULT: '#3A3A3C',
          50:  '#F5F5F7',
          100: '#E8E8ED',
          200: '#D2D2D7',
          300: '#AEAEB2',
          400: '#8E8E93',
          500: '#636366',
          600: '#48484A',
          700: '#3A3A3C',
          800: '#2C2C2E',
          900: '#1D1D1F',
        },
        // orange → Apple blue (primary CTA, active states — the single accent)
        orange: {
          DEFAULT: '#0071E3',
          50:  '#F0F7FF',
          100: '#CCE4FF',
          200: '#99C8FF',
          300: '#66ADFF',
          400: '#3391FF',
          500: '#0071E3',
          600: '#0064CC',
          700: '#0056B3',
          800: '#004A99',
          900: '#003D80',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 16px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)',
        panel:      '0 8px 32px 0 rgba(0,0,0,0.10)',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
      },
      backgroundImage: {
        'gradient-navy':   'linear-gradient(135deg, #D4F3EF 0%, #E8FAF8 100%)',
        'gradient-teal':   'linear-gradient(135deg, #C8EDEA 0%, #E0F7F4 100%)',
        'gradient-orange': 'linear-gradient(135deg, #0071E3 0%, #0077ED 100%)',
      },
    },
  },
  plugins: [],
}

export default config
