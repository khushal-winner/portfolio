/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#111314',
          secondary: '#1a1d1e',
          elevated: '#222629',
        },
        accent: {
          primary: '#00bcd4',
          light: '#4dd0e1',
          glow: 'rgba(0, 188, 212, 0.15)',
        },
        text: {
          primary: '#f0f0f0',
          secondary: '#a0a8b0',
          muted: '#606870',
        },
        border: {
          default: '#2e3338',
        },
        danger: '#e53935',
        success: '#4caf50',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        script: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        pill: '20px',
        profile: '16px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        hover: '0 8px 32px rgba(0, 188, 212, 0.15)',
        'input-focus': '0 0 0 2px rgba(0, 188, 212, 0.4)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
