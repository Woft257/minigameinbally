/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(168, 76%, 95%)',
          100: 'hsl(168, 76%, 87%)',
          200: 'hsl(168, 76%, 77%)',
          300: 'hsl(168, 76%, 65%)',
          400: 'hsl(168, 76%, 53%)',
          500: 'hsl(168, 76%, 42%)',
          600: 'hsl(168, 76%, 36%)',
          700: 'hsl(168, 76%, 29%)',
          800: 'hsl(168, 76%, 24%)',
          900: 'hsl(168, 76%, 20%)',
        },
        secondary: {
          50: 'hsl(25, 95%, 95%)',
          100: 'hsl(25, 95%, 87%)',
          200: 'hsl(25, 95%, 77%)',
          300: 'hsl(25, 95%, 65%)',
          400: 'hsl(25, 95%, 53%)',
          500: 'hsl(25, 95%, 42%)',
          600: 'hsl(25, 95%, 36%)',
          700: 'hsl(25, 95%, 29%)',
          800: 'hsl(25, 95%, 24%)',
          900: 'hsl(25, 95%, 20%)',
        },
        accent: {
          50: 'hsl(330, 81%, 95%)',
          100: 'hsl(330, 81%, 87%)',
          200: 'hsl(330, 81%, 77%)',
          300: 'hsl(330, 81%, 65%)',
          400: 'hsl(330, 81%, 53%)',
          500: 'hsl(330, 81%, 42%)',
          600: 'hsl(330, 81%, 36%)',
          700: 'hsl(330, 81%, 29%)',
          800: 'hsl(330, 81%, 24%)',
          900: 'hsl(330, 81%, 20%)',
        },
        bali: {
          emerald: 'hsl(156, 73%, 65%)',
          turquoise: 'hsl(177, 70%, 50%)',
          sunset: 'hsl(14, 91%, 65%)',
          coral: 'hsl(11, 93%, 72%)',
          gold: 'hsl(45, 100%, 60%)',
          jade: 'hsl(159, 64%, 35%)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        }
      },
      fontFamily: {
        'bali': ['Inter', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'bali-gradient': 'linear-gradient(135deg, hsl(168, 76%, 42%) 0%, hsl(177, 70%, 41%) 50%, hsl(156, 73%, 59%) 100%)',
        'sunset-gradient': 'linear-gradient(135deg, hsl(14, 91%, 60%) 0%, hsl(11, 93%, 68%) 50%, hsl(25, 95%, 53%) 100%)',
        'ocean-gradient': 'linear-gradient(135deg, hsl(190, 81%, 67%) 0%, hsl(168, 76%, 42%) 100%)',
        'tropical-gradient': 'linear-gradient(135deg, hsl(156, 73%, 59%) 0%, hsl(45, 100%, 51%) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'palm-sway': 'palm-sway 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0px) scale(1)' },
          '50%': { transform: 'translateX(10px) scale(1.05)' },
        },
        'palm-sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
};
