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
        // navy → Dwelly near-black (sidebar, dark surfaces, headings)
        navy: {
          DEFAULT: '#101010',
          50:  '#F2F2F3',
          100: '#E2E2E4',
          200: '#C8C8CC',
          300: '#AEAEB4',
          400: '#94949C',
          500: '#7D7C86',
          600: '#5E5E65',
          700: '#404044',
          800: '#262628',
          900: '#101010',
        },
        // teal → Dwelly bombay-grey (secondary text, inactive labels, links)
        teal: {
          DEFAULT: '#7D7C86',
          50:  '#F2F2F3',
          100: '#E2E2E4',
          200: '#C8C8CC',
          300: '#AEAEB4',
          400: '#94949C',
          500: '#7D7C86',
          600: '#5E5E65',
          700: '#404044',
          800: '#262628',
          900: '#101010',
        },
        // gold → Dwelly dark grey (tertiary accents, muted callouts)
        gold: {
          DEFAULT: '#404044',
          50:  '#F2F2F3',
          100: '#E2E2E4',
          200: '#C8C8CC',
          300: '#AEAEB4',
          400: '#94949C',
          500: '#7D7C86',
          600: '#5E5E65',
          700: '#404044',
          800: '#262628',
          900: '#101010',
        },
        // orange → Dwelly accent blue (primary CTA, active states — the single accent)
        orange: {
          DEFAULT: '#2C68ED',
          50:  '#EEF3FE',
          100: '#D5E1FB',
          200: '#ABC3F8',
          300: '#80A4F4',
          400: '#5686F1',
          500: '#2C68ED',
          600: '#295DD2',
          700: '#2551B4',
          800: '#214595',
          900: '#1D3873',
        },
        // sunset → Dwelly's secondary-button gradient colours (used via
        // bg-gradient-sunset below; also handy as flat start/end accents)
        sunset: {
          start: '#FF3264',
          end:   '#FF850A',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
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
        'gradient-navy':   'linear-gradient(135deg, #F6F6F7 0%, #FFFFFF 100%)',
        'gradient-teal':   'linear-gradient(135deg, #EEF3FE 0%, #F6F6F7 100%)',
        'gradient-orange': 'linear-gradient(135deg, #2C68ED 0%, #3D74EE 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF3264 0%, #FF850A 100%)',
      },
    },
  },
  plugins: [],
}

export default config
