/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070B14',
          900: '#0B1120',
          850: '#0D1527',
          800: '#0F172A',
          700: '#131D38',
        },
        charcoal: {
          950: '#0A0F1D',
          900: '#0F172A',
          850: '#111C35',
          800: '#141E33',
          750: '#17233D',
          700: '#1E293B',
          600: '#334155',
          border: '#1E293B',
        },
        cyan: {
          accent: '#00E5FF',
          glow: 'rgba(0, 229, 255, 0.35)',
          bright: '#38BDF8',
          deep: '#0284C7',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          glow: '#00ff88',
        },
        bloomberg: {
          bg: '#0c0f12',
          card: '#14181d',
          amber: '#ff9900',
          amberGlow: 'rgba(255, 153, 0, 0.25)',
          border: '#2a333d',
        },
        cyber: {
          bg: '#05070e',
          neonCyan: '#00f3ff',
          neonPink: '#ff007f',
          neonYellow: '#ffe600',
          card: '#0a101f',
          border: '#1b2a4a',
        },
        nordic: {
          bg: '#0b1311',
          surface: '#152420',
          sage: '#4ade80',
          wood: '#d4a373',
          border: '#1f3830',
        },
        stealth: {
          bg: '#08080a',
          surface: '#121216',
          crimson: '#ef4444',
          subtle: '#27272a',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Space Grotesk', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'scanline': 'scanline 6s linear infinite',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 255, 136, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 255, 136, 0.6), 0 0 50px rgba(0, 255, 136, 0.3)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}

