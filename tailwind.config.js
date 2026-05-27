/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080B11',       // Deep rich background
          card: '#111723',     // Elegant card background
          border: '#1E293B',   // Slate border
          accent: '#4F46E5',   // Indigo primary brand color
          accentLight: '#6366F1',
          text: '#F8FAFC',     // Crisp white text
          textMuted: '#94A3B8',// Slate grey text
        },
        profit: {
          DEFAULT: '#10B981',  // Emerald green
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        loss: {
          DEFAULT: '#F43F5E',  // Rose red
          bg: 'rgba(244, 63, 94, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 15px rgba(79, 70, 229, 0.15)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      }
    },
  },
  plugins: [],
}
