import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin"; // Import plugin utility

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'text-transparent',
    'bg-clip-text',
    'bg-gradient-to-tr',
    'from-[#FD4B7A]',
    'to-[#4D00AE]',
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        black: '#000',
        white: '#fff',
        primary: '#0976DF',
        primarylight: '#97D7FF',
        secondary: '#21154B',
        footer: '#0D2B5A',
        borderclr: '#999999',
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        denton: ["Denton Test"],
        monte: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        custom: '0px 14px 44px 0px #54A3DA33',
      },
      keyframes: {
        'scroll-horizontal': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideFadeIn: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'scroll-horizontal': 'scroll-horizontal 15s linear infinite',
        'slide-fade-in': 'slideFadeIn 0.6s ease-out forwards',
      },
      inset: {
        unset: 'unset',
      },
      backgroundPosition: {
        'bottom-left': 'bottom left',
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents }) => {
      addBase({
        '.h1': {
          '@apply font-bold font-denton capitalize text-[45px] sm:text-[60px] md:text-[70px] lg:text-[80px] xl:text-[100px] 2xl:text-[120px] 2xl:leading-[140%] xl:leading-[140%] lg:leading-[130%] md:leading-[120%] sm:leading-[120%] leading-[120%]': {},
        },
        '.h2': {
          '@apply font-bold font-denton capitalize text-[40px] sm:text-[50px] md:text-[60px] lg:text-[80px] xl:text-[100px] 2xl:text-[100px] leading-[100%]': {},
        },
        '.h3': {
          '@apply font-bold font-denton capitalize text-[25px] sm:text-[30px] md:text-[40px] lg:text-[50px] xl:text-[60px] 2xl:text-[62px] leading-[100%]': {},
        },
        '.h4': {
          '@apply font-medium font-denton text-[20px] sm:text-[20px] md:text-[25px] lg:text-[30px] xl:text-[36px] 2xl:text-[36px] leading-[100%]': {},
        },

        '.h5': {
          '@apply font-medium font-denton text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px] xl:text-[25px] 2xl:text-[25px] leading-[100%]': {},
        },
        '.p': {
          '@apply font-normal text-[18px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] 2xl:text-[20px] leading-[25px] sm:leading-[25px] md:leading-[25px] lg:leading-[25px] xl:leading-[30px] 2xl:leading-[30px]': {},
        }
      });

      addComponents({
        '.btn-primary-outline': {
          '@apply p-[1px] rounded-[50px] bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 leading-[100%]': {},
        },
        '.btn-primary': {
          '@apply rounded-[50px] bg-[#232323] group-hover:bg-gradient-to-r group-hover:from-[#E72125] group-hover:to-[#8E1D1D] group-disabled:hover:bg-none text-white group-hover:text-white px-[40px] 2xl:py-[20px] xl:py-[20px] lg:py-[20px] md:py-[15px] sm:py-[15px] py-[15px] flex justify-center items-center text-center font-denton font-bold text-[18px] transition-all duration-300 leading-[24px]': {},
        },
      });
    }),
    
  ],
};

export default config;
