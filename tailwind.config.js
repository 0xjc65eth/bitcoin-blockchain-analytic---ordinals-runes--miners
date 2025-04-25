/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'darkBg': '#0a0a0a',
        'gray-medium': '#1a1a1a',
        'white-text': '#ffffff',
        'neon-blue': '#00f2ff',
        'neon-pink': '#ff00ff',
        'neon-green': '#39ff14',
        'cyber-black': '#0a0a0a',
        'cyber-gray': '#1a1a1a',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00f2ff, 0 0 20px #00f2ff' },
          '100%': { textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00f2ff, 0 0 40px #00f2ff' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}; 