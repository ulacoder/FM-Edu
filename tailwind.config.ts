import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mint': {
          DEFAULT: '#D1F2EB',
          whisper: '#D1F2EB',
        },
        'emerald': {
          DEFAULT: '#50C878',
          green: '#50C878',
        },
        'royal': {
          DEFAULT: '#0B6E4F',
          amethyst: '#0B6E4F',
        },
        'evergreen': {
          DEFAULT: '#013220',
          dark: '#013220',
        },
      },
    },
  },
  plugins: [],
};

export default config;
