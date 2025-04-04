module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6D00", // Vibrant orange color
        secondary: "#FF9E00", // Lighter orange
        accent: "#FFBD45", // Very light orange for accents
        dark: "#000000", // Pure black
        darkgray: "#111111", // Very dark gray, almost black
        darkergray: "#0A0A0A", // Slightly darker for contrasts
        lightgray: "#E0E0E0", // Light gray for text on dark backgrounds
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        bounce: 'bounce 1s infinite',
        slideDown: 'slideDown 0.4s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        shine: 'shine 1.5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 109, 0, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 109, 0, 0.8)' },
        },
      },
      boxShadow: {
        'custom': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'custom-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 15px 0 rgba(255, 109, 0, 0.3)',
        'card-hover': '0 10px 30px -5px rgba(255, 109, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dot-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
} 